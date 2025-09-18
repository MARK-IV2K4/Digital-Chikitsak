// src/router.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApiTest from "./components/ApiTest";

import PatientDashboard from "./pages/patient/Dashboard";
import PatientSymptom from "./pages/patient/SymptomChecker";
import SymptomAnalysis from "./pages/patient/SymptomAnalysis";
import BookDoctor from "./pages/patient/BookDoctor";
import PatientConsultation from "./pages/patient/Consultation";
import Pharmacy from "./pages/patient/Pharmacy";
import FamilyMembers from "./pages/patient/FamilyMembers";
import PatientTokens from "./pages/patient/Tokens";

import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorConsultation from "./pages/doctor/Consultation";
import DoctorTokens from "./pages/doctor/Tokens";

import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/api-test", element: <ApiTest /> },

  {
    path: "/patient",
    element: (
      <ProtectedRoute role="patient">
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/patient/symptom-checker", element: <PatientSymptom /> },
  { path: "/patient/symptom-analysis", element: <SymptomAnalysis /> },
  { path: "/patient/book-doctor", element: <BookDoctor /> },
  { path: "/patient/consultation", element: <PatientConsultation /> },
  { path: "/patient/pharmacy", element: <Pharmacy /> },
  { path: "/patient/family", element: <FamilyMembers /> },
  { path: "/patient/tokens", element: <PatientTokens /> },

  {
    path: "/doctor",
    element: (
      <ProtectedRoute role="doctor">
        <DoctorDashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/doctor/consultation/:id", element: <DoctorConsultation /> },
  { path: "/doctor/tokens", element: <DoctorTokens /> },

  { path: "*", element: <div className="p-6">Page not found</div> },
]);

export default router;
