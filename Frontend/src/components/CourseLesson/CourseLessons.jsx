import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import style from "./CourseLessons.module.css";
import { courseService } from "../../service/api";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import { FiChevronLeft, FiPlay, FiCheckCircle, FiLock } from "react-icons/fi";

const IMAGE_BASE_URL = import.meta.env.VITE_APP_STATIC_URL || "";

const CourseLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseLessons();
  }, [courseId]);

  const fetchCourseLessons = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getCourseLessons(courseId);
      const courseData = data?.data?.course || data?.course;
      setCourse(courseData);
      if (courseData?.lessons?.length > 0) {
        setCurrentLesson(courseData.lessons[0]);
      }
    } catch (err) {
      toast.error("Failed to load content");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className={style.shimmerWrapper}>
        <Navbar />
      </div>
    );

  return (
    <div className={style.pageWrapper}>
      <Navbar />
      <ToastContainer theme="dark" />

      {/* Top Navigation Bar */}
      <div className={style.topBar}>
        <button onClick={() => navigate(-1)} className={style.backBtn}>
          <FiChevronLeft /> Back to Course
        </button>
        <div className={style.courseProgressInfo}>
          <span>{course?.title}</span>
          <div className={style.miniProgress}>
            <div className={style.miniFill} style={{ width: "20%" }}></div>
          </div>
        </div>
      </div>

      <div className={style.theaterLayout}>
        {/* Main Video Section */}
        <section className={style.playerContainer}>
          <div className={style.videoWrapper}>
            <ReactPlayer
              url={
                currentLesson?.videoUrl?.startsWith("uploads")
                  ? `${IMAGE_BASE_URL}/${currentLesson.videoUrl}`
                  : currentLesson?.videoUrl
              }
              controls
              width="100%"
              height="100%"
              playing
              className={style.reactPlayer}
              config={{ file: { attributes: { controlsList: "nodownload" } } }}
            />
          </div>

          <div className={style.lessonDescriptionSection}>
            <div className={style.titleRow}>
              <h2>{currentLesson?.title}</h2>
              <button className={style.completeBtn}>Mark as Complete</button>
            </div>
            <p>{course?.description}</p>
          </div>
        </section>

        {/* Curriculum Sidebar */}
        <aside className={style.sidebar}>
          <div className={style.sidebarHeader}>
            <h3>Course Content</h3>
            <span>{course?.lessons?.length} Lessons</span>
          </div>

          <div className={style.curriculumList}>
            {course?.lessons.map((lesson, idx) => (
              <div
                key={lesson._id}
                className={`${style.lessonCard} ${
                  currentLesson?._id === lesson._id ? style.activeCard : ""
                }`}
                onClick={() => setCurrentLesson(lesson)}
              >
                <div className={style.lessonStatus}>
                  {currentLesson?._id === lesson._id ? (
                    <FiPlay className={style.playIcon} />
                  ) : (
                    <FiCheckCircle className={style.checkIcon} />
                  )}
                </div>
                <div className={style.lessonInfo}>
                  <span className={style.lessonIndex}>Lesson {idx + 1}</span>
                  <p className={style.lessonName}>{lesson.title}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseLessons;
