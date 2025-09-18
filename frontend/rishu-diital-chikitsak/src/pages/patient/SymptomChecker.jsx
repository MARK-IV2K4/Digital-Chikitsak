import React, { useState, useRef, useEffect } from 'react'
import Header from '../../components/Header'
import PatientSidebar from '../../components/PatientSidebar'
import api from '../../services/api'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, User, AlertTriangle } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function SymptomChecker() {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ ਅਤੇ ਮੈਂ ਤੁਹਾਨੂੰ ਸਹੀ ਸਲਾਹ ਦੇਵਾਂਗਾ।\n\nHi! I am your AI health assistant. Tell me your symptoms and I will provide you with the best guidance possible.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [synthesis, setSynthesis] = useState(null)
  const messagesEndRef = useRef(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'pa-IN' // Punjabi (India)

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        toast.success('ਆਵਾਜ਼ ਸੁਣੀ ਗਈ (Voice captured)')
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'language-not-supported') {
          recognitionInstance.lang = 'hi-IN' // Fallback to Hindi
          toast.error('ਪੰਜਾਬੀ ਸਪੋਰਟ ਨਹੀਂ, ਹਿੰਦੀ ਵਰਤ ਰਹੇ ਹਾਂ (Using Hindi as fallback)')
        } else {
          toast.error('ਆਵਾਜ਼ ਸੁਣਨ ਵਿੱਚ ਸਮਸਿਆ (Voice recognition error)')
        }
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }

    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
      if (synthesis) {
        synthesis.cancel()
      }
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check for pre-selected patient from family management
  useEffect(() => {
    const storedPatient = localStorage.getItem('selectedPatient')
    if (storedPatient) {
      try {
        const patient = JSON.parse(storedPatient)
        // Add a welcome message for the selected patient
        const welcomeMsg = {
          from: 'bot',
          text: `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${patient.name}! ਮੈਂ ${patient.name} ਦੇ ਲੱਛਣਾਂ ਬਾਰੇ ਸੁਣਨ ਲਈ ਤਿਆਰ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਕੀ ਸਮਸਿਆ ਹੈ?\n\nHello ${patient.name}! I'm ready to listen about ${patient.name}'s symptoms. Please tell me what the problem is?`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, welcomeMsg])
        
        // Clear the stored patient after use
        localStorage.removeItem('selectedPatient')
      } catch (error) {
        console.error('Error parsing selected patient:', error)
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      toast.error('ਆਵਾਜ਼ ਸਪੋਰਟ ਨਹੀਂ (Voice not supported)')
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
      toast.success('ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ (Start speaking)')
    }
  }

  const speakText = (text) => {
    if (!synthesis) {
      toast.error('ਆਵਾਜ਼ ਸਪੋਰਟ ਨਹੀਂ (Speech not supported)')
      return
    }

    synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pa-IN'
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1

    // Try to find Punjabi voice, fallback to Hindi or English
    const voices = synthesis.getVoices()
    const punjabiVoice = voices.find(voice => voice.lang.startsWith('pa'))
    const hindiVoice = voices.find(voice => voice.lang.startsWith('hi'))
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'))

    if (punjabiVoice) {
      utterance.voice = punjabiVoice
    } else if (hindiVoice) {
      utterance.voice = hindiVoice
      utterance.lang = 'hi-IN'
    } else if (englishVoice) {
      utterance.voice = englishVoice
      utterance.lang = 'en-IN'
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel()
      setIsSpeaking(false)
    }
  }

  async function send() {
    if (!input.trim()) return

    const userMsg = {
      from: 'user',
      text: input,
      timestamp: new Date()
    }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Enhanced API call with symptoms context
      const res = await api.post('/ai/symptom', {
        prompt: input,
        messages: messages.slice(-5).map(m => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        symptoms: [] // Could be populated from previous symptom selection
      })

      const text = res?.data?.message || 'ਮਾਫ਼ ਕਰਨਾ, AI ਤੋਂ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ। (Sorry, AI did not return a response.)'

      const botMsg = {
        from: 'bot',
        text: text,
        timestamp: new Date()
      }

      setMessages(m => [...m, botMsg])

      // Auto-speak the response
      setTimeout(() => {
        speakText(text)
      }, 500)

    } catch (err) {
      console.error('AI Error:', err)
      const errorMsg = {
        from: 'bot',
        text: 'ਮਾਫ਼ ਕਰਨਾ, AI ਸੇਵਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ। (Sorry, AI service is unavailable. Please try again later.)',
        timestamp: new Date()
      }
      setMessages(m => [...m, errorMsg])
      toast.error('AI ਸੇਵਾ ਵਿੱਚ ਸਮਸਿਆ (AI service error)')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const quickPhrases = [
    'ਮੈਨੂੰ ਬੁਖਾਰ ਹੈ (I have fever)',
    'ਮੈਨੂੰ ਖੰਘ ਹੈ (I have cough)',
    'ਮੇਰਾ ਸਿਰ ਦੁਖਦਾ ਹੈ (I have headache)',
    'ਮੇਰਾ ਪੇਟ ਦੁਖਦਾ ਹੈ (I have stomach pain)',
    'ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਿਲ ਹੈ (I have breathing difficulty)'
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" />
      <Header />
      <div className="flex flex-1">
        <PatientSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                AI ਲੱਛਣ ਜਾਂਚਕਰਤਾ (AI Symptom Checker)
              </h1>
              <p className="text-gray-600">
                ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ ਅਤੇ AI ਤੋਂ ਸਿਹਤ ਸਲਾਹ ਪਾਓ (Speak in Punjabi and get health advice from AI)
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chat Area */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm">
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {messages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.from === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                            {m.from === 'bot' ? <Bot size={16} /> : <User size={16} />}
                          </div>
                          <div className={`p-4 rounded-lg ${m.from === 'bot'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-600 text-white'
                            }`}>
                            <p className="whitespace-pre-wrap">{m.text}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {m.timestamp?.toLocaleTimeString()}
                              </span>
                              {m.from === 'bot' && (
                                <button
                                  onClick={() => speakText(m.text)}
                                  className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
                                >
                                  <Volume2 size={12} />
                                  ਸੁਣੋ
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Bot size={16} />
                          </div>
                          <div className="bg-gray-100 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span className="text-gray-600">ਸੋਚ ਰਿਹਾ ਹਾਂ... (Thinking...)</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={toggleListening}
                        className={`p-3 rounded-full transition-colors ${isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        title={isListening ? 'ਸੁਣਨਾ ਬੰਦ ਕਰੋ' : 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ'}
                      >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>

                      <button
                        onClick={isSpeaking ? stopSpeaking : () => { }}
                        className={`p-3 rounded-full transition-colors ${isSpeaking
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                          }`}
                        title={isSpeaking ? 'ਆਵਾਜ਼ ਬੰਦ ਕਰੋ' : 'ਆਵਾਜ਼'}
                      >
                        {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>

                      <div className="flex-1 flex gap-2">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ... (Describe your symptoms...)"
                          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="2"
                        />
                        <button
                          onClick={send}
                          disabled={loading || !input.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send size={16} />
                          ਭੇਜੋ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Phrases */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Mic size={16} />
                    ਆਮ ਵਾਕ (Quick Phrases)
                  </h3>
                  <div className="space-y-2">
                    {quickPhrases.map((phrase, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(phrase)}
                        className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-green-50 rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold mb-4 text-green-800">
                    💡 ਹਦਾਇਤਾਂ (Instructions)
                  </h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• ਮਾਈਕ ਬਟਨ ਦਬਾ ਕੇ ਬੋਲੋ</li>
                    <li>• ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਰਤੋ</li>
                    <li>• AI ਜਵਾਬ ਸੁਣਨ ਲਈ ਸਪੀਕਰ ਬਟਨ ਦਬਾਓ</li>
                    <li>• ਆਮ ਵਾਕ ਵਰਤ ਸਕਦੇ ਹੋ</li>
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-yellow-600 mt-1" size={16} />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ ਚੇਤਾਵਨੀ (Disclaimer)</h4>
                      <p className="text-sm text-yellow-700">
                        ਇਹ AI ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਹੈ। ਡਾਕਟਰੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ। ਗੰਭੀਰ ਸਮਸਿਆ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ।
                      </p>
                      <p className="text-xs text-yellow-600 mt-2">
                        This AI is for information only. Not a substitute for medical advice. Consult a doctor for serious issues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
