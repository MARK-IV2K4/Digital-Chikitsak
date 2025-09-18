import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, MessageCircle, MapPin, Mic, Heart, Users, Clock, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  const features = [
    {
      icon: '🤒',
      title: 'ਲੱਛਣ ਪਛਾਣੋ (Visual Symptoms)',
      description: 'ਤਸਵੀਰਾਂ ਦੇ ਜ਼ਰੀਏ ਆਪਣੇ ਲੱਛਣ ਚੁਣੋ - ਪੜ੍ਹਨਾ ਨਹੀਂ ਆਉਂਦਾ? ਕੋਈ ਗੱਲ ਨਹੀਂ!',
      englishDesc: 'Select symptoms through pictures - Can\'t read? No problem!'
    },
    {
      icon: '🧠',
      title: 'ਸਮਾਰਟ ਸਿਫਾਰਸ਼ਾਂ (Smart Recommendations)',
      description: 'AI ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ ਤੇ ਦਵਾਈ ਅਤੇ ਸਲਾਹ ਦਿੰਦਾ ਹੈ',
      englishDesc: 'AI provides medicine and advice based on your symptoms'
    },
    {
      icon: '🎤',
      title: 'ਪੰਜਾਬੀ ਆਵਾਜ਼ ਚੈਟ (Punjabi Voice Chat)',
      description: 'ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ, AI ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦੇਵੇਗਾ',
      englishDesc: 'Speak in Punjabi, AI responds in Punjabi'
    },
    {
      icon: '🏪',
      title: 'ਨੇੜਲੀ ਦਵਾਈ ਦੀ ਦੁਕਾਨ (Local Pharmacy)',
      description: 'ਆਪਣੇ ਪਿੰਡ ਦੀਆਂ ਦੁਕਾਨਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਸਟਾਕ ਦੇਖੋ',
      englishDesc: 'Find village pharmacies and their medicine stock'
    },
    {
      icon: '📹',
      title: 'ਡਾਕਟਰ ਨਾਲ ਵੀਡੀਓ ਕਾਲ (Video Consultation)',
      description: 'ਘਰ ਬੈਠੇ ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ',
      englishDesc: 'Talk to doctors from home via video call'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'ਪਰਿਵਾਰ ਦੀ ਦੇਖਭਾਲ (Family Care)',
      description: 'ਪੂਰੇ ਪਰਿਵਾਰ ਦੀ ਸਿਹਤ ਦੀ ਦੇਖਭਾਲ ਇੱਕ ਹੀ ਜਗ੍ਹਾ',
      englishDesc: 'Manage whole family\'s health in one place'
    }
  ];

  const stats = [
    { number: '500+', label: 'ਪਿੰਡ (Villages Served)', icon: '🏘️' },
    { number: '10,000+', label: 'ਮਰੀਜ਼ (Patients Helped)', icon: '👥' },
    { number: '24/7', label: 'ਸੇਵਾ (Service Available)', icon: '⏰' },
    { number: '50+', label: 'ਡਾਕਟਰ (Doctors)', icon: '👨‍⚕️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="text-8xl mb-6">🏥</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">ਚਿਕਿਤਸਕ</span> Telemedicine
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-green-600 mb-4">
            ਪੰਜਾਬ ਦੇ ਪਿੰਡਾਂ ਲਈ ਸਿਹਤ ਸੇਵਾ
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Healthcare for Punjab's Villages - ਘਰ ਬੈਠੇ ਡਾਕਟਰੀ ਸਲਾਹ, ਪੰਜਾਬੀ ਵਿੱਚ AI ਚੈਟ, ਅਤੇ ਨੇੜਲੀ ਦਵਾਈ ਦੀ ਦੁਕਾਨਾਂ ਦੀ ਜਾਣਕਾਰੀ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Users size={24} />
              ਸ਼ੁਰੂ ਕਰੋ (Get Started)
            </Link>
            <Link
              to="/login"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={24} />
              ਲਾਗਇਨ (Login)
            </Link>
          </div>

          {/* Quick Access for Existing Users */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">ਤੁਰੰਤ ਸਹਾਇਤਾ (Quick Help)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/patient/symptom-analysis"
                className="bg-red-100 hover:bg-red-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-3xl mb-2">🤒</div>
                <div className="text-sm font-medium">ਲੱਛਣ ਚੈੱਕ</div>
              </Link>
              <button className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-3xl mb-2">🚨</div>
                <div className="text-sm font-medium">ਐਮਰਜੈਂਸੀ</div>
              </button>
              <button className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors">
                <div className="text-3xl mb-2">📞</div>
                <div className="text-sm font-medium">ਹੈਲਪਲਾਈਨ</div>
              </button>
              <button className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors">
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

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-6xl mb-4 text-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-700 mb-2 text-center">{feature.description}</p>
              <p className="text-gray-500 text-sm text-center italic">{feature.englishDesc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ? (How It Works?)
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">ਲੱਛਣ ਚੁਣੋ</h3>
              <p className="text-sm text-gray-600">ਤਸਵੀਰਾਂ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">AI ਸਲਾਹ</h3>
              <p className="text-sm text-gray-600">ਤੁਰੰਤ ਦਵਾਈ ਅਤੇ ਸਲਾਹ ਪਾਓ</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">ਦਵਾਈ ਲੱਭੋ</h3>
              <p className="text-sm text-gray-600">ਨੇੜਲੀ ਦੁਕਾਨ ਅਤੇ ਸਟਾਕ ਦੇਖੋ</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">4️⃣</span>
              </div>
              <h3 className="font-semibold mb-2">ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ</h3>
              <p className="text-sm text-gray-600">ਜ਼ਰੂਰਤ ਹੋਵੇ ਤਾਂ ਵੀਡੀਓ ਕਾਲ ਕਰੋ</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            ਅੱਜ ਹੀ ਸ਼ੁਰੂ ਕਰੋ! (Start Today!)
          </h2>
          <p className="text-xl mb-6">
            ਆਪਣੇ ਅਤੇ ਆਪਣੇ ਪਰਿਵਾਰ ਦੀ ਸਿਹਤ ਦੀ ਦੇਖਭਾਲ ਕਰੋ
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <Shield size={24} />
            ਮੁਫ਼ਤ ਰਜਿਸਟਰ ਕਰੋ (Free Registration)
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm bg-white border-t">
        © {new Date().getFullYear()} ਚਿਕਿਤਸਕ Digital Chikitsak • ਪੰਜਾਬ ਦੇ ਪਿੰਡਾਂ ਲਈ ਸਿਹਤ ਸੇਵਾ (Community Healthcare Platform)
      </footer>
    </div>
  );
};

export default Home;