// src/services/auth.js
import api from "./api";

export async function login({ phone, pin }) {
    const res = await api.post("/login", { phone, pin });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
}

export async function register(payload) {
    try {
        console.log("Sending registration request:", payload);
        const res = await api.post("/register", payload);
        console.log("Registration response:", res.data);
        
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    } catch (error) {
        console.error("Registration API error:", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
}

export async function addFamilyMember(payload) {
    const token = localStorage.getItem("token");
    const res = await api.post("/family/add", payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}
export async function getPatientsForAccount() {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
        const res = await api.get("/patients", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data; // should return an array of patient/family member objects
    } catch (err) {
        console.error("Failed to fetch patients", err);
        return [];
    }
}