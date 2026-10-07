import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://firstgeneration.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
