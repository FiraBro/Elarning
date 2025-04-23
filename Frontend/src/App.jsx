import React from "react";
import { Routes, Route } from "react-router-dom";  // <-- Import Routes and Route

import HomePage from "./pages/HomePage";
import MycoursePage from "./pages/MycoursePage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mycourses" element={<MycoursePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
