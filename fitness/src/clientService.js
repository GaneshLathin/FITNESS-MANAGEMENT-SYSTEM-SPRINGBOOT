// src/clientService.js
import api from "./api";

const clientService = {
  getProfile: () => api.get("/client/my-profile"),
  updateProfile: (data) => api.put("/client/my-profile", data),
  getTrainer: () => api.get("/client/my-trainer"),
  getWorkoutPlan: () => api.get("/client/my-workout-plan"),
  getNotifications: () => api.get("/client/my-notifications"),
  markNotificationRead: (id) => api.put(`/client/notifications/${id}/read`),

  // ✅ NEW progress APIs
  logExercise: (data) => api.post("/client/progress/log", data),
  getExerciseHistory: (planExerciseId) =>
    api.get(`/client/progress/${planExerciseId}`),
  getAllProgress: () => api.get("/client/progress"),
};

export default clientService;
