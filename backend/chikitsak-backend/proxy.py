# proxy.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, re

app = Flask(__name__)
CORS(app)  # allow browser requests from http://127.0.0.1:5500 etc.

# LM Studio OpenAI-compatible endpoint
LMSTUDIO_URL = "http://127.0.0.1:1234/v1/chat/completions"

# --- helpers ---------------------------------------------------------------
TAG_PATTERNS = [
    (r"<think>.*?</think>", re.IGNORECASE | re.DOTALL),
    (r"</?answer>", re.IGNORECASE),
    (r"</?final(?:_answer)?>", re.IGNORECASE),
    (r"</?reasoning>", re.IGNORECASE),
    (r"<\|.*?\|>", 0),                 # e.g., <|assistant|>
    (r"<[^>\n]{1,60}>", 0),            # any short xml-ish tag
]

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    cleaned = text
    for patt, flags in TAG_PATTERNS:
        cleaned = re.sub(patt, "", cleaned, flags=flags)
    return cleaned.strip()

def inject_plaintext_system_instruction(messages):
    """Ensure responses are plain text without XML-like tags."""
    instruction = (
        "Respond in plain text only. Do NOT include any XML-like tags such as "
        "<think>, <Answer>, <final>, or similar. Provide the final answer only."
    )
    if messages and isinstance(messages, list) and messages[0].get("role") == "system":
        messages[0]["content"] = f'{messages[0].get("content","")}\n\n{instruction}'.strip()
    else:
        messages.insert(0, {"role": "system", "content": instruction})
    return messages

# --- routes ----------------------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return "✅ Proxy is running. POST chat JSON to /chat"

@app.route("/chat", methods=["POST"])
def chat():
    try:
        payload = request.get_json(force=True)
        if not payload or "messages" not in payload:
            return jsonify({"error": "'messages' field is required"}), 400

        # Make sure we ask the model to return plain text
        payload["messages"] = inject_plaintext_system_instruction(payload["messages"])

        # Forward to LM Studio
        resp = requests.post(LMSTUDIO_URL, json=payload, timeout=600)
        resp.raise_for_status()
        lm = resp.json()

        # Extract content safely
        content = ""
        try:
            content = lm["choices"][0]["message"]["content"]
        except Exception:
            content = ""

        cleaned = clean_text(content)

        return jsonify({
            "message": cleaned,
            "usage": lm.get("usage", {}),
            "model": lm.get("model"),
            "id": lm.get("id")
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Upstream error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run on 127.0.0.1:5000
    app.run(host="127.0.0.1", port=5000, debug=True)
