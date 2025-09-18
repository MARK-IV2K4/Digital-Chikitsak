import React from 'react'
import { NavLink } from 'react-router-dom'

export default function DoctorSidebar() {
  const links = [
    { to: '/doctor', label: 'Dashboard' },
    { to: '/doctor/consultation/1', label: 'Consultations' }, // add more if needed
  ]

  return (
    <aside className="hidden md:block w-64 bg-white border-r p-4">
      <div className="text-lg font-semibold mb-4">Doctor</div>
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
