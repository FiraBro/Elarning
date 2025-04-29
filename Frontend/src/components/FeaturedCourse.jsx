import { useEffect, useState } from "react";
import { courseService } from "../service/api";
import styles from "./FeaturedCourse.module.css";

export default function FeaturedCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  console.log(courses);
  // Pagination, sorting, and search state
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
      alert("Enrollment successful!");
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert(error.response?.data?.message || "Enrollment failed");
      console.log(error.response.data.message);
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <section className={styles.featuredSection}>
      <div className={styles.featureHaed}>
        <h1>Our Featured Courses</h1>
      </div>

      <div className={styles.controlsCombined}>
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
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <div className={styles.courseGrid}>
            {courses.map(({ _id, title, description, banner, price }) => (
              <div key={_id} className={styles.courseCard}>
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={handleNextPage}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
