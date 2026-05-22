// src/ClientComponents/LogExercise.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientService from "../clientService";
import { Save, Dumbbell, Hash, Weight } from "lucide-react";
import { toast } from "react-toastify";

const LogExercise = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ repsCompleted: "", weightLifted: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.repsCompleted || !form.weightLifted) {
      toast.error("⚠️ Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await clientService.logExercise({
        planExerciseId: exerciseId,
        repsCompleted: parseInt(form.repsCompleted),
        weightLifted: parseFloat(form.weightLifted),
      });
      toast.success("✅ Progress logged successfully!");
      navigate(`/client/exercise/${exerciseId}/progress`);
    } catch (error) {
      toast.error("❌ Error logging exercise. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-3 justify-center mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Log Exercise
            </h1>
          </div>
          <p className="text-slate-600">Record your workout performance</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Workout Details</h2>
            </div>
          </div>
          
          <div className="p-6 lg:p-8 space-y-6">
            
            {/* Reps Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Hash className="w-4 h-4 text-blue-500" />
                Reps Completed
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="repsCompleted"
                  value={form.repsCompleted}
                  onChange={handleChange}
                  placeholder="Enter number of reps"
                  className="w-full p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  reps
                </div>
              </div>
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Weight className="w-4 h-4 text-green-500" />
                Weight Lifted
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="weightLifted"
                  value={form.weightLifted}
                  onChange={handleChange}
                  placeholder="Enter weight"
                  className="w-full p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  kg
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
              {loading ? "Saving..." : "Save Exercise Log"}
            </button>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• Log your workouts immediately after completing them</li>
            <li>• Be honest with your numbers to track real progress</li>
            <li>• Consistency is key - small progress adds up over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogExercise;
