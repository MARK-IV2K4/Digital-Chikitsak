import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import PatientSidebar from '../../components/PatientSidebar'
import { Link } from 'react-router-dom'
import { getPatientsForAccount, addFamilyMember } from '../../services/auth'

export default function PatientDashboard() {
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', age: '', gender: '', blood_group: '', relation: '' })

  useEffect(() => {
    (async () => {
      const data = await getPatientsForAccount()
      setPatients(data)
    })()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    const newMember = await addFamilyMember(form)
    setPatients(prev => [...prev, newMember])
    setForm({ name: '', age: '', gender: '', blood_group: '', relation: '' })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <PatientSidebar />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-semibold mb-4">Patient Dashboard</h1>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Quick actions</h3>
              <ul className="mt-3 space-y-2">
                <li><Link to="/patient/symptom-checker" className="text-primary">AI Symptom Checker</Link></li>
                <li><Link to="/patient/book-doctor" className="text-primary">Book Doctor</Link></li>
                <li><Link to="/patient/pharmacy" className="text-primary">Pharmacy</Link></li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded shadow md:col-span-2">
              <h3 className="font-semibold">Recent consultations</h3>
              <p className="text-sm text-gray-500 mt-2">No records yet (backend required to fetch consultations).</p>
            </div>
          </section>

          {/* Family Members */}
          <section className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Family Members</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-3 py-1 rounded-md bg-primary text-white text-sm hover:bg-primary/90"
              >
                {showForm ? 'Cancel' : 'Add Member'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="border px-3 py-2 rounded"
                />
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="border px-3 py-2 rounded"
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Blood Group"
                  value={form.blood_group}
                  onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                  className="border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Relation (e.g. Self, Spouse, Child)"
                  value={form.relation}
                  onChange={(e) => setForm({ ...form, relation: e.target.value })}
                  className="border px-3 py-2 rounded"
                  required
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-primary text-white rounded py-2 hover:bg-primary/90"
                >
                  Save Member
                </button>
              </form>
            )}

            {patients.length > 0 ? (
              <ul className="divide-y">
                {patients.map((p) => (
                  <li key={p.patient_id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{p.name} ({p.relation})</div>
                      <div className="text-sm text-gray-500">
                        {p.age ? `${p.age} yrs` : ''} {p.gender || ''} {p.blood_group || ''}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{p.patient_id.slice(0, 6)}...</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No family members yet.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
