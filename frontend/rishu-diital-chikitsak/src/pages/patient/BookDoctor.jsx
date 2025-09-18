import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../../components/Header'
import PatientSidebar from '../../components/PatientSidebar'
import { getPatientsForAccount } from '../../services/auth'
import { Star, Clock, MapPin, Phone, Video, Calendar, User, Stethoscope } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

// Mock doctor data with comprehensive details
const availableDoctors = [
  {
    id: 'dr_001',
    name: 'ਡਾ. ਰਾਜੇਸ਼ ਸ਼ਰਮਾ (Dr. Rajesh Sharma)',
    specialty: 'ਜਨਰਲ ਫਿਜ਼ੀਸ਼ਿਅਨ (General Physician)',
    experience: '15 years',
    rating: 4.8,
    reviews: 245,
    languages: ['ਪੰਜਾਬੀ', 'ਹਿੰਦੀ', 'English'],
    education: 'MBBS, MD - Internal Medicine',
    hospital: 'ਸਿਵਿਲ ਹਸਪਤਾਲ ਲੁਧਿਆਣਾ (Civil Hospital Ludhiana)',
    consultationFee: '₹300',
    availableSlots: ['10:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'],
    phone: '+91 98765 43210',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    about: 'ਪਿੰਡਾਂ ਦੇ ਮਰੀਜ਼ਾਂ ਦਾ 15 ਸਾਲਾਂ ਦਾ ਤਜਰਬਾ। ਆਮ ਬਿਮਾਰੀਆਂ ਦਾ ਮਾਹਿਰ।',
    specializes: ['Fever', 'Cold & Cough', 'Diabetes', 'Hypertension', 'General Health']
  },
  {
    id: 'dr_002',
    name: 'ਡਾ. ਪ੍ਰੀਤ ਕੌਰ (Dr. Preet Kaur)',
    specialty: 'ਔਰਤਾਂ ਦੇ ਰੋਗ ਮਾਹਿਰ (Gynecologist)',
    experience: '12 years',
    rating: 4.9,
    reviews: 189,
    languages: ['ਪੰਜਾਬੀ', 'ਹਿੰਦੀ', 'English'],
    education: 'MBBS, MS - Obstetrics & Gynecology',
    hospital: 'ਮੈਕਸ ਹਸਪਤਾਲ ਮੋਹਾਲੀ (Max Hospital Mohali)',
    consultationFee: '₹500',
    availableSlots: ['11:00 AM', '3:00 PM', '5:00 PM'],
    phone: '+91 98765 43211',
    image: 'https://images.unsplash.com/photo-1594824475317-8e3f8e5f1e0a?w=300&h=300&fit=crop&crop=face',
    about: 'ਔਰਤਾਂ ਅਤੇ ਬੱਚਿਆਂ ਦੀ ਸਿਹਤ ਦੀ ਮਾਹਿਰ। ਪਿੰਡਾਂ ਵਿੱਚ ਮੁਫ਼ਤ ਕੈਂਪ ਲਗਾਉਂਦੀ ਹੈ।',
    specializes: ['Pregnancy Care', 'Women Health', 'Family Planning', 'Menstrual Issues']
  },
  {
    id: 'dr_003',
    name: 'ਡਾ. ਅਮਰਜੀਤ ਸਿੰਘ (Dr. Amarjeet Singh)',
    specialty: 'ਬੱਚਿਆਂ ਦੇ ਡਾਕਟਰ (Pediatrician)',
    experience: '18 years',
    rating: 4.7,
    reviews: 312,
    languages: ['ਪੰਜਾਬੀ', 'ਹਿੰਦੀ', 'English'],
    education: 'MBBS, MD - Pediatrics',
    hospital: 'ਫੋਰਟਿਸ ਹਸਪਤਾਲ ਅੰਮ੍ਰਿਤਸਰ (Fortis Hospital Amritsar)',
    consultationFee: '₹400',
    availableSlots: ['9:00 AM', '1:00 PM', '3:00 PM', '7:00 PM'],
    phone: '+91 98765 43212',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    about: 'ਬੱਚਿਆਂ ਦੀ ਸਿਹਤ ਦਾ ਮਾਹਿਰ। ਟੀਕਾਕਰਣ ਅਤੇ ਬੱਚਿਆਂ ਦੇ ਵਿਕਾਸ ਦਾ ਮਾਹਿਰ।',
    specializes: ['Child Health', 'Vaccination', 'Growth Issues', 'Child Nutrition']
  },
  {
    id: 'dr_004',
    name: 'ਡਾ. ਸੁਰਿੰਦਰ ਕੁਮਾਰ (Dr. Surinder Kumar)',
    specialty: 'ਦਿਲ ਦੇ ਰੋਗ ਮਾਹਿਰ (Cardiologist)',
    experience: '20 years',
    rating: 4.9,
    reviews: 156,
    languages: ['ਪੰਜਾਬੀ', 'ਹਿੰਦੀ', 'English'],
    education: 'MBBS, MD, DM - Cardiology',
    hospital: 'ਪੀਜੀਆਈ ਚੰਡੀਗੜ੍ਹ (PGI Chandigarh)',
    consultationFee: '₹800',
    availableSlots: ['10:00 AM', '2:00 PM', '4:00 PM'],
    phone: '+91 98765 43213',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    about: 'ਦਿਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਦਾ ਮਾਹਿਰ। ਪਿੰਡਾਂ ਵਿੱਚ ਦਿਲ ਦੀ ਜਾਂਚ ਕੈਂਪ ਲਗਾਉਂਦੇ ਹਨ।',
    specializes: ['Heart Disease', 'Blood Pressure', 'Chest Pain', 'Heart Attack Prevention']
  },
  {
    id: 'dr_005',
    name: 'ਡਾ. ਮਨਜੀਤ ਕੌਰ (Dr. Manjeet Kaur)',
    specialty: 'ਚਮੜੀ ਦੇ ਰੋਗ ਮਾਹਿਰ (Dermatologist)',
    experience: '10 years',
    rating: 4.6,
    reviews: 98,
    languages: ['ਪੰਜਾਬੀ', 'ਹਿੰਦੀ', 'English'],
    education: 'MBBS, MD - Dermatology',
    hospital: 'ਸਕਿਨ ਕੇਅਰ ਕਲੀਨਿਕ ਜਲੰਧਰ (Skin Care Clinic Jalandhar)',
    consultationFee: '₹350',
    availableSlots: ['11:00 AM', '3:00 PM', '5:00 PM', '7:00 PM'],
    phone: '+91 98765 43214',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop&crop=face',
    about: 'ਚਮੜੀ ਦੇ ਰੋਗਾਂ ਦੀ ਮਾਹਿਰ। ਪਿੰਡਾਂ ਵਿੱਚ ਚਮੜੀ ਦੀ ਜਾਂਚ ਕੈਂਪ ਲਗਾਉਂਦੀ ਹੈ।',
    specializes: ['Skin Allergies', 'Rashes', 'Hair Problems', 'Acne Treatment']
  }
];

export default function BookDoctor() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [consultationType, setConsultationType] = useState('video') // video or phone
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: select doctor, 2: book appointment

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        console.log('Fetching patients...')
        const list = await getPatientsForAccount()
        console.log('Fetched patients:', list)
        setPatients(list || [])
        
        // Check if a patient was pre-selected from family management
        const storedPatient = localStorage.getItem('selectedPatient')
        if (storedPatient) {
          try {
            const patient = JSON.parse(storedPatient)
            console.log('Pre-selected patient:', patient)
            setSelectedPatient(patient.patient_id)
            
            // Pre-fill symptoms if available from patient's medical history
            if (patient.medical_history) {
              setSymptoms(`Previous medical history: ${patient.medical_history}`)
            }
            
            // Don't clear immediately - wait until booking is complete
            toast.success(`ਪੇਸ਼ੈਂਟ ਚੁਣਿਆ ਗਿਆ: ${patient.name} (Patient selected: ${patient.name})`)
          } catch (error) {
            console.error('Error parsing selected patient:', error)
          }
        } else if (list && list.length > 0) {
          setSelectedPatient(list[0].patient_id)
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
        toast.error('Failed to load patient data')
      }
    }
    fetchPatients()
  }, [])

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setStep(2)
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    
    if (!selectedPatient || !symptoms || !selectedSlot) {
      toast.error('ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੀਆਂ ਜਾਣਕਾਰੀਆਂ ਭਰੋ (Please fill all details)')
      return
    }

    setLoading(true)
    try {
      // In a real app, this would call your backend API
      const bookingData = {
        patient_id: selectedPatient,
        doctor_id: selectedDoctor.id,
        symptoms,
        consultation_type: consultationType,
        slot: selectedSlot,
        fee: selectedDoctor.consultationFee
      }
      
      console.log('Booking consultation:', bookingData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਹੋ ਗਈ! (Appointment booked successfully!)')
      
      // Clear the stored patient after successful booking
      localStorage.removeItem('selectedPatient')
      
      // Reset form
      setSymptoms('')
      setSelectedSlot('')
      setStep(1)
      setSelectedDoctor(null)
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('ਬੁਕਿੰਗ ਵਿੱਚ ਸਮਸਿਆ (Booking failed)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" />
      <Header />
      <div className="flex flex-1">
        <PatientSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
                <p className="text-sm text-yellow-700">Patients loaded: {patients.length}</p>
                <p className="text-sm text-yellow-700">Selected patient: {selectedPatient}</p>
                <p className="text-sm text-yellow-700">Stored patient: {localStorage.getItem('selectedPatient') ? 'Yes' : 'No'}</p>
                {patients.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-sm text-yellow-700 cursor-pointer">View patients data</summary>
                    <pre className="text-xs text-yellow-600 mt-1 overflow-auto">{JSON.stringify(patients, null, 2)}</pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  ਡਾਕਟਰ ਬੁੱਕ ਕਰੋ (Book a Doctor)
                </h1>
                <p className="text-gray-600 mt-1">
                  ਯੋਗ ਡਾਕਟਰਾਂ ਨਾਲ ਘਰ ਬੈਠੇ ਸਲਾਹ ਲਓ (Consult qualified doctors from home)
                </p>
              </div>
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ← ਵਾਪਸ (Back)
                </button>
              )}
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Search and Filter */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">ਡਾਕਟਰ ਚੁਣੋ (Select Doctor)</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                      <option>ਸਾਰੇ ਮਾਹਿਰ (All Specialists)</option>
                      <option>ਜਨਰਲ ਫਿਜ਼ੀਸ਼ਿਅਨ</option>
                      <option>ਔਰਤਾਂ ਦੇ ਰੋਗ ਮਾਹਿਰ</option>
                      <option>ਬੱਚਿਆਂ ਦੇ ਡਾਕਟਰ</option>
                    </select>
                    <select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                      <option>ਸਾਰੇ ਸ਼ਹਿਰ (All Cities)</option>
                      <option>ਲੁਧਿਆਣਾ</option>
                      <option>ਅੰਮ੍ਰਿਤਸਰ</option>
                      <option>ਜਲੰਧਰ</option>
                    </select>
                    <select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                      <option>ਸਾਰੇ ਸਮੇਂ (All Times)</option>
                      <option>ਸਵੇਰੇ (Morning)</option>
                      <option>ਦੁਪਹਿਰ (Afternoon)</option>
                      <option>ਸ਼ਾਮ (Evening)</option>
                    </select>
                  </div>
                </div>

                {/* Doctor Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableDoctors.map((doctor) => (
                    <motion.div
                      key={doctor.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6"
                    >
                      {/* Doctor Image and Basic Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                          <p className="text-blue-600 text-sm font-medium">{doctor.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-400 fill-current" size={16} />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{doctor.reviews} reviews</span>
                          </div>
                        </div>
                      </div>

                      {/* Experience and Hospital */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Stethoscope size={16} />
                          <span>{doctor.experience} experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          <span className="truncate">{doctor.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>Available today</span>
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {doctor.languages.map((lang, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>

                      {/* Specializations */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Specializes in:</p>
                        <div className="flex flex-wrap gap-1">
                          {doctor.specializes.slice(0, 3).map((spec, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Fee and Book Button */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-green-600">{doctor.consultationFee}</span>
                          <span className="text-sm text-gray-500 ml-1">consultation</span>
                        </div>
                        <button
                          onClick={() => handleDoctorSelect(doctor)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          ਬੁੱਕ ਕਰੋ (Book Now)
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && selectedDoctor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Doctor Details */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                      <div className="text-center mb-6">
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-lg">{selectedDoctor.name}</h3>
                        <p className="text-blue-600 text-sm">{selectedDoctor.specialty}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Star className="text-yellow-400 fill-current" size={16} />
                          <span className="font-medium">{selectedDoctor.rating}</span>
                          <span className="text-gray-500">({selectedDoctor.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{selectedDoctor.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Consultation Fee:</span>
                          <span className="font-medium text-green-600">{selectedDoctor.consultationFee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm">{selectedDoctor.phone}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-800">{selectedDoctor.about}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-2xl font-semibold mb-6">ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ (Book Appointment)</h2>
                      
                      <form onSubmit={handleBooking} className="space-y-6">
                        {/* Patient Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <User size={16} />
                            ਮਰੀਜ਼ ਚੁਣੋ (Select Patient)
                          </label>
                          <select
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            {patients.length === 0 ? (
                              <option value="">ਕੋਈ ਮਰੀਜ਼ ਨਹੀਂ ਮਿਲਿਆ (No patients found)</option>
                            ) : (
                              patients.map((p) => (
                                <option key={p.patient_id} value={p.patient_id}>
                                  {p.name} ({p.relation || 'Self'})
                                </option>
                              ))
                            )}
                          </select>
                          {patients.length === 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-red-600 mb-2">
                                ਪਹਿਲਾਂ ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰੋ (Please add family members first)
                              </p>
                              <button
                                type="button"
                                onClick={async () => {
                                  console.log('Manually reloading patients...')
                                  try {
                                    const list = await getPatientsForAccount()
                                    console.log('Reloaded patients:', list)
                                    setPatients(list || [])
                                    if (list && list.length > 0) {
                                      setSelectedPatient(list[0].patient_id)
                                      toast.success(`ਮਰੀਜ਼ ਲੋਡ ਹੋ ਗਏ: ${list.length} (Loaded ${list.length} patients)`)
                                    } else {
                                      toast.error('ਕੋਈ ਮਰੀਜ਼ ਨਹੀਂ ਮਿਲੇ (No patients found)')
                                    }
                                  } catch (error) {
                                    console.error('Error reloading patients:', error)
                                    toast.error('ਮਰੀਜ਼ ਲੋਡ ਕਰਨ ਵਿੱਚ ਸਮਸਿਆ (Error loading patients)')
                                  }
                                }}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                              >
                                ਮੁੜ ਲੋਡ ਕਰੋ (Reload Patients)
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Consultation Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ਸਲਾਹ ਦਾ ਤਰੀਕਾ (Consultation Type)
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="consultationType"
                                value="video"
                                checked={consultationType === 'video'}
                                onChange={(e) => setConsultationType(e.target.value)}
                                className="mr-3"
                              />
                              <Video size={20} className="mr-2 text-blue-600" />
                              <div>
                                <div className="font-medium">ਵੀਡੀਓ ਕਾਲ (Video Call)</div>
                                <div className="text-xs text-gray-500">Face-to-face consultation</div>
                              </div>
                            </label>
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="consultationType"
                                value="phone"
                                checked={consultationType === 'phone'}
                                onChange={(e) => setConsultationType(e.target.value)}
                                className="mr-3"
                              />
                              <Phone size={20} className="mr-2 text-green-600" />
                              <div>
                                <div className="font-medium">ਫੋਨ ਕਾਲ (Phone Call)</div>
                                <div className="text-xs text-gray-500">Voice consultation</div>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Time Slot Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} />
                            ਸਮਾਂ ਚੁਣੋ (Select Time Slot)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {selectedDoctor.availableSlots.map((slot) => (
                              <label key={slot} className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                  type="radio"
                                  name="timeSlot"
                                  value={slot}
                                  checked={selectedSlot === slot}
                                  onChange={(e) => setSelectedSlot(e.target.value)}
                                  className="sr-only"
                                />
                                <span className={`text-sm font-medium ${selectedSlot === slot ? 'text-blue-600' : 'text-gray-700'}`}>
                                  {slot}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Symptoms */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ਲੱਛਣ ਦੱਸੋ (Describe Symptoms)
                          </label>
                          <textarea
                            placeholder="ਆਪਣੇ ਲੱਛਣ ਅਤੇ ਸਮਸਿਆ ਦੱਸੋ (Describe your symptoms and problems)"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 resize-none"
                            required
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Calendar size={18} />
                              ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ (Book Appointment) - {selectedDoctor.consultationFee}
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}