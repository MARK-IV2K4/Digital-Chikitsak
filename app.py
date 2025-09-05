from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql, uuid, requests, os, datetime
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_conn, ensure_database_and_tables
from dotenv import load_dotenv
import re
import jwt

load_dotenv()
LMSTUDIO_URL = os.getenv("LMSTUDIO_URL", "http://127.0.0.1:1234/v1/chat/completions")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "qwen3")

app = Flask(__name__)
CORS(app)

# Robust cleaning like proxy.py
TAG_PATTERNS = [
    (r"<think>.*?</think>", re.IGNORECASE | re.DOTALL),
    (r"</?answer>", re.IGNORECASE),
    (r"</?final(?:_answer)?>", re.IGNORECASE),
    (r"</?reasoning>", re.IGNORECASE),
    (r"<\|.*?\|>", 0),
    (r"<[^>\n]{1,60}>", 0),
]

def clean_text(text):
    if not isinstance(text, str):
        return ""
    cleaned = text
    for patt, flags in TAG_PATTERNS:
        cleaned = re.sub(patt, "", cleaned, flags=flags)
    return cleaned.strip()

def inject_plaintext_system_instruction(messages):
    instruction = (
        "Respond in plain text only. Do NOT include any XML-like tags such as "
        "<think>, <Answer>, <final>, or similar. Provide the final answer only."
    )
    if messages and isinstance(messages, list) and messages[0].get("role") == "system":
        messages[0]["content"] = f'{messages[0].get("content","")}\n\n{instruction}'.strip()
    else:
        messages.insert(0, {"role": "system", "content": instruction})
    return messages

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change")
JWT_ALG = "HS256"

def create_token(payload: dict) -> str:
    to_encode = {
        **payload,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALG)

def require_auth(fn):
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "missing bearer token"}), 401
        token = auth.split(" ", 1)[1]
        try:
            user = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        except Exception:
            return jsonify({"error": "invalid token"}), 401
        request.user = user
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    # accept either 'pin' or 'password' from clients
    phone = data.get("phone")
    pin = data.get("pin") or data.get("password")
    name = data.get("name")
    role = data.get("role", "patient")
    if not phone or not pin:
        return jsonify({"error": "phone and pin required"}), 400
    cn = get_conn()
    cur = cn.cursor()
    cur.execute("SELECT phone FROM accounts WHERE phone=%s", (phone,))
    if cur.fetchone():
        return jsonify({"error": "already registered"}), 409
    hashed = generate_password_hash(pin)
    cur.execute("INSERT INTO accounts (phone,pin_hash,name,role) VALUES (%s,%s,%s,%s)", (phone, hashed, name, role))
    # If registering a patient account, create a default self patient row
    if role == "patient":
        pid = str(uuid.uuid4())
        cur.execute(
            """
            INSERT INTO patients (patient_id, phone, name, age, gender, blood_group, current_medications, medical_history)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (pid, phone, name or phone, None, None, None, "", "")
        )
    cn.commit()
    # Auto-login response
    user = {"phone": phone, "name": name, "role": role}
    token = create_token(user)
    cur.close(); cn.close()
    return jsonify({"token": token, "user": user})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    phone = data.get("phone")
    pin = data.get("pin") or data.get("password")
    if not phone or not pin:
        return jsonify({"error": "phone and pin required"}), 400
    cn = get_conn(); cur = cn.cursor()
    cur.execute("SELECT phone, pin_hash, name, role FROM accounts WHERE phone=%s", (phone,))
    row = cur.fetchone()
    if not row or not check_password_hash(row["pin_hash"], pin):
        return jsonify({"error": "invalid credentials"}), 401
    user = {"phone": row["phone"], "name": row.get("name"), "role": row["role"]}
    # ensure a default patient record exists for patient accounts
    if user["role"] == "patient":
        cur.execute("SELECT patient_id FROM patients WHERE phone=%s LIMIT 1", (user["phone"],))
        exists = cur.fetchone()
        if not exists:
            pid = str(uuid.uuid4())
            cur.execute(
                """
                INSERT INTO patients (patient_id, phone, name, age, gender, blood_group, current_medications, medical_history)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (pid, user["phone"], user.get("name") or user["phone"], None, None, None, "", "")
            )
            cn.commit()
    token = create_token(user)
    cur.close(); cn.close()
    return jsonify({"token": token, "user": user})

# One-time maintenance endpoint to backfill missing patient rows for existing accounts
@app.route("/api/admin/fix-patients", methods=["POST"]) 
def fix_patients():
    secret = request.args.get("secret")
    if secret != os.getenv("ADMIN_SECRET", "let-me-fix"):
        return jsonify({"error": "forbidden"}), 403
    cn = get_conn(); cur = cn.cursor()
    cur.execute("SELECT phone, name FROM accounts WHERE role='patient'")
    accounts = cur.fetchall()
    created = 0
    for acc in accounts:
        cur.execute("SELECT patient_id FROM patients WHERE phone=%s LIMIT 1", (acc["phone"],))
        if not cur.fetchone():
            pid = str(uuid.uuid4())
            cur.execute(
                """
                INSERT INTO patients (patient_id, phone, name, age, gender, blood_group, current_medications, medical_history)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (pid, acc["phone"], acc.get("name") or acc["phone"], None, None, None, "", "")
            )
            created += 1
    cn.commit(); cur.close(); cn.close()
    return jsonify({"created": created})

@app.route("/api/health", methods=["GET"]) 
def health():
    return jsonify({"ok": True})

@app.route("/api/patients", methods=["GET"]) 
@require_auth
def list_patients():
    user = request.user
    cn = get_conn(); cur = cn.cursor()
    if user.get("role") == "patient":
        cur.execute("SELECT * FROM patients WHERE phone=%s", (user["phone"],))
        rows = cur.fetchall()
        # Auto-provision a default self record if none exists
        if not rows:
            pid = str(uuid.uuid4())
            cur.execute(
                """
                INSERT INTO patients (patient_id, phone, name, age, gender, blood_group, current_medications, medical_history)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (pid, user["phone"], user.get("name") or user["phone"], None, None, None, "", "")
            )
            cn.commit()
            cur.execute("SELECT * FROM patients WHERE phone=%s", (user["phone"],))
        rows = cur.fetchall()
    else:
        # for doctors, allow optional phone filter
        phone = request.args.get("phone")
        if phone:
            cur.execute("SELECT * FROM patients WHERE phone=%s", (phone,))
        else:
            cur.execute("SELECT * FROM patients LIMIT 100")
    cur.close(); cn.close()
    return jsonify(rows)

@app.route("/api/patients", methods=["POST"]) 
@require_auth
def add_patient():
    user = request.user
    if user.get("role") != "patient":
        return jsonify({"error": "only patient accounts can add family"}), 403
    data = request.json or {}
    patient_id = str(uuid.uuid4())
    name = data.get("name")
    if not name:
        return jsonify({"error": "name required"}), 400
    age = data.get("age")
    gender = data.get("gender")
    blood_group = data.get("blood_group")
    medical_history = data.get("medical_history", "")
    current_medications = data.get("current_medications", "")
    cn = get_conn(); cur = cn.cursor()
    cur.execute(
        """
        INSERT INTO patients (patient_id, phone, name, age, gender, blood_group, current_medications, medical_history)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        (patient_id, user["phone"], name, age, gender, blood_group, current_medications, medical_history)
    )
    cn.commit()
    cur.close(); cn.close()
    return jsonify({"patient_id": patient_id})

@app.route("/api/consultations", methods=["GET"]) 
@require_auth
def list_consultations():
    user = request.user
    cn = get_conn(); cur = cn.cursor()
    if user.get("role") == "patient":
        cur.execute(
            """
            SELECT c.* FROM consultations c
            JOIN patients p ON p.patient_id=c.patient_id
            WHERE p.phone=%s
            ORDER BY c.consultation_id DESC
            """,
            (user["phone"],)
        )
    else:
        cur.execute("SELECT * FROM consultations WHERE doctor_id=%s ORDER BY consultation_id DESC", (user["phone"],))
    rows = cur.fetchall()
    cur.close(); cn.close()
    return jsonify(rows)

@app.route("/api/consultations", methods=["POST"]) 
@require_auth
def create_consultation():
    user = request.user
    data = request.json or {}
    patient_id = data.get("patient_id")
    doctor_id = data.get("doctor_id")
    symptoms = data.get("symptoms", "")
    if not patient_id:
        return jsonify({"error": "patient_id required"}), 400
    consultation_id = str(uuid.uuid4())
    # simple jitsi room name
    room = f"telemed-{consultation_id}"
    meeting_link = f"https://meet.jit.si/{room}"
    cn = get_conn(); cur = cn.cursor()
    cur.execute(
        """
        INSERT INTO consultations (consultation_id, patient_id, doctor_id, symptoms, meeting_link, status)
        VALUES (%s,%s,%s,%s,%s,%s)
        """,
        (consultation_id, patient_id, doctor_id, symptoms, meeting_link, "pending")
    )
    cn.commit()
    cur.close(); cn.close()
    return jsonify({"consultation_id": consultation_id, "meeting_link": meeting_link})

@app.route("/api/consultations/<cid>", methods=["GET"]) 
@require_auth
def get_consultation(cid: str):
    cn = get_conn(); cur = cn.cursor()
    cur.execute("SELECT * FROM consultations WHERE consultation_id=%s", (cid,))
    row = cur.fetchone()
    cur.close(); cn.close()
    if not row:
        return jsonify({"error": "not found"}), 404
    return jsonify(row)

@app.route("/api/chat", methods=["POST"]) 
@require_auth
def chat():
    data = request.json
    consult_id = data.get("consultation_id")
    patient_id = data.get("patient_id")
    message = data.get("message")
    if not consult_id or not patient_id or not message:
        return jsonify({"error": "missing fields"}), 400

    cn = get_conn()
    cur = cn.cursor()
    mid = str(uuid.uuid4())
    cur.execute("INSERT INTO chats (chat_id,consultation_id,patient_id,sender,message) VALUES (%s,%s,%s,%s,%s)", (mid, consult_id, patient_id, "patient", message))
    cn.commit()

    payload = {"model": DEFAULT_MODEL, "messages":[{"role":"user","content":message}]}
    resp = requests.post(LMSTUDIO_URL, json=payload, timeout=900)
    ai = clean_text(resp.json().get("choices")[0]["message"]["content"])

    mid2 = str(uuid.uuid4())
    cur.execute("INSERT INTO chats VALUES (%s,%s,%s,%s,%s)", (mid2, consult_id, patient_id, "ai", ai))
    cn.commit()
    cur.close(); cn.close()
    return jsonify({"reply": ai})

@app.route("/api/ai/symptom", methods=["POST"])
def ai_symptom():
    try:
        data = request.get_json(force=True) or {}
        prompt = data.get("prompt") or data.get("message") or data.get("text")
        messages = data.get("messages")
        if not prompt and not messages:
            return jsonify({"error": "prompt or messages required"}), 400
        if not messages:
            messages = [{"role": "user", "content": prompt}]
        messages = inject_plaintext_system_instruction(messages)
        payload = {"model": DEFAULT_MODEL, "messages": messages}
        resp = requests.post(LMSTUDIO_URL, json=payload, timeout=900)
        resp.raise_for_status()
        lm = resp.json()
        content = ""
        try:
            content = lm["choices"][0]["message"]["content"]
        except Exception:
            content = ""
        cleaned = clean_text(content)
        return jsonify({"message": cleaned, "raw": lm.get("id"), "model": lm.get("model")})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Upstream error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    ensure_database_and_tables()
    app.run(port=5000, debug=True)
