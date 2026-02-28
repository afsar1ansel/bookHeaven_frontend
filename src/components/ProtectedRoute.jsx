import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is true and role is not admin, redirect to home
  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
