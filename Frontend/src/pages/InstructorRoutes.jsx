import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Courses from '../components/Courses';

export function InstructorRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="courses" element={<Courses />} />
      <Route index element={<Dashboard />} /> {/* Default route */}
    </Routes>
  );
}