import { useEffect, useState } from "react";
import { courseService } from "../service/api";
import styles from "./FeaturedCourse.module.css";

export default function FeaturedCourse() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await courseService.getAllCourses();

        setCourses(response.data.courses);

        console.log(response.data.courses);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.featuredSection}>
      {courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <div className={styles.courseGrid}>
          {courses.map(({ id, title, description, image }) => (
            <div key={id} className={styles.courseCard}>
              <img src={image} alt={title} className={styles.courseImage} />
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{title}</h3>
                <p className={styles.courseDescription}>{description}</p>
                <button className={styles.learnMoreBtn}>Learn More</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
