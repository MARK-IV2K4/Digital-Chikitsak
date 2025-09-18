import React from 'react'
import { getCurrentUser, logout } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const user = getCurrentUser()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/Logo.png" alt="Digital Chikitsak Logo" className="h-8 w-8 object-contain" />
        <div className="text-2xl font-semibold text-accent">Digital Chikitsak</div>
        <div className="text-sm text-gray-500">Community Healthcare</div>
      </div>

      <div className="flex items-center gap-4">
        {user && <div className="text-sm text-gray-700">Hi, {user.name || user.phone}</div>}
        <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-primary text-white text-sm">
          Logout
        </button>
      </div>
    </header>
  )
}
