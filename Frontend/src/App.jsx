import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import MycoursePage from "./pages/MycoursePage";
import CourseController from "./components/CourseController/CourseController";
import InstructorPage from "./pages/InstructorPage";
import SingupPage from "./pages/SingupPage";
import LoginPage from "./pages/LoginPage";
import Profile from "./components/Profile/Profile";
import UserControl from "./components/UserController/UserController";
import CourseLessons from "./components/CourseLesson/CourseLessons";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import CourseDetailPage from "./pages/CourseDetailPage";

import PrivateRoute from "./components/PrivetRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./iu/AdminLayout";

export default function App() {
  const router = createBrowserRouter([
    // Public routes
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

    // Routes requiring authentication
    {
      element: <PrivateRoute />, // Protect all children routes
      children: [
        {
          path: "mycourse",
          element: <MycoursePage />,
        },
        {
          path: "courses/:courseId/lessons",
          element: <CourseLessons />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "courses/:id",
          element: <CourseDetailPage />,
        },
        {
          path: "instructor",
          element: <InstructorPage />,
        },

        // Admin-only routes wrapped in AdminRoute and AdminLayout
        {
          element: <AdminRoute />, // Admin guard
          children: [
            {
              element: <AdminLayout />, // Admin layout with sidebar
              children: [
                {
                  path: "admin/dashboard",
                  element: <AdminDashboard />,
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
          ],
        },
      ],
    },

    // Fallback route (optional)
    {
      path: "*",
      element: <div>404 Not Found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}
