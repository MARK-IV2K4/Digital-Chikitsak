// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // change to backend URL
});

// attach token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status}`, response.data);
        return response;
    },
    (error) => {
        console.error(`API Error: ${error.response?.status}`, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
