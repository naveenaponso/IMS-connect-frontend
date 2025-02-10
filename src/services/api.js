import axios from "axios";

// // Development
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
});


// // Production
// const api = axios.create({
//     baseURL: "https://ims-connect-backend-h5qm.onrender.com/api", // Use Render backend URL
//     headers: { "Content-Type": "application/json" }
// });

// Attach Authorization token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});



// Get available collaborators (users not in active collaboration)
// export const getAvailableCollaborators = () => {
//     return api.get("/collaborations/available-collaborators");
// };

export default api;
