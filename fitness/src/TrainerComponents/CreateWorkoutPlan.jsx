import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const CreateWorkoutPlan = () => {
  const { auth } = useAuth();
  const [planName, setPlanName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/trainer/exercises", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => setExercises(res.data))
      .catch((err) => console.error("Error loading exercises:", err));
  }, []);

  const handleAddExercise = () => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: "",
        sets: 3,
        reps: 10,
        restTimeSeconds: 60,
        dayOfWeek: "Monday",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index][field] = field === "exerciseId" ? Number(value) : value;
    setSelectedExercises(updated);
  };

  const handleRemoveExercise = (index) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/trainer/workout-plans",
        {
          name: planName,
          exercises: selectedExercises,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      alert("Workout plan created successfully!");
      setPlanName("");
      setSelectedExercises([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create workout plan.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Create Workout Plan</h1>
                <p className="text-blue-100">Design a custom workout plan for your clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Plan Name */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Workout Plan Name
            </label>
            <input
              type="text"
              placeholder="Enter workout plan name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
            />
          </div>

          {/* Exercises */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Exercises</h3>
              <button
                type="button"
                onClick={handleAddExercise}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Exercise</span>
              </button>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-500">No exercises added yet. Click "Add Exercise" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-medium text-gray-800">Exercise {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Exercise Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Type</label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={ex.exerciseId}
                          onChange={(e) => handleChange(idx, "exerciseId", e.target.value)}
                          required
                        >
                          <option value="">Select Exercise</option>
                          {exercises.map((exItem) => (
                            <option key={exItem.id} value={exItem.id}>
                              {exItem.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Exercise Parameters Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Sets"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={ex.sets}
                            onChange={(e) => handleChange(idx, "sets", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Reps"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={ex.reps}
                            onChange={(e) => handleChange(idx, "reps", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rest (seconds)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Rest time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={ex.restTimeSeconds}
                            onChange={(e) =>
                              handleChange(idx, "restTimeSeconds", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={ex.dayOfWeek}
                            onChange={(e) => handleChange(idx, "dayOfWeek", e.target.value)}
                          >
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setPlanName("");
                setSelectedExercises([]);
              }}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!planName || selectedExercises.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Create Workout Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutPlan;