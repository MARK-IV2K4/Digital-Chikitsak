import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../../services/auth";

export default function DoctorTokens() {
  const user = getCurrentUser();
  const doctorId = user?.id; // ensure doctorId exists
  const [tokens, setTokens] = useState([]);

  const fetchTokens = async () => {
    if (!doctorId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/tokens/${doctorId}`);
      setTokens(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error fetching tokens");
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [doctorId]);

  const handleUpdateStatus = async (tokenId, status) => {
    if (!doctorId) return;
    try {
      await axios.post("http://localhost:5000/api/doctor/update-token", {
        token_id: tokenId,
        status,
      });
      fetchTokens(); // refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating token");
    }
  };

  if (!doctorId) return <p>Please login as a doctor to view tokens.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Today's Tokens</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Token #</th>
            <th className="px-4 py-2 border">Patient</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-2 border">{t.token_number}</td>
              <td className="px-4 py-2 border">{t.patient_name}</td>
              <td className="px-4 py-2 border">{t.status}</td>
              <td className="px-4 py-2 border space-x-2">
                {t.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(t.id, "served")}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Served
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(t.id, "cancelled")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}