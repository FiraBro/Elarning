import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../service/api";
import Navbar from "../Navbar/Navbar";
import styles from "./MyCourse.module.css";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // For cleanup

    const fetchEnrolledCourses = async () => {
      try {
        const response = await courseService.getEnrolledCourses();
        if (isMounted) {
          setCourses(response?.data?.courses || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load enrolled courses"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEnrolledCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewLessons = (courseId) => {
    navigate(`/courses/${courseId}/lessons`);
  };

  if (loading) return <p className={styles.loading}>Loading your courses...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!courses.length)
    return (
      <div className={styles.holeMyCourse}>
        <Navbar />
        <div className={styles.myCoursesContainer}>
          <h2>My Courses</h2>
          <p className={styles.noCourses}>
            You have not enrolled in any courses yet.
          </p>
        </div>
      </div>
    );

  return (
    <div className={styles.holeMyCourse}>
      <Navbar />
      <div className={styles.myCoursesContainer}>
        <h2>My Courses</h2>
        <ul className={styles.courseList}>
          {courses.map((course) => (
            <li key={course._id} className={styles.courseItem}>
              {course.banner && (
                <img
                  src={courseService.getBannerUrl(course.banner)}
                  alt={`Banner for ${course.title}`}
                  className={styles.courseImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-course.jpg";
                  }}
                />
              )}
              <h3>{course.title}</h3>
              <p>{course.shortDescription || course.description}</p>
              <p>
                <strong>Instructor:</strong> {course.instructor?.name || "N/A"}
              </p>
              <p>
                <strong>Lessons:</strong> {course.lessons?.length || 0}
              </p>
              <button
                className={styles.viewLessonsBtn}
                onClick={() => handleViewLessons(course._id)}
                aria-label={`View lessons for ${course.title}`}
              >
                View Lessons
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyCourse;
