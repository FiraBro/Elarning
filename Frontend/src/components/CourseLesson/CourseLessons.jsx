import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import style from "./CourseLessons.module.css";
import { courseService } from "../../service/api";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const IMAGE_BASE_URL = import.meta.env.VITE_APP_STATIC_URL || "";

const CourseLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchCourseLessons();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchCourseLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await courseService.getCourseLessons(courseId);
      const courseData = data?.data?.course || data?.course;
      console.log(courseData.lessons[0].videoUrl);
      // console.log({Vide:currentLesson.videoUrl});

      setCourse(courseData);
      if (courseData?.lessons && courseData.lessons.length > 0) {
        setCurrentLesson(courseData.lessons[0]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("You are not enrolled in this course.");
        toast.error("You are not enrolled in this course.");
      } else {
        setError(err.message || "Failed to load course lessons.");
        toast.error(err.message || "Failed to load course lessons.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  if (loading) {
    return (
      <div className={style.loading} aria-live="polite">
        <Navbar />
        <p>Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.error} aria-live="assertive">
        <Navbar />
        <ToastContainer position="top-center" autoClose={3000} />
        <p>{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={style.error} aria-live="assertive">
        <Navbar />
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className={style.holeCorselessan}>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      <div className={style.courseLessons}>
        <div className={style.courseHeader}>
          <h1>{course.title}</h1>
          <p className={style.description}>{course.description}</p>
        </div>

        <div className={style.contentWrapper}>
          {/* Video Player (Left) */}
          <div className={style.videoSection}>
            {currentLesson ? (
              <>
                <h2 className={style.lessonTitle}>{currentLesson.title}</h2>
                {currentLesson.videoUrl ? (
                  <ReactPlayer
                    url={
                      currentLesson.videoUrl.startsWith("uploads")
                        ? `${IMAGE_BASE_URL}/${currentLesson.videoUrl}`
                        : currentLesson.videoUrl
                    }
                    controls
                    playing
                    muted // Allow auto-play
                    width="100%"
                    height="100%"
                    className={style.videoPlayer}
                    onError={() => toast.error("Failed to load video.")}
                  />
                ) : (
                  <p>No video available for this lesson.</p>
                )}
              </>
            ) : (
              <p>No lessons available.</p>
            )}
          </div>

          {/* Lesson List (Right) */}
          <div className={style.lessonList}>
            <h2>Course Content</h2>
            {!course.lessons || course.lessons.length === 0 ? (
              <p>No lessons available.</p>
            ) : (
              <ul className={style.lessonItems}>
                {course.lessons.map((lesson, idx) => (
                  <li
                    key={lesson._id || idx}
                    className={`${style.lessonItem} ${
                      currentLesson?._id === lesson._id ? style.active : ""
                    }`}
                    onClick={() => handleLessonSelect(lesson)}
                    tabIndex={0}
                    aria-current={
                      currentLesson?._id === lesson._id ? "true" : undefined
                    }
                  >
                    <span className={style.lessonNumber}>{idx + 1}.</span>
                    <span className={style.lessonTitle}>{lesson.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessons;
