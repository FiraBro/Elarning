import { useState, useEffect } from "react";
import { courseService, userService } from "../../service/api";
import styles from "./AdminDashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    revenue: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [metrics, users, courses] = await Promise.all([
          courseService.getMetrics(),
          userService.getAllUsers({ limit: 5 }), // Adjust API to support limit
          courseService.getAllCourses({ limit: 5, sort: "-createdAt" }),
        ]);

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          courses: metrics?.totalCourses ?? 0,
          enrollments: metrics?.totalStudents ?? 0,
          revenue: metrics?.totalRevenue ?? 0,
        });

        setRecentCourses(courses?.data?.courses ?? []);
        setRecentUsers(Array.isArray(users) ? users.slice(0, 5) : []);
      } catch (err) {
        setError("Failed to load dashboard data.");
        toast.error("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.dashboard}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p aria-live="polite">Loading data...</p>
      ) : error ? (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <StatCard title="Total Users" value={stats.users} icon="👥" />
            <StatCard title="Courses" value={stats.courses} icon="📚" />
            <StatCard title="Enrollments" value={stats.enrollments} icon="🎓" />
            <StatCard title="Revenue" value={`$${stats.revenue}`} icon="💰" />
          </div>

          <div className={styles.sections}>
            <RecentCourses courses={recentCourses} />
            <RecentUsers users={recentUsers} />
          </div>
        </>
      )}
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className={styles.statCard} role="region" aria-label={title}>
    <div className={styles.statIcon} aria-hidden="true">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const RecentCourses = ({ courses }) => (
  <section className={styles.section} aria-label="Recent Courses">
    <h2>Recent Courses</h2>
    <ul className={styles.list}>
      {courses.length === 0 ? (
        <li>No recent courses found.</li>
      ) : (
        courses.map((course) => (
          <li key={course._id}>
            <span>{course.title}</span>
            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
          </li>
        ))
      )}
    </ul>
  </section>
);

const RecentUsers = ({ users }) => (
  <section className={styles.section} aria-label="Recent Users">
    <h2>Recent Users</h2>
    <ul className={styles.list}>
      {users.length === 0 ? (
        <li>No recent users found.</li>
      ) : (
        users.map((user) => (
          <li key={user._id}>
            <span>{user.name}</span>
            <span>{user.role}</span>
          </li>
        ))
      )}
    </ul>
  </section>
);
