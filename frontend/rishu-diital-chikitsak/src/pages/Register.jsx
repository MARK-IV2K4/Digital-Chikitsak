import React, { useState } from 'react'
import { register } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { Phone, User, Lock, Shield, Check } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function Register() {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [role, setRole] = useState('patient')
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Validate Indian phone number (10 digits)
  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phoneNumber)
  }

  // Generate and send OTP
  const sendOtp = async () => {
    if (!validatePhone(phone)) {
      toast.error('ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ (Please enter valid 10-digit phone number)')
      return
    }

    setLoading(true)
    // Generate 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    
    // In a real app, you would send this via SMS API
    // For demo purposes, we'll show it in console and toast
    console.log('OTP for', phone, ':', newOtp)
    toast.success(`OTP sent to ${phone}: ${newOtp} (Demo mode)`)
    
    setOtpSent(true)
    setLoading(false)
  }

  // Verify OTP
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true)
      toast.success('ਫੋਨ ਨੰਬਰ ਤਸਦੀਕ ਹੋ ਗਿਆ! (Phone number verified!)')
    } else {
      toast.error('ਗਲਤ OTP, ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ (Wrong OTP, please try again)')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!otpVerified) {
      toast.error('ਪਹਿਲਾਂ ਫੋਨ ਨੰਬਰ ਦੀ ਤਸਦੀਕ ਕਰੋ (Please verify phone number first)')
      return
    }

    if (!name.trim()) {
      toast.error('ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ ਦਾਖਲ ਕਰੋ (Please enter your name)')
      return
    }

    if (pin.length < 4) {
      toast.error('PIN ਘੱਟੋ ਘੱਟ 4 ਅੰਕਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ (PIN must be at least 4 digits)')
      return
    }

    setLoading(true)
    try {
      console.log('Sending registration data:', { phone, name, pin, role })
      const user = await register({ phone, name, pin, role })
      console.log('Registration successful:', user)
      toast.success('ਰਜਿਸਟਰੇਸ਼ਨ ਸਫਲ! (Registration successful!)')
      
      setTimeout(() => {
        if (user.role === 'doctor') navigate('/doctor')
        else navigate('/patient')
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      if (error.response?.status === 409) {
        toast.error('ਇਹ ਫੋਨ ਨੰਬਰ ਪਹਿਲਾਂ ਤੋਂ ਰਜਿਸਟਰਡ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਲਾਗਇਨ ਕਰੋ। (This phone number is already registered. Please login instead.)')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error'
        toast.error(`ਰਜਿਸਟਰੇਸ਼ਨ ਵਿੱਚ ਸਮਸਿਆ (Registration failed): ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Toaster position="top-center" />
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-center">
            <div className="text-4xl mb-2">🏥</div>
            <h1 className="text-2xl font-bold text-white">ਖਾਤਾ ਬਣਾਓ (Create Account)</h1>
            <p className="text-sm text-white/80 mt-1">ਚਿਕਿਤਸਕ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ (Join Chikitsak)</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone size={16} />
                ਫੋਨ ਨੰਬਰ (Phone Number)
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={otpVerified}
                  className={`flex-1 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    otpVerified ? 'bg-green-50 border-green-300' : ''
                  }`}
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading || !validatePhone(phone)}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {loading ? '...' : 'Send OTP'}
                  </button>
                )}
                {otpVerified && (
                  <div className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg flex items-center">
                    <Check size={16} />
                  </div>
                )}
              </div>
              {phone && !validatePhone(phone) && (
                <p className="text-red-500 text-xs mt-1">ਸਹੀ 10 ਅੰਕਾਂ ਦਾ ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ (Enter valid 10-digit phone number)</p>
              )}
            </div>

            {/* OTP Verification */}
            {otpSent && !otpVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-50 p-4 rounded-lg"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Shield size={16} />
                  OTP ਦਾਖਲ ਕਰੋ (Enter OTP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="flex-1 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otp.length !== 6}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Verify
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  OTP sent to {phone}. Check console for demo OTP.
                </p>
              </motion.div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <User size={16} />
                ਪੂਰਾ ਨਾਮ (Full Name)
              </label>
              <input
                type="text"
                placeholder="ਆਪਣਾ ਨਾਮ ਦਾਖਲ ਕਰੋ (Enter your name)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Lock size={16} />
                PIN (4-6 ਅੰਕ)
              </label>
              <input
                type="password"
                placeholder="ਸੁਰੱਖਿਆ PIN ਚੁਣੋ (Choose security PIN)"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ਭੂਮਿਕਾ (Role)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="patient">ਮਰੀਜ਼ (Patient)</option>
                <option value="doctor">ਡਾਕਟਰ (Doctor)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <User size={18} />
                  ਰਜਿਸਟਰ ਕਰੋ (Register)
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t text-center text-sm text-gray-600">
            ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ? (Already have an account?){' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              ਲਾਗਇਨ ਕਰੋ (Login)
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
