import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../../service/api";
import styles from "./CourseList.module.css";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS!
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [sort, setSort] = useState("createdAt");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = { page, limit, sort };
        if (search.trim() !== "") params.search = search.trim();

        const { data } = await courseService.getAllCourses(params);
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page, limit, sort, search]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }));
      await courseService.enrollInCourse(courseId);
      toast.success("Enrollment successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }); // Show success toast
      // alert("Enrollment successful!");
    } catch (error) {
      console.error("Enrollment failed:", error);
      toast.error(error.response?.data?.message || "Enrollment failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }); // Show error toast
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <section className={styles.featuredSection}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <motion.div
        className={styles.featureHead}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
      >
        <h1>All Courses We Offer</h1>
      </motion.div>

      <motion.div
        className={styles.controlsCombined}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          delay: 0.2,
        }}
        viewport={{ once: true }}
      >
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />

        <select
          value={sort}
          onChange={handleSortChange}
          className={styles.sortSelect}
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="title">Title A-Z</option>
          <option value="-title">Title Z-A</option>
        </select>
      </motion.div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <motion.div
            className={styles.courseGrid}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
            viewport={{ once: true }}
          >
            {courses.map(({ _id, title, description, banner, price }, i) => (
              <motion.div
                key={_id}
                className={styles.courseCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                viewport={{ once: true }}
              >
                <img
                  src={courseService.getBannerUrl(banner)}
                  alt={title}
                  className={styles.courseImage}
                  onError={(e) => (e.target.src = "/default-course.jpg")}
                />
                <div className={styles.courseContent}>
                  <h3 className={styles.courseTitle}>{title}</h3>
                  <p className={styles.courseDescription}>{description}</p>
                  <div className={styles.priceEnrollContainer}>
                    <span className={styles.coursePrice}>{price}$</span>
                    <button
                      onClick={() => handleEnroll(_id)}
                      className={styles.enrollButton}
                      disabled={enrolling[_id]}
                    >
                      {enrolling[_id] ? "Enrolling..." : "Enroll Now"}
                    </button>
                    {/* View Detail Button */}
                    <Link
                      to={`/courses/${_id}`}
                      className={styles.viewDetailButton}
                    >
                      View Detail
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.pagination}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            viewport={{ once: true }}
          >
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={styles.paginationButton}
            >
              <FiChevronLeft size={18} />
            </button>
            <span>Page {page}</span>
            <button
              onClick={handleNextPage}
              className={styles.paginationButton}
            >
              <FiChevronRight size={18} />
            </button>
          </motion.div>
        </>
      )}
    </section>
  );
}
