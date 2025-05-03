import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // assuming you store role in localStorage

  if (!token) return <Navigate to="/login" replace />;

  return userRole === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
