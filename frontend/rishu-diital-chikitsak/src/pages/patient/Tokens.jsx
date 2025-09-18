import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../../services/auth";

export default function PatientTokens() {
  const user = getCurrentUser();
  const patientId = user?.id;

  const [doctorId, setDoctorId] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);

  const handleGenerateToken = async () => {
    if (!doctorId) return alert("Please select a doctor");
    if (!patientId) return alert("Patient ID not found. Please login again.");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/patient/generate-token", // use full backend URL or proxy
        {
          patient_id: patientId,
          doctor_id: doctorId,
        }
      );
      setTokenInfo(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error generating token");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Generate Token</h1>

      <div className="mb-4">
        <label className="block mb-2">Select Doctor:</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select --</option>
          <option value="1">Dr. Sharma</option>
          <option value="2">Dr. Verma</option>
        </select>
      </div>

      <button
        onClick={handleGenerateToken}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Generate Token
      </button>

      {tokenInfo && (
        <div className="mt-4 p-4 border rounded bg-green-50">
          <p>Your token number: <strong>{tokenInfo.token}</strong></p>
          <p>Date: {tokenInfo.date}</p>
        </div>
      )}
    </div>
  );
}