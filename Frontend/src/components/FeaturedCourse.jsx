import { useEffect, useState } from "react";
import { courseService } from "../service/api";
import styles from "./FeaturedCourse.module.css";

export default function FeaturedCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination, sorting, and search state
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [sort, setSort] = useState("createdAt");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Build params object with search included
        const params = {
          page,
          limit,
          sort,
        };
        if (search.trim() !== "") {
          params.search = search.trim();
        }

        const { data } = await courseService.getAllCourses(params);
        setCourses(data.courses || []);
        console.log(data);
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
    setPage(1); // reset to first page when search changes
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <section className={styles.featuredSection}>
      <div className={styles.featureHaed}>
        <h1>Our Featured Courses</h1>
      </div>

      
       {/* <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      
      <div className={styles.controls}>
        <label>
          Sort by:{" "}
          <select value={sort} onChange={handleSortChange}>
            <option value="createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="title">Title A-Z</option>
            <option value="-title">Title Z-A</option>
          </select>
        </label>
      </div>  */}
      {/* Combined search + sort controls */}
<div className={styles.controlsCombined}>
  <input
    type="text"
    placeholder="Search courses..."
    value={search}
    onChange={handleSearchChange}
    className={styles.searchInput}
  />

  <select value={sort} onChange={handleSortChange} className={styles.sortSelect}>
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
            {courses.map(({ id, title, description, image, price }) => (
              <div key={id} className={styles.courseCard}>
                <img src={image} alt={title} className={styles.courseImage} />
                <div className={styles.courseContent}>
                  <h3 className={styles.courseTitle}>{title}</h3>
                  <p className={styles.courseDescription}>{description}</p>
                  <button className={styles.learnMoreBtn}>{price}$</button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </>
      )}
    </section>
  );
}
