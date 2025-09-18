import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Heart, Users, Shield, Clock, MapPin, Phone, Stethoscope, MessageCircle } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: '🤒',
      title: 'ਲੱਛਣ ਪਛਾਣੋ (Visual Symptom Checker)',
      description: 'ਤਸਵੀਰਾਂ ਦੇ ਜ਼ਰੀਏ ਆਪਣੇ ਲੱਛਣ ਚੁਣੋ। ਪੜ੍ਹਨਾ ਨਹੀਂ ਆਉਂਦਾ? ਕੋਈ ਗੱਲ ਨਹੀਂ! ਸਿਰਫ਼ ਤਸਵੀਰਾਂ ਤੇ ਕਲਿੱਕ ਕਰੋ।',
      details: 'Select your symptoms through easy-to-understand pictures. Perfect for non-literate users with large visual icons and bilingual support.'
    },
    {
      icon: '🧠',
      title: 'AI ਸਮਾਰਟ ਸਿਫਾਰਸ਼ਾਂ (Smart AI Recommendations)',
      description: 'ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ ਤੇ AI ਤੁਰੰਤ ਦਵਾਈ ਅਤੇ ਸਲਾਹ ਦਿੰਦਾ ਹੈ। ਸਾਡਾ AI ਪੰਜਾਬ ਦੇ ਮਾਹੌਲ ਨੂੰ ਸਮਝਦਾ ਹੈ।',
      details: 'Advanced decision tree algorithms provide evidence-based medicine recommendations tailored for rural Punjab context.'
    },
    {
      icon: '🎤',
      title: 'ਪੰਜਾਬੀ ਆਵਾਜ਼ ਚੈਟ (Punjabi Voice Chat)',
      description: 'ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ, AI ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦੇਵੇਗਾ। ਟਾਈਪ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ!',
      details: 'Speech-to-text and text-to-speech in Punjabi language. Includes common medical phrases for quick communication.'
    },
    {
      icon: '🏪',
      title: 'ਨੇੜਲੀ ਦਵਾਈ ਦੀ ਦੁਕਾਨ (Local Pharmacy Finder)',
      description: 'ਆਪਣੇ ਪਿੰਡ ਦੀਆਂ ਦੁਕਾਨਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਸਟਾਕ ਦੇਖੋ। ਕੀਮਤਾਂ ਦਾ ਮੁਕਾਬਲਾ ਕਰੋ।',
      details: 'Real-time medicine stock checking, price comparison, and direct contact with local pharmacies in your area.'
    },
    {
      icon: '📹',
      title: 'ਡਾਕਟਰ ਨਾਲ ਵੀਡੀਓ ਕਾਲ (Video Consultation)',
      description: 'ਘਰ ਬੈਠੇ ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ। ਸੁਰੱਖਿਤ ਅਤੇ ਨਿੱਜੀ ਵੀਡੀਓ ਕਾਲ।',
      details: 'Secure video consultations with qualified doctors. Simple interface designed for rural users with Punjabi instructions.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'ਪਰਿਵਾਰ ਦੀ ਦੇਖਭਾਲ (Family Health Management)',
      description: 'ਪੂਰੇ ਪਰਿਵਾਰ ਦੀ ਸਿਹਤ ਦੀ ਦੇਖਭਾਲ ਇੱਕ ਹੀ ਜਗ੍ਹਾ। ਸਾਰੇ ਮੈਂਬਰਾਂ ਦਾ ਰਿਕਾਰਡ ਰੱਖੋ।',
      details: 'Manage health records for your entire family. Track medical history, medications, and appointments for all family members.'
    }
  ];

  const stats = [
    { number: '173', label: 'ਪਿੰਡ ਸੇਵਾ ਕੀਤੇ (Villages projected to serve)', icon: '🏘️' },
    { number: '10,000+', label: 'ਮਰੀਜ਼ਾਂ ਦੀ ਮਦਦ (Patients estimated to help)', icon: '👥' },
    { number: '24/7', label: 'ਸੇਵਾ ਉਪਲਬਧ (Service Available)', icon: '⏰' },
    { number: '50+', label: 'ਡਾਕਟਰ (Qualified Doctors to be added)', icon: '👨‍⚕️' }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'ਲੱਛਣ ਚੁਣੋ (Select Symptoms)',
      description: 'ਤਸਵੀਰਾਂ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ',
      icon: '🤒',
      color: 'bg-red-100 text-red-600'
    },
    {
      step: 2,
      title: 'AI ਸਲਾਹ ਪਾਓ (Get AI Advice)',
      description: 'ਤੁਰੰਤ ਦਵਾਈ ਅਤੇ ਸਲਾਹ ਪਾਓ',
      icon: '🧠',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      step: 3,
      title: 'ਦਵਾਈ ਲੱਭੋ (Find Medicine)',
      description: 'ਨੇੜਲੀ ਦੁਕਾਨ ਅਤੇ ਸਟਾਕ ਦੇਖੋ',
      icon: '🏪',
      color: 'bg-green-100 text-green-600'
    },
    {
      step: 4,
      title: 'ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ (Consult Doctor)',
      description: 'ਜ਼ਰੂਰਤ ਹੋਵੇ ਤਾਂ ਵੀਡੀਓ ਕਾਲ ਕਰੋ',
      icon: '👨‍⚕️',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="text-8xl mb-6">🏥</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">ਚਿਕਿਤਸਕ</span> ਬਾਰੇ
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-green-600 mb-6">
            About Chikitsak Telemedicine
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            ਚਿਕਿਤਸਕ ਪੰਜਾਬ ਦੇ ਪਿੰਡਾਂ ਲਈ ਬਣਾਇਆ ਗਿਆ ਇੱਕ ਵਿਸ਼ੇਸ਼ ਸਿਹਤ ਪਲੇਟਫਾਰਮ ਹੈ। ਸਾਡਾ ਮਕਸਦ ਹੈ ਕਿ ਹਰ ਪਿੰਡ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਲੋਕਾਂ ਨੂੰ ਘਰ ਬੈਠੇ ਬਿਹਤਰ ਸਿਹਤ ਸੇਵਾ ਮਿਲੇ।
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-4 mb-8">
            Chikitsak is a specialized healthcare platform designed for Punjab's villages. Our mission is to provide quality healthcare services to rural communities from the comfort of their homes.
          </p>

          {/* Quick Access for Existing Users */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">ਤੁਰੰਤ ਸਹਾਇਤਾ (Quick Help)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/patient/symptom-analysis')}
                className="bg-red-100 hover:bg-red-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-3xl mb-2">🤒</div>
                <div className="text-sm font-medium">ਲੱਛਣ ਚੈੱਕ</div>
              </button>
              <button
                onClick={() => navigate('/patient/book-doctor')}
                className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-3xl mb-2">👨‍⚕️</div>
                <div className="text-sm font-medium">ਡਾਕਟਰ ਬੁੱਕ ਕਰੋ</div>
              </button>
              <button
                onClick={() => navigate('/patient/symptom-checker')}
                className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-3xl mb-2">💬</div>
                <div className="text-sm font-medium">AI ਚੈਟ</div>
              </button>
              <button
                onClick={() => navigate('/patient/pharmacy')}
                className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-3xl mb-2">🏪</div>
                <div className="text-sm font-medium">ਦਵਾਈ ਦੁਕਾਨ</div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ਸਾਡਾ ਮਿਸ਼ਨ (Our Mission)
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">ਸਿਹਤ ਸਭ ਦਾ ਹੱਕ (Healthcare for All)</h3>
              <p className="text-gray-600">
                ਹਰ ਪਿੰਡ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਨੂੰ ਬਿਹਤਰ ਸਿਹਤ ਸੇਵਾ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ। Quality healthcare should reach every village.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">ਭਾਈਚਾਰਕ ਸੇਵਾ (Community Service)</h3>
              <p className="text-gray-600">
                ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਅਤੇ ਸੱਭਿਆਚਾਰ ਨੂੰ ਸਮਝਦੇ ਹੋਏ ਸੇਵਾ। Healthcare that understands Punjabi culture and language.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">ਸੁਰੱਖਿਤ ਅਤੇ ਭਰੋਸੇਮੰਦ (Safe & Reliable)</h3>
              <p className="text-gray-600">
                ਤੁਹਾਡੀ ਨਿੱਜਤਾ ਅਤੇ ਡੇਟਾ ਦੀ ਪੂਰੀ ਸੁਰੱਖਿਆ। Complete privacy and data security for all users.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ (Our Services)
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ਪਿੰਡਾਂ ਦੀਆਂ ਲੋੜਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਬਣਾਈਆਂ ਗਈਆਂ ਸੇਵਾਵਾਂ
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              // Define navigation paths for each feature
              const getNavigationPath = (title) => {
                if (title.includes('ਲੱਛਣ ਪਛਾਣੋ')) return '/patient/symptom-analysis';
                if (title.includes('ਸਮਾਰਟ ਸਿਫਾਰਸ਼ਾਂ')) return '/patient/symptom-analysis';
                if (title.includes('ਪੰਜਾਬੀ ਆਵਾਜ਼ ਚੈਟ')) return '/patient/symptom-checker';
                if (title.includes('ਨੇੜਲੀ ਦਵਾਈ')) return '/patient/pharmacy';
                if (title.includes('ਡਾਕਟਰ ਨਾਲ ਵੀਡੀਓ')) return '/patient/book-doctor';
                if (title.includes('ਪਰਿਵਾਰ ਦੀ ਦੇਖਭਾਲ')) return '/patient/family';
                return '#';
              };

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => {
                    const path = getNavigationPath(feature.title);
                    if (path !== '#') {
                      navigate(path);
                    }
                  }}
                >
                  <div className="text-5xl mb-4 text-center">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-700 mb-3 text-sm">{feature.description}</p>
                  <p className="text-gray-500 text-xs italic mb-4">{feature.details}</p>
                  <div className="text-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      ਵਰਤੋ (Try Now) →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ? (How It Works?)
            </h2>
            <p className="text-gray-600">
              ਸਿਰਫ਼ 4 ਆਸਾਨ ਕਦਮਾਂ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਪਾਓ
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold text-gray-600">{step.step}</span>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            ਸਾਡੇ ਨਾਲ ਜੁੜੋ (Connect With Us)
          </h2>
          <p className="text-xl mb-6">
            ਸਿਹਤ ਸੰਬੰਧੀ ਕੋਈ ਵੀ ਸਮਸਿਆ ਹੋਵੇ ਤਾਂ ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Phone className="text-white" size={24} />
              <div>
                <div className="font-semibold">ਐਮਰਜੈਂਸੀ (Emergency)</div>
                <div className="text-sm">108</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MessageCircle className="text-white" size={24} />
              <div>
                <div className="font-semibold">ਸਹਾਇਤਾ (Support)</div>
                <div className="text-sm">24/7 Available</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="text-white" size={24} />
              <div>
                <div className="font-semibold">ਸੇਵਾ ਖੇਤਰ (Service Area)</div>
                <div className="text-sm">All Punjab Villages</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              ਸਿਹਤ ਸਭ ਦਾ ਹੱਕ ਹੈ - Healthcare is everyone's right
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;