import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../../service/api";
import styles from "./CourseList.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiLayers,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // FIXED: Default sort to '-createdAt' so newest courses appear first
  const [sort, setSort] = useState("-createdAt");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit, sort };
      if (debouncedSearch !== "") params.search = debouncedSearch;

      const { data } = await courseService.getAllCourses(params);
      // Adjusting based on common API response structures
      const fetchedCourses = data.courses || data.data?.courses || [];
      const total = data.totalPages || data.data?.totalPages || 1;

      setCourses(fetchedCourses);
      setTotalPages(total);
    } catch (error) {
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, debouncedSearch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }));
      await courseService.enrollInCourse(courseId);
      toast.success("Welcome to the course!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer theme="dark" position="bottom-right" />

      <header className={styles.headerSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.headerContent}
        >
          <span className={styles.subTag}>
            <FiTrendingUp /> Skyrocket Your Career
          </span>
          <h1>
            Advance Your Skills With{" "}
            <span className={styles.gradientText}>Expert Courses</span>
          </h1>
        </motion.div>

        {/* RESPONSIVE FILTER BAR */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for titles, skills, or mentors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className={styles.sortSelect}
          >
            <option value="-createdAt">Latest Releases</option>
            <option value="createdAt">Oldest Courses</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </header>

      <main className={styles.contentArea}>
        {loading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : error ? (
          <div className={styles.errorState}>{error}</div>
        ) : courses.length === 0 ? (
          <div className={styles.emptyState}>
            No courses found matching your criteria.
          </div>
        ) : (
          <>
            <motion.div layout className={styles.courseGrid}>
              <AnimatePresence>
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onEnroll={handleEnroll}
                    isEnrolling={enrolling[course._id]}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={styles.pageBtn}
                >
                  <FiChevronLeft /> Previous
                </button>
                <div className={styles.pageIndicator}>
                  Page <span>{page}</span> of {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={styles.pageBtn}
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function CourseCard({ course, onEnroll, isEnrolling }) {
  const { _id, title, description, banner, price } = course;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className={styles.courseCard}
    >
      <div className={styles.imageContainer}>
        <img
          src={courseService.getBannerUrl(banner)}
          alt={title}
          onError={(e) => (e.target.src = "/default-course.jpg")}
        />
        <div className={styles.categoryBadge}>Bestseller</div>
      </div>

      <div className={styles.courseInfo}>
        <h3 className={styles.courseTitle}>{title}</h3>
        <p className={styles.courseDescription}>{description}</p>

        <div className={styles.metaInfo}>
          <span>
            <FiLayers /> 12 Lessons
          </span>
          <span>
            <FiClock /> 4h 30m
          </span>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.priceTag}>
            <span className={styles.currency}>$</span>
            <span className={styles.amount}>{price}</span>
          </div>
          <div className={styles.actions}>
            <Link to={`/courses/${_id}`} className={styles.btnSecondary}>
              Details
            </Link>
            <button
              onClick={() => onEnroll(_id)}
              disabled={isEnrolling}
              className={styles.btnPrimary}
            >
              {isEnrolling ? "..." : "Enroll Now"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
