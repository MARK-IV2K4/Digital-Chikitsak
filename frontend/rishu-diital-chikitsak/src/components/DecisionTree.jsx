import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Decision tree rules for common conditions
const decisionRules = {
  // Respiratory conditions
  respiratory: {
    conditions: ['cough', 'fever', 'breathing'],
    recommendations: {
      mild: {
        medicines: ['Cough syrup', 'Paracetamol', 'Steam inhalation'],
        advice: 'Rest and drink warm fluids. Monitor symptoms.',
        urgency: 'low',
        punjabi: 'ਆਰਾਮ ਕਰੋ ਅਤੇ ਗਰਮ ਤਰਲ ਪਦਾਰਥ ਪੀਓ।'
      },
      moderate: {
        medicines: ['Antibiotic (consult doctor)', 'Bronchodilator', 'Paracetamol'],
        advice: 'Consult a doctor within 24 hours.',
        urgency: 'medium',
        punjabi: '24 ਘੰਟਿਆਂ ਵਿੱਚ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
      },
      severe: {
        medicines: ['Immediate medical attention required'],
        advice: 'Seek emergency care immediately.',
        urgency: 'high',
        punjabi: 'ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਲਓ।'
      }
    }
  },
  
  // Gastrointestinal conditions
  gastrointestinal: {
    conditions: ['stomach_pain', 'diarrhea', 'vomiting'],
    recommendations: {
      mild: {
        medicines: ['ORS', 'Antacid', 'Probiotics'],
        advice: 'Stay hydrated. Eat light foods.',
        urgency: 'low',
        punjabi: 'ਪਾਣੀ ਪੀਂਦੇ ਰਹੋ। ਹਲਕਾ ਖਾਣਾ ਖਾਓ।'
      },
      moderate: {
        medicines: ['Anti-diarrheal', 'Electrolyte solution', 'Antispasmodic'],
        advice: 'Monitor symptoms. Consult doctor if persists.',
        urgency: 'medium',
        punjabi: 'ਲੱਛਣਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ। ਜੇ ਜਾਰੀ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
      },
      severe: {
        medicines: ['IV fluids may be needed'],
        advice: 'Seek medical attention immediately.',
        urgency: 'high',
        punjabi: 'ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਲਓ।'
      }
    }
  },
  
  // General pain and fever
  general: {
    conditions: ['fever', 'headache', 'joint_pain'],
    recommendations: {
      mild: {
        medicines: ['Paracetamol', 'Rest', 'Cold compress'],
        advice: 'Rest and monitor temperature.',
        urgency: 'low',
        punjabi: 'ਆਰਾਮ ਕਰੋ ਅਤੇ ਤਾਪਮਾਨ ਦੀ ਜਾਂਚ ਕਰੋ।'
      },
      moderate: {
        medicines: ['Ibuprofen', 'Paracetamol', 'Adequate rest'],
        advice: 'Continue monitoring. Consult doctor if fever persists.',
        urgency: 'medium',
        punjabi: 'ਨਿਗਰਾਨੀ ਜਾਰੀ ਰੱਖੋ। ਜੇ ਬੁਖਾਰ ਜਾਰੀ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
      },
      severe: {
        medicines: ['Immediate medical evaluation needed'],
        advice: 'High fever requires immediate medical attention.',
        urgency: 'high',
        punjabi: 'ਤੇਜ਼ ਬੁਖਾਰ ਲਈ ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ।'
      }
    }
  },
  
  // Skin conditions
  skin: {
    conditions: ['rash'],
    recommendations: {
      mild: {
        medicines: ['Calamine lotion', 'Antihistamine', 'Cool compress'],
        advice: 'Keep area clean and dry. Avoid scratching.',
        urgency: 'low',
        punjabi: 'ਖੇਤਰ ਨੂੰ ਸਾਫ਼ ਅਤੇ ਸੁੱਕਾ ਰੱਖੋ। ਖੁਜਲੀ ਨਾ ਕਰੋ।'
      },
      moderate: {
        medicines: ['Topical steroid', 'Antihistamine', 'Moisturizer'],
        advice: 'Apply prescribed cream. Consult doctor if spreading.',
        urgency: 'medium',
        punjabi: 'ਦਵਾਈ ਲਗਾਓ। ਜੇ ਫੈਲ ਰਿਹਾ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
      },
      severe: {
        medicines: ['Prescription medication needed'],
        advice: 'Severe rash requires medical evaluation.',
        urgency: 'high',
        punjabi: 'ਗੰਭੀਰ ਦਾਣਿਆਂ ਲਈ ਡਾਕਟਰੀ ਜਾਂਚ ਦੀ ਲੋੜ ਹੈ।'
      }
    }
  }
};

const DecisionTree = ({ symptoms, onRecommendation }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeSymptoms();
  }, [symptoms]);

  const analyzeSymptoms = () => {
    setLoading(true);
    
    // Determine the most relevant category
    let bestMatch = null;
    let maxScore = 0;
    
    Object.entries(decisionRules).forEach(([category, rules]) => {
      const matchingSymptoms = symptoms.filter(symptom => 
        rules.conditions.includes(symptom.id)
      );
      
      if (matchingSymptoms.length > maxScore) {
        maxScore = matchingSymptoms.length;
        bestMatch = { category, rules, matchingSymptoms };
      }
    });

    // Determine overall severity
    const severityLevels = symptoms.map(s => s.severity);
    const hasSevere = severityLevels.includes('severe');
    const hasModerate = severityLevels.includes('moderate');
    
    let overallSeverity = 'mild';
    if (hasSevere) overallSeverity = 'severe';
    else if (hasModerate) overallSeverity = 'moderate';

    // Get recommendations
    let recommendation = {
      category: 'general',
      severity: overallSeverity,
      medicines: ['Consult a healthcare provider'],
      advice: 'Please consult with a medical professional.',
      urgency: 'medium',
      punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਕਿਸੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
    };

    if (bestMatch && bestMatch.rules.recommendations[overallSeverity]) {
      const rec = bestMatch.rules.recommendations[overallSeverity];
      recommendation = {
        category: bestMatch.category,
        severity: overallSeverity,
        ...rec
      };
    }

    setAnalysis({
      symptoms,
      recommendation,
      confidence: maxScore > 0 ? (maxScore / symptoms.length) * 100 : 50
    });
    
    setLoading(false);
    onRecommendation(recommendation);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '🚨';
      default: return 'ℹ️';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ... (Analyzing...)</span>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ਸਿਫਾਰਸ਼ਾਂ (Recommendations)
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Confidence:</span>
            <div className="bg-gray-200 rounded-full h-2 w-32">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.confidence}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{Math.round(analysis.confidence)}%</span>
          </div>
        </div>

        {/* Urgency Level */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getUrgencyColor(analysis.recommendation.urgency)}`}>
            <span className="text-xl">{getUrgencyIcon(analysis.recommendation.urgency)}</span>
            <span className="font-semibold capitalize">
              {analysis.recommendation.urgency} Priority
            </span>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Medicines */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              💊 ਦਵਾਈਆਂ (Medicines)
            </h3>
            <ul className="space-y-2">
              {analysis.recommendation.medicines.map((medicine, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{medicine}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advice */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              💡 ਸਲਾਹ (Advice)
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700">{analysis.recommendation.advice}</p>
              <p className="text-gray-600 text-sm italic">
                {analysis.recommendation.punjabi}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Symptoms Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">ਤੁਹਾਡੇ ਲੱਛਣ (Your Symptoms):</h3>
          <div className="flex flex-wrap gap-3">
            {analysis.symptoms.map((symptom) => (
              <div key={symptom.id} className="bg-white px-4 py-2 rounded-full border flex items-center gap-2">
                <span>{symptom.icon}</span>
                <span className="font-medium">{symptom.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  symptom.severity === 'severe' ? 'bg-red-100 text-red-600' :
                  symptom.severity === 'moderate' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {symptom.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            🏥 ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ (Consult Doctor)
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            💬 AI ਚੈਟ (Chat with AI)
          </button>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            🏪 ਦਵਾਈ ਦੀ ਦੁਕਾਨ (Find Pharmacy)
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DecisionTree;