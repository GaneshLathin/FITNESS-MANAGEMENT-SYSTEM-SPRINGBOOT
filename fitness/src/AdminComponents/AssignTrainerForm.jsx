import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserCog,
  UserPlus,
  RefreshCcw,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

const AssignTrainerForm = () => {
  const [trainers, setTrainers] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignData, setAssignData] = useState({ clientId: "", trainerId: "" });
  const [message, setMessage] = useState("");

  // ✅ Token
  const storedData = localStorage.getItem("jwtToken");
  let token = null;
  if (storedData) {
    try {
      token = JSON.parse(storedData).token;
    } catch (err) {
      console.error("Invalid token in localStorage", err);
    }
  }

  const api = axios.create({
    baseURL: "http://localhost:8080/api/admin",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  // ---------------- API METHODS ----------------
  const fetchTrainers = async () => {
    try {
      const res = await api.get("/all-trainers");
      setTrainers(res.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setMessage("❌ Error fetching trainers");
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/all-clients");
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setMessage("❌ Error fetching clients");
    }
  };

  const handleAssign = async () => {
    if (!assignData.clientId || !assignData.trainerId) {
      setMessage("❌ Please select both client and trainer");
      return;
    }
    try {
      const res = await api.post("/assign-trainer", assignData);
      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Trainer assigned successfully!");
      } else {
        setMessage("❌ Failed to assign trainer");
      }
    } catch (err) {
      console.error("Error assigning trainer:", err);
      setMessage("❌ Error assigning trainer");
    }
  };

  const handleModifyTrainer = async () => {
    if (!assignData.clientId || !assignData.trainerId) {
      setMessage("❌ Please select both client and trainer");
      return;
    }
    try {
      const res = await api.put("/modify-assigned-trainer", assignData);
      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Trainer modified successfully!");
      } else {
        setMessage("❌ Failed to modify trainer assignment");
      }
    } catch (err) {
      console.error("Error modifying trainer assignment:", err);
      setMessage("❌ Error modifying trainer assignment");
    }
  };

  useEffect(() => {
    fetchTrainers();
    fetchClients();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Assign Trainer
            </h1>
            <p className="text-gray-600 mt-2 text-sm">Connect clients with their perfect trainer</p>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm flex items-center space-x-2 ${
              message.includes("✅")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {message.includes("✅") ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.replace(/✅|❌/g, "")}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Client Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Select Client</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={assignData.clientId}
                  onChange={(e) =>
                    setAssignData({ ...assignData, clientId: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Choose a client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Trainer Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Select Trainer</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCog className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={assignData.trainerId}
                  onChange={(e) =>
                    setAssignData({ ...assignData, trainerId: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Choose a trainer</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAssign}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <UserCheck className="w-5 h-5" />
                <span>Assign Trainer</span>
              </button>
              <button
                onClick={handleModifyTrainer}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RefreshCcw className="w-5 h-5" />
                <span>Modify Assignment</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Quick Guide</p>
                  <p className="mt-1">Use "Assign Trainer" for new assignments or "Modify Assignment" to change existing trainer-client relationships.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AssignTrainerForm;