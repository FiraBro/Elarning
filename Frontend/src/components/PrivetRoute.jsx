import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // or use your auth context/state

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
