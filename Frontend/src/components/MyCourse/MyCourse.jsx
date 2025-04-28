import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../service/api";
import Navbar from "../Navbar";
import styles from "./MyCourse.module.css";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const data = await courseService.getEnrolledCourses(); // Expect { status, data: { courses } }
        console.log("Enrolled courses:", data);
        setCourses(data || []);
      } catch (err) {
        setError(err.message || "Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleViewLessons = (courseId) => {
    navigate(`/courses/${courseId}/lessons`);
  };

  if (loading) return <p className={styles.loading}>Loading your courses...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (courses.length === 0)
    return (
      <p className={styles.noCourses}>
        You have not enrolled in any courses yet.
      </p>
    );

  return (
    <div className={styles.myCoursesContainer}>
      <Navbar />
      <h2>My Courses</h2>
      <ul className={styles.courseList}>
        {courses.map((course) => (
          <li key={course._id} className={styles.courseItem}>
            {course.banner && (
              <img
                // src={`/uploads/banners/${course.banner}`}
                src={`http://localhost:5000/uploads/banners/${course.banner}`}

                alt={`${course.title} banner`}
                className={styles.banner}
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
            >
              View Lessons
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyCourse;
