import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { getCurrentUser, logout } from '../services/auth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  // Links
  const guestLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ]

  const patientLinks = [
    { to: '/patient', label: 'Dashboard' },
    { to: '/patient/symptom-checker', label: 'AI Symptom Checker' },
    { to: '/patient/book-doctor', label: 'Book Doctor' },
    { to: '/patient/consultation', label: 'Consultation' },
    { to: '/patient/pharmacy', label: 'Pharmacy' },
    { to: '/patient/family', label: 'Family Members' }, // Added
    { to: '/patient/tokens', label: 'Tokens' },         // Added
    { to: '/about', label: 'About' }, 
  ]

  const doctorLinks = [
    { to: '/doctor', label: 'Dashboard' },
    { to: '/doctor/consultation/1', label: 'Consultations' },
    { to: '/doctor/tokens', label: 'Tokens' },          // Added
    { to: '/about', label: 'About' }, 
  ]

  let navLinks = guestLinks
  if (user?.role === 'patient') navLinks = patientLinks
  if (user?.role === 'doctor') navLinks = doctorLinks

  return (
    <nav className="w-full bg-white/90 backdrop-blur shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo.png" alt="Nabha TeleMed Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold text-primary">Nabha TeleMed</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition ${
                location.pathname === link.to
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Greeting + Logout */}
          {user && (
            <>
              <span className="text-gray-600 text-sm">Hi, {user.name || user.phone}</span>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 rounded-md bg-primary text-white text-sm hover:bg-primary/90"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium transition ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  handleLogout()
                }}
                className="w-full text-left px-3 py-2 rounded-md bg-primary text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}