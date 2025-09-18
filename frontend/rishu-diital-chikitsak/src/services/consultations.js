import api from './api'

export async function listConsultations() {
  const { data } = await api.get('/consultations')
  return data
}

export async function getConsultation(consultationId) {
  const { data } = await api.get(`/consultations/${consultationId}`)
  return data
}

export async function createConsultation({ patient_id, doctor_id, symptoms }) {
  const { data } = await api.post('/consultations', { patient_id, doctor_id, symptoms })
  return data
}


