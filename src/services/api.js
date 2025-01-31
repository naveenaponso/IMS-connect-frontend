import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach Authorization token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default api;
