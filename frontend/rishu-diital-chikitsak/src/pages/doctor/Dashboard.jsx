import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import DoctorSidebar from '../../components/DoctorSidebar'
import { Link } from 'react-router-dom'

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    // fetch doctor's appointments
    setAppointments([
      { consultation_id: 'c1', patient_name: 'Aman', time: '2025-09-10 10:00', status: 'pending' },
      { consultation_id: 'c2', patient_name: 'Sakshi', time: '2025-09-11 11:30', status: 'ongoing' },
    ])
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <DoctorSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Doctor Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Upcoming consultations</h3>
              <ul className="mt-3 space-y-2">
                {appointments.map(a => (
                  <li key={a.consultation_id} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">{a.patient_name}</div>
                      <div className="text-sm text-gray-500">{a.time} • {a.status}</div>
                    </div>
                    <Link to={`/doctor/consultation/${a.consultation_id}`} className="px-3 py-1 rounded bg-primary text-white">Open</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Stats</h3>
              <div className="mt-3 text-sm text-gray-500">Total consultations: 205 • Cases solved: 180</div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
