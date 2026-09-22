import axios from "axios";
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // If user explicitly configured a local backend URL in .env (e.g. http://localhost:5000), use that;
    // otherwise use the Vite proxy path "/api" which forwards to the backend cleanly.
    if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes("onrender.com")) {
      const url = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
      return url.endsWith("/api") ? url : `${url}/api`;
    }
    return "/api";
  }

  // Production build on Netlify / hosting
  const prodUrl = import.meta.env.VITE_API_URL || "https://ai-expenses-tracker.onrender.com";
  const clean = prodUrl.replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;