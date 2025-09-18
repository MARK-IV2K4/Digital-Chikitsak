import React, { useState } from 'react';
import { motion } from 'framer-motion';

const symptoms = [
  {
    id: 'cough',
    name: 'ਖੰਘ (Cough)',
    icon: '🤧',
    description: 'Persistent coughing',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'fever',
    name: 'ਬੁਖਾਰ (Fever)',
    icon: '🤒',
    description: 'High body temperature',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'headache',
    name: 'ਸਿਰ ਦਰਦ (Headache)',
    icon: '🤕',
    description: 'Head pain',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'stomach_pain',
    name: 'ਪੇਟ ਦਰਦ (Stomach Pain)',
    icon: '🤢',
    description: 'Abdominal discomfort',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'rash',
    name: 'ਦਾਣੇ (Rash)',
    icon: '🔴',
    description: 'Skin irritation',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'breathing',
    name: 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਿਲ (Breathing Issues)',
    icon: '😮‍💨',
    description: 'Difficulty breathing',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'diarrhea',
    name: 'ਦਸਤ (Diarrhea)',
    icon: '💩',
    description: 'Loose stools',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'vomiting',
    name: 'ਉਲਟੀ (Vomiting)',
    icon: '🤮',
    description: 'Nausea and vomiting',
    severity: ['mild', 'moderate', 'severe']
  },
  {
    id: 'joint_pain',
    name: 'ਜੋੜਾਂ ਦਾ ਦਰਦ (Joint Pain)',
    icon: '🦴',
    description: 'Joint aches',
    severity: ['mild', 'moderate', 'severe']
  }
];

const SymptomSelector = ({ selectedSymptoms, onSymptomsChange, onNext }) => {
  const [currentSymptom, setCurrentSymptom] = useState(null);

  const handleSymptomSelect = (symptom) => {
    setCurrentSymptom(symptom);
  };

  const handleSeveritySelect = (severity) => {
    const updatedSymptoms = [...selectedSymptoms];
    const existingIndex = updatedSymptoms.findIndex(s => s.id === currentSymptom.id);
    
    if (existingIndex >= 0) {
      updatedSymptoms[existingIndex] = { ...currentSymptom, severity };
    } else {
      updatedSymptoms.push({ ...currentSymptom, severity });
    }
    
    onSymptomsChange(updatedSymptoms);
    setCurrentSymptom(null);
  };

  const removeSymptom = (symptomId) => {
    const updatedSymptoms = selectedSymptoms.filter(s => s.id !== symptomId);
    onSymptomsChange(updatedSymptoms);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          ਤੁਹਾਡੇ ਲੱਛਣ ਚੁਣੋ (Select Your Symptoms)
        </h2>
        <p className="text-gray-600">ਤਸਵੀਰਾਂ 'ਤੇ ਕਲਿੱਕ ਕਰੋ (Click on the images)</p>
      </div>

      {/* Symptom Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {symptoms.map((symptom) => {
          const isSelected = selectedSymptoms.some(s => s.id === symptom.id);
          return (
            <motion.div
              key={symptom.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSymptomSelect(symptom)}
            >
              <div className="text-center">
                <div className="text-6xl mb-3">{symptom.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{symptom.name}</h3>
                <p className="text-sm text-gray-600">{symptom.description}</p>
                {isSelected && (
                  <div className="mt-2">
                    <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      Selected
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">ਚੁਣੇ ਗਏ ਲੱਛਣ (Selected Symptoms):</h3>
          <div className="flex flex-wrap gap-3">
            {selectedSymptoms.map((symptom) => (
              <div key={symptom.id} className="bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2">
                <span>{symptom.icon}</span>
                <span className="font-medium">{symptom.name}</span>
                <span className="text-sm text-gray-600">({symptom.severity})</span>
                <button
                  onClick={() => removeSymptom(symptom.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Severity Selection Modal */}
      {currentSymptom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentSymptom.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{currentSymptom.name}</h3>
              <p className="text-gray-600 mb-4">ਗੰਭੀਰਤਾ ਚੁਣੋ (Select Severity)</p>
            </div>
            
            <div className="space-y-3">
              {currentSymptom.severity.map((level) => (
                <button
                  key={level}
                  onClick={() => handleSeveritySelect(level)}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{level}</span>
                    <span className="text-2xl">
                      {level === 'mild' ? '😐' : level === 'moderate' ? '😰' : '😵'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentSymptom(null)}
              className="w-full mt-4 p-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Next Button */}
      {selectedSymptoms.length > 0 && (
        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ਅੱਗੇ ਵਧੋ (Continue) →
          </button>
        </div>
      )}
    </div>
  );
};

export default SymptomSelector;