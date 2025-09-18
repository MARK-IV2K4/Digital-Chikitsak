import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SymptomSelector from '../../components/SymptomSelector';
import DecisionTree from '../../components/DecisionTree';
import VoiceChat from '../../components/VoiceChat';
import PharmacyFinder from '../../components/PharmacyFinder';
import { ArrowLeft, MessageCircle, Stethoscope, MapPin, Mic } from 'lucide-react';

const SymptomAnalysis = () => {
  const [currentStep, setCurrentStep] = useState('symptoms'); // symptoms, analysis, chat, pharmacy
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const steps = {
    symptoms: { title: 'ਲੱਛਣ ਚੁਣੋ', subtitle: 'Select Symptoms', icon: '🤒' },
    analysis: { title: 'ਸਿਫਾਰਸ਼ਾਂ', subtitle: 'Recommendations', icon: '📋' },
    chat: { title: 'AI ਚੈਟ', subtitle: 'AI Chat', icon: '💬' },
    pharmacy: { title: 'ਦਵਾਈ ਦੀ ਦੁਕਾਨ', subtitle: 'Find Pharmacy', icon: '🏪' }
  };

  const handleSymptomsNext = () => {
    if (selectedSymptoms.length > 0) {
      setCurrentStep('analysis');
    }
  };

  const handleRecommendation = (rec) => {
    setRecommendation(rec);
  };

  const handleChatMessage = async (message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);

    // Simulate AI response (in real app, this would call your backend)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(message, selectedSymptoms),
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (message, symptoms) => {
    // Simple response generation based on symptoms and message
    const responses = {
      fever: "ਬੁਖਾਰ ਲਈ ਪੈਰਾਸੀਟਾਮੋਲ ਲਓ ਅਤੇ ਆਰਾਮ ਕਰੋ। ਜੇ 3 ਦਿਨ ਬਾਅਦ ਵੀ ਬੁਖਾਰ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ। (Take paracetamol for fever and rest. If fever persists after 3 days, consult a doctor.)",
      cough: "ਖੰਘ ਲਈ ਗਰਮ ਪਾਣੀ ਪੀਓ ਅਤੇ ਸ਼ਹਿਦ ਲਓ। ਧੂੰਏਂ ਤੋਂ ਬਚੋ। (Drink warm water and take honey for cough. Avoid smoke.)",
      default: "ਮੈਂ ਤੁਹਾਡੀ ਸਮਸਿਆ ਸਮਝ ਗਿਆ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਹੋਰ ਦੱਸੋ। (I understand your problem. Please tell me more about your symptoms.)"
    };

    // Find relevant response based on symptoms
    for (const symptom of symptoms) {
      if (responses[symptom.id]) {
        return responses[symptom.id];
      }
    }

    return responses.default;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'symptoms':
        return (
          <SymptomSelector
            selectedSymptoms={selectedSymptoms}
            onSymptomsChange={setSelectedSymptoms}
            onNext={handleSymptomsNext}
          />
        );
      
      case 'analysis':
        return (
          <DecisionTree
            symptoms={selectedSymptoms}
            onRecommendation={handleRecommendation}
          />
        );
      
      case 'chat':
        return (
          <div className="space-y-6">
            <VoiceChat
              onMessage={handleChatMessage}
              isListening={isVoiceChatActive}
              onToggleListening={() => setIsVoiceChatActive(!isVoiceChatActive)}
            />
            
            {/* Chat Messages */}
            {chatMessages.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">ਗੱਲਬਾਤ (Conversation)</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'pharmacy':
        return (
          <PharmacyFinder
            recommendedMedicines={recommendation?.medicines || []}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentStep !== 'symptoms' && (
                <button
                  onClick={() => {
                    const stepOrder = ['symptoms', 'analysis', 'chat', 'pharmacy'];
                    const currentIndex = stepOrder.indexOf(currentStep);
                    if (currentIndex > 0) {
                      setCurrentStep(stepOrder[currentIndex - 1]);
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-3xl">{steps[currentStep].icon}</span>
                  {steps[currentStep].title}
                </h1>
                <p className="text-gray-600">{steps[currentStep].subtitle}</p>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {Object.entries(steps).map(([step, info], index) => (
                <button
                  key={step}
                  onClick={() => {
                    // Only allow navigation to completed steps
                    if (step === 'symptoms' || 
                        (step === 'analysis' && selectedSymptoms.length > 0) ||
                        (step === 'chat' && recommendation) ||
                        (step === 'pharmacy' && recommendation)) {
                      setCurrentStep(step);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === step
                      ? 'bg-blue-500 text-white'
                      : selectedSymptoms.length > 0 || step === 'symptoms'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={
                    step !== 'symptoms' && 
                    selectedSymptoms.length === 0 && 
                    !recommendation
                  }
                >
                  <span className="mr-2">{info.icon}</span>
                  {info.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      {currentStep === 'analysis' && recommendation && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setCurrentStep('chat')}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={18} />
                AI ਨਾਲ ਗੱਲ ਕਰੋ (Chat with AI)
              </button>
              <button
                onClick={() => setCurrentStep('pharmacy')}
                className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                <MapPin size={18} />
                ਦਵਾਈ ਲੱਭੋ (Find Medicine)
              </button>
              <button
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <Stethoscope size={18} />
                ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ (Consult Doctor)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-white rounded-full shadow-lg p-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-600">
              ਕਦਮ (Step) {Object.keys(steps).indexOf(currentStep) + 1}/4
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((Object.keys(steps).indexOf(currentStep) + 1) / 4) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomAnalysis;