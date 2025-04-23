// import React from "react";
// import { Routes, Route } from "react-router-dom"; // <-- Import Routes and Route

// export default function App() {
//   return (
//     <div className="app">
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/mycourses" element={<MycoursePage />} />
//         <Route path="/instructor/*" element={<InstructorPage />} />
//         <Route path="*" element={<InstructorRoutes />} />
//       </Routes>
//     </div>
//   );
// }

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Applayout from "./iu/Applayout";
import HomePage from "./pages/HomePage";
import MycoursePage from "./pages/MycoursePage";
import Dashboard from "./components/Dashboard";
import Courses from "./components/Courses";
import InstructorPage from "./pages/InstructorPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "mycourse",
      element: <MycoursePage />,
    },
    {
      path:'/instructor',
      element:<InstructorPage />
    },
    {
      element: <Applayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/course",
          element: <Courses />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
