import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const AssignPlan = () => {
  const { auth } = useAuth();
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch trainer's clients
    axios
      .get("http://localhost:8080/api/trainer/my-clients", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        console.log("Clients API response:", res.data);
        setClients(Array.isArray(res.data) ? res.data : res.data.clients || []);
      })
      .catch((err) => console.error("Failed to fetch clients:", err));

    // Fetch workout plans
    axios
      .get("http://localhost:8080/api/trainer/workout-plans", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        console.log("Plans API response:", res.data);
        setPlans(Array.isArray(res.data) ? res.data : res.data.plans || []);
      })
      .catch((err) => console.error("Failed to fetch plans:", err));
  }, [auth.token]);

  const handleAssign = async () => {
    if (!selectedClient || !selectedPlan) {
      alert("Please select both client and plan");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/trainer/assign-plan?clientId=${selectedClient}&planId=${selectedPlan}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      alert("Workout plan assigned successfully!");
      setSelectedClient("");
      setSelectedPlan("");
    } catch (err) {
      console.error(err);
      alert("Failed to assign plan");
    } finally {
      setLoading(false);
    }
  };

  const selectedClientData = clients.find(c => c.id.toString() === selectedClient);
  const selectedPlanData = plans.find(p => p.id.toString() === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 sm:p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Assign Workout Plan</h1>
                <p className="text-purple-100">Connect clients with their perfect workout plans</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selection Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Assignment Details</h2>
              
              {/* Client Selection */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800">
                  Select Client
                </label>
                <select
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-800 bg-white"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">Choose a client...</option>
                  {Array.isArray(clients) &&
                    clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                </select>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800">
                  Select Workout Plan
                </label>
                <select
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-800 bg-white"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="">Choose a workout plan...</option>
                  {Array.isArray(plans) &&
                    plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Assign Button */}
              <div className="pt-6">
                <button
                  onClick={handleAssign}
                  disabled={!selectedClient || !selectedPlan || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span>Assign Plan to Client</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Assignment Preview</h3>
              
              <div className="space-y-4">
                {/* Client Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Client</h4>
                  {selectedClientData ? (
                    <div>
                      <p className="font-medium text-indigo-800">{selectedClientData.name}</p>
                      <p className="text-sm text-indigo-600">{selectedClientData.email}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No client selected</p>
                  )}
                </div>

                {/* Plan Preview */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Workout Plan</h4>
                  {selectedPlanData ? (
                    <div>
                      <p className="font-medium text-emerald-800">{selectedPlanData.name}</p>
                      <p className="text-sm text-emerald-600">Ready to assign</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No plan selected</p>
                  )}
                </div>

                {/* Status */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Status</h4>
                  {selectedClient && selectedPlan ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-green-700 font-medium">Ready to assign</p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <p className="text-sm text-amber-700 font-medium">Select both client and plan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignPlan;