// components/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { courseService, userService } from "../../service/api";
import styles from "./AdminDashboard.module.css";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metrics, users, courses] = await Promise.all([
          courseService.getMetrics(),
          userService.getAllUsers(),
          courseService.getAllCourses({ limit: 5, sort: "-createdAt" }),
        ]);

        setStats({
          users: users.length,
          courses: metrics.totalCourses,
          enrollments: metrics.totalStudents,
          revenue: metrics.totalRevenue,
        });

        setRecentCourses(courses.data.courses);
        setRecentUsers(users.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
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
  <div className={styles.statCard}>
    <div className={styles.statIcon}>{icon}</div>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const RecentCourses = ({ courses }) => (
  <div className={styles.section}>
    <h2>Recent Courses</h2>
    <ul className={styles.list}>
      {courses.map((course) => (
        <li key={course._id}>
          <span>{course.title}</span>
          <span>{new Date(course.createdAt).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  </div>
);

const RecentUsers = ({ users }) => (
  <div className={styles.section}>
    <h2>Recent Users</h2>
    <ul className={styles.list}>
      {users.map((user) => (
        <li key={user._id}>
          <span>{user.name}</span>
          <span>{user.role}</span>
        </li>
      ))}
    </ul>
  </div>
);
