import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const VoiceChat = ({ onMessage, isListening, onToggleListening }) => {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      initializeSpeechRecognition();
    }

    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pa-IN'; // Punjabi (India)
    
    // Fallback languages if Punjabi is not available
    const supportedLanguages = ['pa-IN', 'hi-IN', 'en-IN', 'en-US'];
    recognition.lang = supportedLanguages[0];

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);

      if (finalTranscript) {
        onMessage(finalTranscript);
        setTranscript('');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'language-not-supported') {
        // Try fallback language
        recognition.lang = 'hi-IN';
        recognition.start();
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart if still listening
      }
    };

    recognitionRef.current = recognition;
  };

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    
    onToggleListening();
  };

  const speakText = (text, language = 'pa-IN') => {
    if (!synthRef.current) return;

    // Stop any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a Punjabi voice, fallback to Hindi or English
    const voices = synthRef.current.getVoices();
    const punjabiVoice = voices.find(voice => voice.lang.startsWith('pa'));
    const hindiVoice = voices.find(voice => voice.lang.startsWith('hi'));
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));

    if (punjabiVoice) {
      utterance.voice = punjabiVoice;
    } else if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else if (englishVoice) {
      utterance.voice = englishVoice;
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const commonPhrases = [
    { punjabi: 'ਮੈਨੂੰ ਬੁਖਾਰ ਹੈ', english: 'I have fever', audio: 'ਮੈਨੂੰ ਬੁਖਾਰ ਹੈ' },
    { punjabi: 'ਮੈਨੂੰ ਖੰਘ ਹੈ', english: 'I have cough', audio: 'ਮੈਨੂੰ ਖੰਘ ਹੈ' },
    { punjabi: 'ਮੇਰਾ ਸਿਰ ਦੁਖਦਾ ਹੈ', english: 'I have headache', audio: 'ਮੇਰਾ ਸਿਰ ਦੁਖਦਾ ਹੈ' },
    { punjabi: 'ਮੇਰਾ ਪੇਟ ਦੁਖਦਾ ਹੈ', english: 'I have stomach pain', audio: 'ਮੇਰਾ ਪੇਟ ਦੁਖਦਾ ਹੈ' },
    { punjabi: 'ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਿਲ ਹੈ', english: 'I have breathing difficulty', audio: 'ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਿਲ ਹੈ' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ਆਵਾਜ਼ ਚੈਟ (Voice Chat)
          </h2>
          <p className="text-gray-600">
            ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ ਅਤੇ AI ਨਾਲ ਗੱਲ ਕਰੋ (Speak in Punjabi and chat with AI)
          </p>
        </div>

        {!isSupported && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p>Speech recognition is not supported in your browser. Please use Chrome or Edge.</p>
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex justify-center gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            disabled={!isSupported}
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            {isListening ? 'ਸੁਣਨਾ ਬੰਦ ਕਰੋ (Stop)' : 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ (Start Speaking)'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all ${
              isSpeaking 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            {isSpeaking ? 'ਬੰਦ ਕਰੋ (Stop Audio)' : 'ਆਵਾਜ਼ (Audio)'}
          </motion.button>
        </div>

        {/* Live Transcript */}
        {transcript && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">ਸੁਣਿਆ ਜਾ ਰਿਹਾ ਹੈ (Listening...):</h3>
            <p className="text-blue-800">{transcript}</p>
          </div>
        )}

        {/* Quick Phrases */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">
            ਆਮ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਵਾਕ (Common Phrases)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {commonPhrases.map((phrase, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 p-4 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  onMessage(phrase.english);
                  speakText(phrase.audio);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{phrase.punjabi}</p>
                    <p className="text-gray-600 text-sm">{phrase.english}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(phrase.audio);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-2"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 ਹਦਾਇਤਾਂ (Instructions)
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• ਮਾਈਕ ਬਟਨ ਦਬਾਓ ਅਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ (Press mic button and speak in Punjabi)</li>
            <li>• ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਸਪਸ਼ਟ ਰੂਪ ਵਿੱਚ ਬੋਲੋ (Speak clearly about your symptoms)</li>
            <li>• AI ਤੁਹਾਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦੇਵੇਗਾ (AI will respond in Punjabi)</li>
            <li>• ਜੇ ਆਵਾਜ਼ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ, ਤਾਂ ਆਮ ਵਾਕ ਵਰਤੋ (If voice doesn't work, use common phrases)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;