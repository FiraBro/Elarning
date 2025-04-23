import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/course">Course</NavLink>
    </div>
  );
}
