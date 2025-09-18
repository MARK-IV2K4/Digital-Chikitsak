import React from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../services/auth'

export default function ProtectedRoute({ children, role }) {
  const user = getCurrentUser()
  console.log("🔎 ProtectedRoute check:", user)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (role && user.role !== role) {
    console.warn(`Access denied. Expected role=${role}, got role=${user.role}`)
    return <div className="p-6 text-red-600">Access denied ❌</div>
    // or: return <Navigate to="/login" />
  }

  return children
}
