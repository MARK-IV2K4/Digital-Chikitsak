# ਚਿਕਿਤਸਕ (Chikitsak) - Rural Punjab Telemedicine Platform

A comprehensive telemedicine platform designed specifically for rural Punjab villages, addressing the shortage of medical workforce and providing accessible healthcare services.

## 🌟 Key Features for Rural Users

### 1. **Visual Symptom Selection** 🤒
- **Non-literate friendly**: Large visual icons for common symptoms
- **Bilingual support**: Punjabi and English labels
- **Intuitive interface**: Click on pictures to select symptoms
- **Severity selection**: Easy-to-understand severity levels (mild, moderate, severe)

### 2. **AI-Powered Decision Tree** 🧠
- **Smart recommendations**: Evidence-based medicine suggestions
- **Cultural sensitivity**: Advice tailored for rural Punjab context
- **Confidence scoring**: Shows reliability of recommendations
- **Urgency indicators**: Clear priority levels (low, medium, high)

### 3. **Punjabi Voice Chat** 🎤
- **Speech-to-text**: Speak in Punjabi, get text responses
- **Text-to-speech**: AI responses read aloud in Punjabi
- **Common phrases**: Pre-built phrases for quick communication
- **Fallback support**: Works with Hindi and English if Punjabi unavailable

### 4. **Local Pharmacy Integration** 🏪
- **Real-time stock**: Check medicine availability in nearby pharmacies
- **Price comparison**: Compare prices across different stores
- **Distance-based search**: Find closest pharmacies
- **Contact integration**: Direct calling and directions to pharmacies

### 5. **Video Consultations** 📹
- **Jitsi Meet integration**: Secure, browser-based video calls
- **Simple controls**: Easy-to-understand interface for rural users
- **Punjabi instructions**: On-screen guidance in local language
- **Low bandwidth optimization**: Works on slower internet connections

### 6. **Family Health Management** 👨‍👩‍👧‍👦
- **Multiple profiles**: Manage health for entire family
- **Shared access**: One account for whole household
- **Medical history**: Track health records over time

## 🏗️ Technical Architecture

### Frontend (React + Vite)
```
src/
├── components/
│   ├── SymptomSelector.jsx      # Visual symptom selection
│   ├── DecisionTree.jsx         # AI recommendation engine
│   ├── VoiceChat.jsx           # Punjabi speech interface
│   ├── PharmacyFinder.jsx      # Local pharmacy search
│   └── VideoConsultation.jsx   # Jitsi Meet integration
├── pages/
│   └── patient/
│       └── SymptomAnalysis.jsx  # Main patient workflow
└── services/
    └── api.js                   # Backend communication
```

### Backend (Flask + MySQL)
```
backend/
├── app.py                       # Main Flask application
├── database.py                  # Database schema and connections
└── requirements.txt             # Python dependencies
```

### Key Technologies
- **Frontend**: React 18, Framer Motion, Tailwind CSS, Lucide Icons
- **Backend**: Flask, PyMySQL, JWT Authentication
- **Database**: MySQL with JSON support for symptom data
- **Video**: Jitsi Meet External API
- **Speech**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **AI**: LM Studio integration for local AI models

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MySQL 8.0+
- LM Studio (for AI chat functionality)

### Frontend Setup
```bash
cd frontend/rishu-diital-chikitsak
npm install --legacy-peer-deps
npm run dev
```

### Backend Setup
```bash
cd backend/chikitsak-backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

python app.py
```

### Database Setup
The application automatically creates the required database schema on first run, including:
- User accounts and authentication
- Patient profiles and medical history
- Consultation records and chat logs
- Pharmacy and medicine stock data
- Symptom analysis history

## 🎯 User Journey

1. **Symptom Selection**: User clicks on visual symptom icons
2. **AI Analysis**: Decision tree provides immediate recommendations
3. **Voice Interaction**: Optional Punjabi voice chat for clarification
4. **Pharmacy Search**: Find local medicines and prices
5. **Doctor Consultation**: Video call if needed
6. **Follow-up**: Track progress and medication adherence

## 🌍 Localization Features

- **Punjabi Gurmukhi script** throughout the interface
- **Cultural context** in medical advice
- **Local pharmacy names** and addresses in Punjabi
- **Voice support** for Punjabi language
- **Simple navigation** suitable for low-literacy users

## 📱 Mobile-First Design

- **Touch-friendly** large buttons and icons
- **Responsive layout** works on all screen sizes
- **Offline capability** for basic symptom checking
- **Low bandwidth** optimized for rural internet

## 🔒 Security & Privacy

- **JWT authentication** for secure sessions
- **HIPAA-compliant** data handling
- **Local AI processing** keeps sensitive data private
- **Encrypted communications** for video calls

## 🤝 Contributing

This project is designed to serve rural Punjab communities. Contributions focusing on:
- Punjabi language improvements
- Cultural sensitivity enhancements
- Accessibility features
- Performance optimizations for low-end devices

are especially welcome.

## 📞 Support

For technical support or medical emergencies:
- **Emergency**: Call 108 (India Emergency Services)
- **Technical Help**: Contact your local health worker
- **Platform Issues**: Report through the app feedback system

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**ਸਿਹਤ ਸਭ ਦਾ ਹੱਕ ਹੈ** - Healthcare is everyone's right.