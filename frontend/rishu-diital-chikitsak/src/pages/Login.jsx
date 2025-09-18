import React, { useState } from 'react'
import { login } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { Phone, Lock, LogIn } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Validate Indian phone number (10 digits)
  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phoneNumber)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!validatePhone(phone)) {
      toast.error('ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ (Please enter valid phone number)')
      return
    }

    if (!pin.trim()) {
      toast.error('ਕਿਰਪਾ ਕਰਕੇ PIN ਦਾਖਲ ਕਰੋ (Please enter PIN)')
      return
    }

    setLoading(true)
    try {
      const user = await login({ phone, pin })
      toast.success('ਲਾਗਇਨ ਸਫਲ! (Login successful!)')
      
      setTimeout(() => {
        if (user.role === 'doctor') navigate('/doctor')
        else navigate('/patient')
      }, 1500)
    } catch (error) {
      console.error('Login error:', error)
      toast.error('ਲਾਗਇਨ ਵਿੱਚ ਸਮਸਿਆ - ਫੋਨ ਨੰਬਰ ਜਾਂ PIN ਚੈੱਕ ਕਰੋ (Login failed - check phone number or PIN)')
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
            <h1 className="text-2xl font-bold text-white">ਵਾਪਸ ਆਇਆ ਨੂੰ (Welcome Back)</h1>
            <p className="text-sm text-white/80 mt-1">ਚਿਕਿਤਸਕ ਵਿੱਚ ਲਾਗਇਨ ਕਰੋ (Login to Chikitsak)</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone size={16} />
                ਫੋਨ ਨੰਬਰ (Phone Number)
              </label>
              <input
                type="tel"
                placeholder="10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {phone && !validatePhone(phone) && (
                <p className="text-red-500 text-xs mt-1">ਸਹੀ 10 ਅੰਕਾਂ ਦਾ ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ (Enter valid 10-digit phone number)</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Lock size={16} />
                PIN
              </label>
              <input
                type="password"
                placeholder="ਆਪਣਾ PIN ਦਾਖਲ ਕਰੋ (Enter your PIN)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  ਲਾਗਇਨ ਕਰੋ (Login)
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t text-center text-sm text-gray-600">
            ਖਾਤਾ ਨਹੀਂ ਹੈ? (Don't have an account?){' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              ਰਜਿਸਟਰ ਕਰੋ (Register)
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}