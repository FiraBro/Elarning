import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import style from "./CourseLessons.module.css";
import { courseService } from "../../service/api";
import Navbar from "../Navbar/Navbar";

const CourseLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseLessons();
  }, [courseId]);

  const fetchCourseLessons = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getCourseLessons(courseId);
      console.log("API Response:", data.data.course);
      console.log("Lessons:", data.data.course.lessons);
      setCourse(data.data.course);
      if (data.data.course.lessons && data.data.course.lessons.length > 0) {
        setCurrentLesson(data.data.course.lessons[0]);
        console.log(
          "First Lesson videoUrl:",
          data.data.course.lessons[0].videoUrl
        );
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("You are not enrolled in this course.");
      } else {
        setError(err.message || "Failed to load course lessons.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  if (loading) {
    return <div className={style.loading}>Loading course...</div>;
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  if (!course) {
    return <div className={style.error}>Course not found.</div>;
  }

  return (
    <div className={style.holeCorselessan}>
      <Navbar />
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
                  <>
                    {console.log("Raw videoUrl:", currentLesson.videoUrl)}
                    <ReactPlayer
                      url={
                        currentLesson.videoUrl.startsWith("uploads")
                          ? `http://localhost:5000/${currentLesson.videoUrl}`
                          : currentLesson.videoUrl
                      }
                      controls
                      playing
                      muted // Allow auto-play
                      width="100%"
                      height="100%"
                      className={style.videoPlayer}
                      onError={(e) => console.error("ReactPlayer Error:", e)}
                      onReady={() => console.log("Player Ready")}
                    />
                  </>
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
            {course.lessons.length === 0 ? (
              <p>No lessons available.</p>
            ) : (
              <ul className={style.lessonItems}>
                {course.lessons.map((lesson) => (
                  <li
                    key={lesson._id}
                    className={`${style.lessonItem} ${
                      currentLesson?._id === lesson._id ? style.active : ""
                    }`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <span className={style.lessonNumber}>
                      {course.lessons.indexOf(lesson) + 1}.
                    </span>
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
