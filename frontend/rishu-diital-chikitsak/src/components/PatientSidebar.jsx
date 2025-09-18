import React from 'react'
import { NavLink } from 'react-router-dom'

export default function PatientSidebar() {
  const links = [
    { to: '/patient', label: 'Dashboard' },
    { to: '/patient/symptom-checker', label: 'AI Symptom Checker' },
    { to: '/patient/book-doctor', label: 'Book Doctor' },
    { to: '/patient/consultation', label: 'Online Consultation' },
    { to: '/patient/pharmacy', label: 'Pharmacy' },
    { to: '/patient/family', label: 'Family Members' },
    { to: '/patient/tokens', label: 'Tokens' }, // New link added
  ]

  return (
    <aside className="hidden md:block w-64 bg-white border-r p-4">
      <div className="text-lg font-semibold mb-4">Patient</div>
      <nav className="flex flex-col gap-2">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-slate-50'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}