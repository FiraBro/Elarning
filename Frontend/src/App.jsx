import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Layouts & Guards
import PrivateRoute from "./components/PrivetRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./iu/AdminLayout";
import MainLayout from "./iu/MainLayout";
// Professional Loading Component
const PageLoader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
  </div>
);

// Lazy Loading Pages (Improves Initial Load Speed)
const HomePage = lazy(() => import("./pages/HomePage"));
const MycoursePage = lazy(() => import("./pages/MycoursePage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SingupPage = lazy(() => import("./pages/SingupPage"));
const Profile = lazy(() => import("./components/Profile/Profile"));
const AdminDashboard = lazy(
  () => import("./components/AdminDashboard/AdminDashboard"),
);
const CourseController = lazy(
  () => import("./components/CourseController/CourseController"),
);
const UserControl = lazy(
  () => import("./components/UserController/UserController"),
);
const ForgotPasswordPage = lazy(
  () => import("./components/ForgotPassword/ForgotPasswordPage "),
);
const ResetPasswordPage = lazy(
  () => import("./components/ForgotPassword/ResetPasswordPage"),
);
const CourseLessons = lazy(
  () => import("./components/CourseLesson/CourseLessons"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Wrap everything in a MainLayout (Navbar/Footer)
    children: [
      // --- Public Routes ---
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SingupPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password/:token", element: <ResetPasswordPage /> },

      // --- Protected Student/User Routes ---
      {
        element: <PrivateRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "mycourse", element: <MycoursePage /> },
          { path: "courses/:id", element: <CourseDetailPage /> },
          { path: "courses/:courseId/lessons", element: <CourseLessons /> },
        ],
      },

      // --- Admin Specific Routes ---
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "courses", element: <CourseController /> },
              { path: "users", element: <UserControl /> },
            ],
          },
        ],
      },
    ],
  },
  // --- Global 404 ---
  { path: "*", element: <div className="error-404">404 - Page Not Found</div> },
]);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
