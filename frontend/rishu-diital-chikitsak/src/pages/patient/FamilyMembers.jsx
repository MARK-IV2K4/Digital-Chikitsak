import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import PatientSidebar from "../../components/PatientSidebar";
import api from "../../services/api";
import { 
  Plus, 
  User, 
  Calendar, 
  Phone, 
  Stethoscope, 
  Pill, 
  History, 
  Camera, 
  Edit3, 
  Trash2,
  Heart,
  Activity,
  FileText
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function FamilyMembers() {
  const [members, setMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    age: "", 
    gender: "", 
    blood_group: "",
    relation: "",
    phone: "",
    medical_history: "",
    current_medications: "",
    profile_image: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const relations = [
    'Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 
    'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  async function loadMembers() {
    try {
      const res = await api.get("/patients");
      console.log("API Response:", res.data);
      setMembers(res.data || []);
    } catch (error) {
      console.error("Failed to load family members:", error);
      console.error("Error details:", error.response?.data);
      toast.error(`ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੇ (Failed to load family members): ${error.response?.data?.error || error.message}`);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("ਕਿਰਪਾ ਕਰਕੇ ਨਾਮ ਦਾਖਲ ਕਰੋ (Please enter name)");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending form data:", form);
      const response = await api.post("/patients", form);
      console.log("Add patient response:", response.data);
      
      toast.success("ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਸ਼ਾਮਲ ਹੋ ਗਿਆ! (Family member added!)");
      setForm({ 
        name: "", 
        age: "", 
        gender: "", 
        blood_group: "",
        relation: "",
        phone: "",
        medical_history: "",
        current_medications: "",
        profile_image: null
      });
      setShowAddForm(false);
      loadMembers();
    } catch (error) {
      console.error("Failed to add family member:", error);
      console.error("Error details:", error.response?.data);
      toast.error(`ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰਨ ਵਿੱਚ ਸਮਸਿਆ (Failed to add member): ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profile_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const navigateToBookDoctor = (member) => {
    // Store selected member in localStorage for BookDoctor page
    localStorage.setItem('selectedPatient', JSON.stringify(member));
    navigate('/patient/book-doctor');
  };

  const navigateToPharmacy = (member) => {
    // Store selected member in localStorage for Pharmacy page
    localStorage.setItem('selectedPatient', JSON.stringify(member));
    navigate('/patient/pharmacy');
  };

  const navigateToSymptomChecker = (member) => {
    // Store selected member in localStorage for Symptom Checker
    localStorage.setItem('selectedPatient', JSON.stringify(member));
    navigate('/patient/symptom-checker');
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਲਾਗਇਨ ਕਰੋ (Please login first)");
      return;
    }
    
    loadMembers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" />
      <Header />
      <div className="flex flex-1">
        <PatientSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  ਪਰਿਵਾਰਕ ਸਿਹਤ ਪ੍ਰਬੰਧਨ (Family Health Management)
                </h1>
                <p className="text-gray-600">
                  ਆਪਣੇ ਪਰਿਵਾਰ ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਦੀ ਸਿਹਤ ਦਾ ਰਿਕਾਰਡ ਰੱਖੋ (Manage health records for all family members)
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰੋ (Add Member)
              </button>
            </div>

            {/* Family Members Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {members.map((member) => (
                <motion.div
                  key={member.patient_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6"
                >
                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {member.profile_image ? (
                        <img 
                          src={member.profile_image} 
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.age ? `${member.age} years` : 'Age not specified'} • {member.gender || 'Gender not specified'}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        {member.relation || 'Relation not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Health Info */}
                  <div className="space-y-2 mb-6">
                    {member.blood_group && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="text-red-500" size={16} />
                        <span className="text-gray-600">Blood Group:</span>
                        <span className="font-medium">{member.blood_group}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="text-green-500" size={16} />
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{member.phone}</span>
                      </div>
                    )}
                    {member.current_medications && (
                      <div className="flex items-center gap-2 text-sm">
                        <Pill className="text-orange-500" size={16} />
                        <span className="text-gray-600">Current Medications</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigateToBookDoctor(member)}
                      className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Stethoscope size={16} />
                      ਡਾਕਟਰ ਬੁੱਕ ਕਰੋ
                    </button>
                    <button
                      onClick={() => navigateToPharmacy(member)}
                      className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      <Pill size={16} />
                      ਦਵਾਈ ਲੱਭੋ
                    </button>
                    <button
                      onClick={() => navigateToSymptomChecker(member)}
                      className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                    >
                      <Activity size={16} />
                      ਲੱਛਣ ਚੈੱਕ ਕਰੋ
                    </button>
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      <FileText size={16} />
                      ਰਿਕਾਰਡ ਦੇਖੋ
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Member Modal */}
            <AnimatePresence>
              {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                          ਨਵਾਂ ਮੈਂਬਰ ਸ਼ਾਮਲ ਕਰੋ (Add New Member)
                        </h2>
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleAdd} className="space-y-6">
                        {/* Profile Image */}
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {form.profile_image ? (
                              <img 
                                src={form.profile_image} 
                                alt="Profile"
                                className="w-24 h-24 object-cover"
                              />
                            ) : (
                              <Camera className="text-gray-400" size={32} />
                            )}
                          </div>
                          <label className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                            <Camera size={16} className="inline mr-2" />
                            ਫੋਟੋ ਚੁਣੋ (Choose Photo)
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ਨਾਮ (Name) *
                            </label>
                            <input
                              type="text"
                              placeholder="ਪੂਰਾ ਨਾਮ ਦਾਖਲ ਕਰੋ"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ਰਿਸ਼ਤਾ (Relation)
                            </label>
                            <select
                              value={form.relation}
                              onChange={(e) => setForm({ ...form, relation: e.target.value })}
                              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">ਰਿਸ਼ਤਾ ਚੁਣੋ</option>
                              {relations.map(relation => (
                                <option key={relation} value={relation}>{relation}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ਉਮਰ (Age)
                            </label>
                            <input
                              type="number"
                              placeholder="ਉਮਰ"
                              value={form.age}
                              onChange={(e) => setForm({ ...form, age: e.target.value })}
                              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ਲਿੰਗ (Gender)
                            </label>
                            <select
                              value={form.gender}
                              onChange={(e) => setForm({ ...form, gender: e.target.value })}
                              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">ਲਿੰਗ ਚੁਣੋ</option>
                              <option value="Male">ਮਰਦ (Male)</option>
                              <option value="Female">ਔਰਤ (Female)</option>
                              <option value="Other">ਹੋਰ (Other)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ਖੂਨ ਦਾ ਗਰੁੱਪ (Blood Group)
                            </label>
                            <select
                              value={form.blood_group}
                              onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">ਖੂਨ ਦਾ ਗਰੁੱਪ ਚੁਣੋ</option>
                              {bloodGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ਫੋਨ ਨੰਬਰ (Phone Number)
                          </label>
                          <input
                            type="tel"
                            placeholder="10-digit phone number"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ਮੌਜੂਦਾ ਦਵਾਈਆਂ (Current Medications)
                          </label>
                          <textarea
                            placeholder="ਮੌਜੂਦਾ ਦਵਾਈਆਂ ਦੀ ਸੂਚੀ..."
                            value={form.current_medications}
                            onChange={(e) => setForm({ ...form, current_medications: e.target.value })}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="3"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ਮੈਡੀਕਲ ਇਤਿਹਾਸ (Medical History)
                          </label>
                          <textarea
                            placeholder="ਪੁਰਾਣੀਆਂ ਬਿਮਾਰੀਆਂ, ਐਲਰਜੀ ਆਦਿ..."
                            value={form.medical_history}
                            onChange={(e) => setForm({ ...form, medical_history: e.target.value })}
                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="3"
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            ਰੱਦ ਕਰੋ (Cancel)
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Plus size={18} />
                                ਸ਼ਾਮਲ ਕਰੋ (Add Member)
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Member Details Modal */}
            <AnimatePresence>
              {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {selectedMember.name} ਦਾ ਰਿਕਾਰਡ (Medical Record)
                        </h2>
                        <button
                          onClick={() => setSelectedMember(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-3">ਬੁਨਿਆਦੀ ਜਾਣਕਾਰੀ (Basic Information)</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Age:</span>
                              <span className="ml-2 font-medium">{selectedMember.age || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Gender:</span>
                              <span className="ml-2 font-medium">{selectedMember.gender || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Blood Group:</span>
                              <span className="ml-2 font-medium">{selectedMember.blood_group || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <span className="ml-2 font-medium">{selectedMember.phone || 'Not specified'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Medical History */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-3">ਮੈਡੀਕਲ ਇਤਿਹਾਸ (Medical History)</h3>
                          <p className="text-sm text-gray-700">
                            {selectedMember.medical_history || 'ਕੋਈ ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਦਰਜ ਨਹੀਂ (No medical history recorded)'}
                          </p>
                        </div>

                        {/* Current Medications */}
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-3">ਮੌਜੂਦਾ ਦਵਾਈਆਂ (Current Medications)</h3>
                          <p className="text-sm text-gray-700">
                            {selectedMember.current_medications || 'ਕੋਈ ਦਵਾਈ ਨਹੀਂ ਚੱਲ ਰਹੀ (No current medications)'}
                          </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => {
                              setSelectedMember(null);
                              navigateToBookDoctor(selectedMember);
                            }}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <Stethoscope size={16} />
                            ਡਾਕਟਰ ਬੁੱਕ ਕਰੋ
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMember(null);
                              navigateToPharmacy(selectedMember);
                            }}
                            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Pill size={16} />
                            ਦਵਾਈ ਲੱਭੋ
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMember(null);
                              navigateToSymptomChecker(selectedMember);
                            }}
                            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            <Activity size={16} />
                            ਲੱਛਣ ਚੈੱਕ
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}