import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../../service/api";
import styles from "./CourseList.module.css";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit, sort };
      if (debouncedSearch !== "") params.search = debouncedSearch;

      const { data } = await courseService.getAllCourses(params);
      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError("Failed to load courses. Please try again.");
      toast.error("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, debouncedSearch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }));
      await courseService.enrollInCourse(courseId);
      toast.success("Enrollment successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <section
      className={styles.featuredSection}
      aria-live="polite"
      aria-busy={loading}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <motion.div
        className={styles.featureHead}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        <h1>All Courses We Offer</h1>
      </motion.div>

      <motion.div
        className={styles.controlsCombined}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
          aria-label="Search courses"
        />

        <select
          value={sort}
          onChange={handleSortChange}
          className={styles.sortSelect}
          aria-label="Sort courses"
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
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <>
          <motion.div
            className={styles.courseGrid}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            {courses.map(({ _id, title, description, banner, price }, i) => (
              <motion.div
                key={_id}
                className={styles.courseCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut", delay: i * 0.2 }}
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
                      aria-label={`Enroll in ${title}`}
                    >
                      {enrolling[_id] ? "Enrolling..." : "Enroll Now"}
                    </button>
                    <Link
                      to={`/courses/${_id}`}
                      className={styles.viewDetailButton}
                      aria-label={`View details for ${title}`}
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
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={styles.paginationButton}
              aria-label="Previous page"
            >
              <FiChevronLeft size={18} />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={styles.paginationButton}
              aria-label="Next page"
            >
              <FiChevronRight size={18} />
            </button>
          </motion.div>
        </>
      )}
    </section>
  );
}
