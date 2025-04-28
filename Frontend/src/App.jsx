import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MycoursePage from "./pages/MycoursePage";
import Dashboard from "./components/Dashboard";
import CourseController from "./components/CourseController";
import InstructorPage from "./pages/InstructorPage";
import SingupPage from "./pages/SingupPage";
import LoginPage from "./pages/LoginPage";
import Profile from "./components/Profile";
import AdminLayout from "./iu/AdminLayout";
import UserControl from "./components/UserController";
import CourseLessons from "./components/CourseLesson/CourseLessons";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "signup",
      element: <SingupPage />,
    },
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "mycourse",
      element: <MycoursePage />,
    },
    {
      path: "courses/:courseId/lessons",
      element: <CourseLessons />, // Add CourseLessons route
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "/instructor",
      element: <InstructorPage />,
    },
    {
      element: <AdminLayout />,
      children: [
        {
          path: "admin/dashboard",
          element: <Dashboard />,
        },
        {
          path: "admin/courses",
          element: <CourseController />,
        },
        {
          path: "admin/users",
          element: <UserControl />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
