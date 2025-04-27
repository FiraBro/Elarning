import React, { useEffect, useState } from "react";
import { courseService } from "../../service/api";
import VideoPlayer from "../videoPlayer/VideoPlayer ";
import Navbar from "../Navbar";
import styles from "./MyCourse.module.css";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const enrolledCourses = await courseService.getEnrolledCourses();
        setCourses(enrolledCourses);
      } catch (err) {
        setError(err.message || "Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) return <p>Loading your courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (courses.length === 0)
    return <p>You have not enrolled in any courses yet.</p>;

  return (
    <div className={styles.myCoursesContainer}>
      <Navbar />
      <h2>My Courses</h2>
      <ul className={styles.courseList}>
        {courses.map((course) => (
          <li key={course._id} className={styles.courseItem}>
            <h3>{course.title}</h3>
            <p>{course.shortDescription || course.description}</p>
            <p>
              <strong>Instructor:</strong> {course.instructor?.name || "N/A"}
            </p>
            {course.video ? (
              <div className={styles.videoWrapper}>
                <VideoPlayer
                  url={
                    course.video.startsWith("http")
                      ? course.video
                      : `http://localhost:5000/${course.video}`
                  }
                />
              </div>
            ) : (
              <p>No video available for this course.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyCourse;
