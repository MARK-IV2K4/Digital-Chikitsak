import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import PatientSidebar from '../../components/PatientSidebar'
import PharmacyFinder from '../../components/PharmacyFinder'
import { User, AlertCircle } from 'lucide-react'

export default function Pharmacy() {
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [recommendedMedicines, setRecommendedMedicines] = useState([])

  useEffect(() => {
    // Check if a patient was selected from family management
    const storedPatient = localStorage.getItem('selectedPatient')
    if (storedPatient) {
      try {
        const patient = JSON.parse(storedPatient)
        setSelectedPatient(patient)
        // Clear the stored patient after use
        localStorage.removeItem('selectedPatient')
        
        // Set recommended medicines based on patient's current medications
        if (patient.current_medications) {
          const medicines = patient.current_medications.split(',').map(med => med.trim()).filter(med => med)
          setRecommendedMedicines(medicines)
        }
      } catch (error) {
        console.error('Error parsing selected patient:', error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <PatientSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ਦਵਾਈ ਦੀਆਂ ਦੁਕਾਨਾਂ (Pharmacy & Medicines)
              </h1>
              <p className="text-gray-600">
                ਆਪਣੇ ਨੇੜੇ ਦੀਆਂ ਦਵਾਈ ਦੀਆਂ ਦੁਕਾਨਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਸਟਾਕ ਦੇਖੋ (Find nearby pharmacies and their medicine stock)
              </p>
            </div>

            {/* Selected Patient Info */}
            {selectedPatient && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      ਚੁਣਿਆ ਗਿਆ ਮਰੀਜ਼ (Selected Patient): {selectedPatient.name}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {selectedPatient.age ? `${selectedPatient.age} years` : ''} 
                      {selectedPatient.age && selectedPatient.gender ? ' • ' : ''}
                      {selectedPatient.gender || ''}
                      {selectedPatient.relation ? ` • ${selectedPatient.relation}` : ''}
                    </p>
                  </div>
                </div>
                
                {selectedPatient.current_medications && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-orange-500 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">ਮੌਜੂਦਾ ਦਵਾਈਆਂ (Current Medications):</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedPatient.current_medications}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pharmacy Finder Component */}
            <PharmacyFinder recommendedMedicines={recommendedMedicines} />
          </div>
        </main>
      </div>
    </div>
  )
}
