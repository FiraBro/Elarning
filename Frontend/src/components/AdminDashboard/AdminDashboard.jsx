import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metrics, users, courses] = await Promise.all([
          courseService.getMetrics(),
          userService.getAllUsers(),
          courseService.getAllCourses({ limit: 5 }),
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
        toast.error("Systems Check: Failed to sync dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.spinner} size={40} />
        <p>Building your overview...</p>
      </div>
    );

  return (
    <div className={styles.dashboard}>
      <ToastContainer theme="colored" />

      <header className={styles.header}>
        <div>
          <h1>Insights Overview</h1>
          <p>
            Welcome back, Admin. Here is what's happening with your platform
            today.
          </p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={stats.users.toLocaleString()}
          icon={<Users />}
          color="#3b82f6"
        />
        <StatCard
          title="Active Courses"
          value={stats.courses}
          icon={<BookOpen />}
          color="#10b981"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.enrollments.toLocaleString()}
          icon={<GraduationCap />}
          color="#8b5cf6"
        />
        <StatCard
          title="Gross Revenue"
          value={formatCurrency(stats.revenue)}
          icon={<DollarSign />}
          color="#f59e0b"
        />
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.tableSection}>
          <div className={styles.sectionHead}>
            <h2>
              <Clock size={18} /> Recently Published
            </h2>
            <button className={styles.viewAll}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.listCard}>
            {recentCourses.map((course) => (
              <div key={course._id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{course.title}</span>
                  <span className={styles.itemSubtitle}>
                    {course.category || "General"}
                  </span>
                </div>
                <span className={styles.itemDate}>
                  {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.tableSection}>
          <div className={styles.sectionHead}>
            <h2>
              <Users size={18} /> New Registrations
            </h2>
            <button className={styles.viewAll}>
              Manage Users <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.listCard}>
            {recentUsers.map((user) => (
              <div key={user._id} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{user.name}</span>
                  <span className={styles.itemSubtitle}>{user.email}</span>
                </div>
                <span
                  className={`${styles.roleBadge} ${styles[user.role?.toLowerCase()]}`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div className={styles.statCard}>
    <div
      className={styles.statIcon}
      style={{ color: color, backgroundColor: `${color}15` }}
    >
      {icon}
    </div>
    <div className={styles.statText}>
      <span className={styles.statTitle}>{title}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  </div>
);
