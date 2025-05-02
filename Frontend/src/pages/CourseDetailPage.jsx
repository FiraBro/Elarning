import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { courseService } from "../service/api"; // Adjust path as needed
import styles from "./CourseDetailPage.module.css"; // Your CSS module

function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    courseService
      .getCourseById(id)
      .then((res) => {
        setCourse(res.data.course);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load course");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className={styles.loading}>Loading course details...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{course.title}</h1>
      <p className={styles.description}>{course.description}</p>

      <h3 className={styles.sectionTitle}>Benefits:</h3>
      <ul className={styles.benefitsList}>
        {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
          course.learningOutcomes.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))
        ) : (
          <li>No benefits listed</li>
        )}
      </ul>

      <p className={styles.lessonCount}>
        Total Lessons: {course.lessons.length}
      </p>

      <p className={styles.instructor}>
        Instructor: {course.instructor?.name || "Unknown"}
      </p>
    </div>
  );
}

export default CourseDetailPage;
