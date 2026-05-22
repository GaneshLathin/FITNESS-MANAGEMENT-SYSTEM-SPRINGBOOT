// ExerciseForm.jsx
import React, { useState, useEffect } from "react";
import { Dumbbell, Save, ClipboardList, Plus, Edit3, Target, Film, Upload } from "lucide-react";
import axios from "axios";
import ExercisesTable from "./ExercisesTable";

const ExerciseForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    targetMuscles: "",
    mediaUrl: "",
  });
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [message, setMessage] = useState("");
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Get token from localStorage
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

  const fetchExercises = async () => {
    try {
      const res = await api.get("/exercises");
      setExercises(res.data);
    } catch {
      setMessage("❌ Error fetching exercises");
    }
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingMedia(true);
    setMessage("");
    try {
      const res = await api.post("/exercises/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.url) {
        setForm((prev) => ({ ...prev, mediaUrl: res.data.url }));
        setMessage("✅ Media uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload media");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSaveExercise = async (exercise) => {
    if (!exercise.name || !exercise.description || !exercise.targetMuscles) {
      setMessage("❌ Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (selectedExercise) {
        res = await api.put(`/exercises/${selectedExercise.id}`, exercise);
      } else {
        res = await api.post("/exercises", exercise);
      }

      if (res.status >= 200 && res.status < 300) {
        setMessage(
          selectedExercise
            ? "✅ Exercise updated successfully!"
            : "✅ Exercise created successfully!"
        );
        setForm({ name: "", description: "", targetMuscles: "", mediaUrl: "" });
        setSelectedExercise(null);
        fetchExercises();
      } else {
        setMessage("❌ Failed to save exercise");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("❌ Error saving exercise");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = async (id) => {
    try {
      await api.delete(`/exercises/${id}`);
      setMessage("✅ Exercise deleted successfully!");
      fetchExercises();
    } catch {
      setMessage("❌ Error deleting exercise");
    }
  };

  const handleCancelEdit = () => {
    setSelectedExercise(null);
    setForm({ name: "", description: "", targetMuscles: "", mediaUrl: "" });
    setMessage("");
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      setForm(selectedExercise);
    }
  }, [selectedExercise]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Exercise Management
          </h1>
          <p className="text-gray-600 text-lg">
            {selectedExercise ? "Update existing exercise" : "Create and manage your exercise database"}
          </p>
        </div>

        {/* Alert Message */}
        {message && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-xl text-sm flex items-center space-x-2 ${
            message.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.includes("✅") ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message.replace(/✅|❌/g, "")}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20 mb-10">
          {/* Form Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {selectedExercise ? (
                <Edit3 className="w-6 h-6 text-orange-600" />
              ) : (
                <Plus className="w-6 h-6 text-purple-600" />
              )}
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedExercise ? "Edit Exercise" : "New Exercise"}
              </h2>
            </div>
            {selectedExercise && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Exercise Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block flex items-center space-x-2">
                <Dumbbell className="w-4 h-4 text-purple-600" />
                <span>Exercise Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Push-ups, Squats, Deadlifts"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block flex items-center space-x-2">
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <span>Description</span>
              </label>
              <textarea
                placeholder="Detailed description of how to perform this exercise..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                rows="4"
                required
              />
            </div>

            {/* Target Muscles */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <span>Target Muscles</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Chest, Shoulders, Triceps"
                value={form.targetMuscles}
                onChange={(e) => setForm({ ...form, targetMuscles: e.target.value })}
                className="w-full px-4 py-3.5 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block flex items-center space-x-2">
                <Film className="w-4 h-4 text-pink-600" />
                <span>Instructional Media (Video/Image)</span>
              </label>
              
              <div className="flex flex-col space-y-4">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  disabled={uploadingMedia}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-pink-50 file:text-pink-700
                    hover:file:bg-pink-100 transition-colors"
                />
                {uploadingMedia && (
                  <p className="text-sm text-blue-600 animate-pulse flex items-center">
                    <Upload className="w-4 h-4 mr-2 animate-bounce" /> Uploading to S3...
                  </p>
                )}
                {form.mediaUrl && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-green-600 mb-2 font-medium">Uploaded Successfully:</p>
                    {form.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video src={form.mediaUrl} controls className="max-h-48 rounded shadow-sm" />
                    ) : (
                      <img src={form.mediaUrl} alt="Exercise preview" className="max-h-48 rounded shadow-sm object-contain" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleSaveExercise(form)}
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none ${
                selectedExercise
                  ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500"
              } text-white`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{selectedExercise ? "Update Exercise" : "Create Exercise"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Exercises Table */}
        <ExercisesTable
          exercises={exercises}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          onEdit={setSelectedExercise}
          onDelete={handleDeleteExercise}
        />
      </div>
    </div>
  );
};

export default ExerciseForm;