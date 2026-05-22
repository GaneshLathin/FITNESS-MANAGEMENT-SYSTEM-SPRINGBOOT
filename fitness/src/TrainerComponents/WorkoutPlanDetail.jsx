import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import toast, { Toaster } from "react-hot-toast"; // ✅ toast

const WorkoutPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExercise, setEditingExercise] = useState(null);
  const [editForm, setEditForm] = useState({
    sets: "",
    reps: "",
    restTimeSeconds: "",
    dayOfWeek: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchPlan();
  }, [id, auth.token]);

  const fetchPlan = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/trainer/workout-plans/${id}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setPlan(res.data);
    } catch (err) {
      console.error("Failed to fetch workout plan:", err);
      setError("Could not load workout plan. Please try again.");
      toast.error("Could not load workout plan."); // ✅ toast

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this workout plan?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/api/trainer/workout-plans/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success("Workout plan deleted successfully!"); // ✅ toast
      navigate("/trainer");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete plan. Please try again."); // ✅ toast
    }
  };

  const startEdit = (exercise) => {
    setEditingExercise(exercise.planExerciseId);
    setEditForm({
      sets: exercise.sets,
      reps: exercise.reps,
      restTimeSeconds: exercise.restTimeSeconds,
      dayOfWeek: exercise.dayOfWeek,
    });
  };

  const cancelEdit = () => {
    setEditingExercise(null);
    setEditForm({ sets: "", reps: "", restTimeSeconds: "", dayOfWeek: "" });
  };

  const saveEdit = async (planExerciseId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/trainer/plan-exercise/${planExerciseId}`,
        editForm,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      toast.success("Exercise updated successfully!"); // ✅ toast
      setEditingExercise(null);
      fetchPlan(); // reload updated data
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update exercise."); // ✅ toast
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Plan</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Plan Found</h3>
          <p className="text-gray-600">The requested workout plan could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{plan.name}</h1>
                  <p className="text-indigo-100">Workout Plan Details</p>
                </div>
              </div>
              <Link
                to="/trainer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Plans</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Exercises ({(plan.exercises || []).length})</h2>
            </div>
          </div>

          <div className="p-6">
            {(plan.exercises || []).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No exercises in this plan yet.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {plan.exercises.map((ex, index) => (
                  <div
                    key={ex.planExerciseId}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {editingExercise === ex.planExerciseId ? (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Editing: {ex.name}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
                            <input
                              type="number"
                              min="1"
                              value={editForm.sets}
                              onChange={(e) => setEditForm({ ...editForm, sets: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
                            <input
                              type="number"
                              min="1"
                              value={editForm.reps}
                              onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rest Time (s)</label>
                            <input
                              type="number"
                              min="0"
                              value={editForm.restTimeSeconds}
                              onChange={(e) =>
                                setEditForm({ ...editForm, restTimeSeconds: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                            <select
                              value={editForm.dayOfWeek}
                              onChange={(e) =>
                                setEditForm({ ...editForm, dayOfWeek: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <button
                            onClick={() => saveEdit(ex.planExerciseId)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save Changes</span>
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{ex.name}</h4>
                            <p className="text-gray-600 text-sm mb-2">{ex.targetMuscles}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {ex.dayOfWeek}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-indigo-600">{ex.sets}</div>
                            <div className="text-sm text-gray-600">Sets</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-emerald-600">{ex.reps}</div>
                            <div className="text-sm text-gray-600">Reps</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center col-span-2 sm:col-span-1">
                            <div className="text-2xl font-bold text-amber-600">{ex.restTimeSeconds}s</div>
                            <div className="text-sm text-gray-600">Rest</div>
                          </div>
                        </div>

                        <button
                          onClick={() => startEdit(ex)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit Exercise</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Workout Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDetail;