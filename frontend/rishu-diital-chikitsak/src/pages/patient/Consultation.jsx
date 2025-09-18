import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import PatientSidebar from '../../components/PatientSidebar'
import { getConsultation } from '../../services/consultations'
import { getCurrentUser } from '../../services/auth'

export default function PatientConsultation() {
  const { id } = useParams() // consultation id
  const [consultation, setConsultation] = useState(null)
  const [room, setRoom] = useState('')

  useEffect(() => {
    (async () => {
      if (!id) return
      const data = await getConsultation(id)
      setConsultation(data)
      const link = data?.meeting_link || ''
      const r = link.split('/').pop()
      if (r) setRoom(r)
    })()
  }, [id])

  // Auto-forward to Jitsi page when room available, or generate and forward if no id
  useEffect(() => {
    const user = getCurrentUser()
    const name = encodeURIComponent(user?.name || user?.phone || 'Patient')
    // If there is a room from backend, redirect
    if (room) {
      const target = `/jitsi-demo.html?room=${room}&name=${name}&autojoin=1`
      window.location.replace(target)
      return
    }
    // If no consultation id was provided, generate a room and redirect
    if (!id && typeof crypto !== 'undefined') {
      const gen = `telemed-${(crypto?.randomUUID?.() || Date.now().toString(36))}`
      const target = `/jitsi-demo.html?room=${gen}&name=${name}&autojoin=1`
      window.location.replace(target)
    }
  }, [room, id])

  if (!consultation) return <div>Loading...</div>

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <PatientSidebar />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-semibold mb-4">Online Consultation</h1>

          {/* Live Video Call */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Live Video Consultation</h2>
            {room || consultation?.meeting_link ? (
              (() => {
                const user = getCurrentUser()
                const name = encodeURIComponent(user?.name || user?.phone || 'Patient')
                const r = room || (consultation.meeting_link || '').split('/').pop()
                const src = `/jitsi-demo.html?room=${r}&name=${name}&autojoin=1&muted=0&video=1`
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
              <div className="space-y-3">
                <div className="text-sm text-gray-600">No meeting yet. Click below to generate a video room and share it with the doctor.</div>
                <button
                  onClick={() => setRoom(`telemed-${(crypto?.randomUUID?.() || Date.now().toString(36))}`)}
                  className="px-4 py-2 rounded bg-primary text-white">
                  Start Video Call
                </button>
              </div>
            )}
          </div>

          {(room || consultation?.meeting_link) && (
            (() => {
              const r = room || (consultation.meeting_link || '').split('/').pop()
              const shareDemo = `${window.location.origin}/jitsi-demo.html?room=${r}&autojoin=1`
              const shareJitsi = `https://meet.jit.si/${r}`
              const copy = async (text) => {
                try { await navigator.clipboard.writeText(text) } catch {}
              }
              return (
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold mb-2">Share Meeting Link</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2 items-center">
                      <input readOnly value={shareDemo} className="flex-1 border rounded px-2 py-1" />
                      <button onClick={() => copy(shareDemo)} className="px-3 py-1 rounded bg-primary text-white">Copy</button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input readOnly value={shareJitsi} className="flex-1 border rounded px-2 py-1" />
                      <button onClick={() => copy(shareJitsi)} className="px-3 py-1 rounded bg-primary text-white">Copy</button>
                    </div>
                  </div>
                </div>
              )
            })()
          )}

          {/* Chat Section */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">Chat</h2>
            <div className="border rounded p-3 h-40 overflow-y-auto text-sm text-gray-600 mb-3">
              <p><span className="font-medium">Doctor:</span> How are you feeling today?</p>
              <p><span className="font-medium">Patient:</span> Feeling a bit better, but still mild fever.</p>
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
