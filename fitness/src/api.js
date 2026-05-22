// src/api.js
import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // adjust if your backend runs on another port
});

// ✅ Add JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      const parsed = JSON.parse(storedToken);
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
