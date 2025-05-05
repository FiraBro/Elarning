import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { courseService } from "../service/api"; // Adjust path as needed
import styles from "./CourseDetailPage.module.css";

// Simple Spinner component
function Spinner() {
  return (
    <div role="status" aria-live="polite" className={styles.spinner}>
      <svg
        className={styles.spinnerIcon}
        viewBox="0 0 50 50"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          className={styles.path}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryButtonRef = useRef(null);

  const fetchCourse = useCallback(() => {
    setLoading(true);
    setError(null);

    let isMounted = true;

    courseService
      .getCourseById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res?.data?.course) {
          setCourse(res.data.course);
        } else {
          setError("Course data is unavailable.");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load course");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const cleanup = fetchCourse();
    return cleanup;
  }, [fetchCourse]);

  // Focus retry button on error for accessibility
  useEffect(() => {
    if (error && retryButtonRef.current) {
      retryButtonRef.current.focus();
    }
  }, [error]);

  if (loading) {
    return (
      <main className={styles.container} aria-busy="true" aria-live="polite">
        <Spinner />
        <p>Loading course details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container} role="alert" aria-live="assertive">
        <p className={styles.error}>Error: {error}</p>
        <button
          ref={retryButtonRef}
          onClick={fetchCourse}
          className={styles.retryButton}
          aria-label="Retry loading course details"
        >
          Retry
        </button>
        <p>
          Or go back to{" "}
          <Link to="/courses" className={styles.link}>
            courses list
          </Link>
          .
        </p>
      </main>
    );
  }

  if (!course) {
    return (
      <main className={styles.container} role="alert">
        <p className={styles.error}>Course not found.</p>
        <p>
          Go back to{" "}
          <Link to="/courses" className={styles.link}>
            courses list
          </Link>
          .
        </p>
      </main>
    );
  }

  const {
    title = "Untitled Course",
    description = "No description available.",
    learningOutcomes = [],
    lessons = [],
    instructor = {},
  } = course;

  return (
    <main className={styles.container}>
      <h1 tabIndex={-1} className={styles.title}>
        {title}
      </h1>
      <p className={styles.description}>{description}</p>

      <section aria-labelledby="benefits-heading">
        <h3 id="benefits-heading" className={styles.sectionTitle}>
          Benefits:
        </h3>
        <ul className={styles.benefitsList}>
          {learningOutcomes.length > 0 ? (
            learningOutcomes.map((benefit, idx) => <li key={idx}>{benefit}</li>)
          ) : (
            <li>No benefits listed</li>
          )}
        </ul>
      </section>

      <p className={styles.lessonCount}>Total Lessons: {lessons.length}</p>

      <p className={styles.instructor}>
        Instructor: {instructor.name || "Unknown"}
      </p>
    </main>
  );
}

export default CourseDetailPage;
