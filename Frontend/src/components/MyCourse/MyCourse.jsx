import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../service/api";
import Navbar from "../Navbar/Navbar";
import styles from "./MyCourse.module.css";
import { motion } from "framer-motion"; // For that premium feel
import { FiPlayCircle, FiBookOpen, FiUser } from "react-icons/fi";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchEnrolledCourses = async () => {
      try {
        const response = await courseService.getEnrolledCourses();
        if (isMounted) setCourses(response || []);
      } catch (err) {
        if (isMounted)
          setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEnrolledCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
      </div>
    );

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1>My Learning Dashboard</h1>
            <p>Welcome back! Pick up where you left off.</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{courses.length}</span>
              <span className={styles.statLabel}>Enrolled</span>
            </div>
          </div>
        </header>

        {!courses.length ? (
          <div className={styles.emptyState}>
            <img src="/empty-courses.svg" alt="No courses" />
            <p>Your library is empty. Start your journey today!</p>
            <button
              onClick={() => navigate("/courses")}
              className={styles.browseBtn}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className={styles.courseGrid}>
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                className={styles.courseCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={courseService.getBannerUrl(course.banner)}
                    alt={course.title}
                    className={styles.courseImage}
                    onError={(e) => (e.target.src = "/default-course.jpg")}
                  />
                  <div className={styles.overlay}>
                    <button
                      onClick={() => navigate(`/courses/${course._id}/lessons`)}
                    >
                      <FiPlayCircle size={40} />
                    </button>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.categoryBadge}>Programming</div>{" "}
                  {/* Replace with real category if available */}
                  <h3 className={styles.title}>{course.title}</h3>
                  <div className={styles.meta}>
                    <span className={styles.metaItem}>
                      <FiUser /> {course.instructor?.name || "Expert"}
                    </span>
                    <span className={styles.metaItem}>
                      <FiBookOpen /> {course.lessons?.length || 0} Lessons
                    </span>
                  </div>
                  {/* Progress Bar - Essential for Professional Look */}
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <span className={styles.progressText}>45% Complete</span>
                  </div>
                  <button
                    className={styles.continueBtn}
                    onClick={() => navigate(`/courses/${course._id}/lessons`)}
                  >
                    Continue Learning
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourse;
