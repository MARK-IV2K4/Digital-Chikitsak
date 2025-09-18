import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import DoctorSidebar from '../../components/DoctorSidebar'
import { getConsultation } from '../../services/consultations'
import { getCurrentUser } from '../../services/auth'

export default function DoctorConsultation() {
  const { id } = useParams() // consultation id
  const [consultation, setConsultation] = useState(null)
  const [patient, setPatient] = useState(null)

  useEffect(() => {
    (async () => {
      if (!id) return
      const data = await getConsultation(id)
      setConsultation(data)
    })()
  }, [id])

  if (!consultation) return <div>Loading...</div>

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <DoctorSidebar />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-semibold mb-4">Consultation with Patient</h1>

          {/* Patient Info */}
          {patient && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Patient Info</h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{patient.name}</span> ({patient.relation})
              </p>
              <p className="text-sm text-gray-500">
                {patient.age ? `${patient.age} yrs` : 'Age not set'} • {patient.gender || 'Gender not set'}
              </p>
              <p className="text-sm text-gray-500">Blood Group: {patient.blood_group || 'N/A'}</p>
            </div>
          )}

          {/* Video Call Section */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Live Video Consultation</h2>
            {consultation?.meeting_link ? (
              (() => {
                const user = getCurrentUser()
                const name = encodeURIComponent(user?.name || user?.phone || 'Doctor')
                const room = (consultation.meeting_link || '').split('/').pop()
                const src = `/jitsi-demo.html?room=${room}&name=${name}&autojoin=1&muted=0&video=1`
                return (
                  <iframe
                    title="Jitsi Meeting"
                    src={src}
                    allow="camera; microphone; fullscreen; display-capture"
                    className="w-full aspect-video rounded border"
                  />
                )
              })()
            ) : (
              <div className="w-full aspect-video bg-black rounded flex items-center justify-center text-white">
                <p>Loading meeting…</p>
              </div>
            )}
          </div>

          {/* Symptoms + Prescription */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Consultation Details</h2>
            <p><span className="font-medium">Symptoms:</span> {consultation.symptoms}</p>

            <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
              Prescription
            </label>
            <textarea
              placeholder="Write prescription..."
              value={consultation.prescription}
              onChange={(e) => setConsultation({ ...consultation, prescription: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            <button className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
              Save Prescription
            </button>
          </div>

          {/* Chat Section */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Chat with Patient</h2>
            <div className="border rounded p-3 h-40 overflow-y-auto text-sm text-gray-600 mb-3">
              <p><span className="font-medium">Patient:</span> Feeling weak.</p>
              <p><span className="font-medium">Doctor:</span> Please keep hydrated and take rest.</p>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
