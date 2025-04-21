import React from "react";
import styles from "./FeaturedCourse.module.css";

const courses = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description:
      "Learn to build modern web applications using React, Node.js, and databases.",
    image: "/images/fullstack.jpg",
  },
  {
    id: 2,
    title: "Graphic Design Masterclass",
    description:
      "Master Adobe Photoshop, Illustrator, and design principles to create stunning visuals.",
    image: "/images/graphic-design.jpg",
  },
  {
    id: 3,
    title: "Digital Marketing 101",
    description:
      "Explore SEO, social media marketing, and content strategies to grow any business.",
    image: "/images/digital-marketing.jpg",
  },
];

export default function FeaturedCourse() {
  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.title}>Featured Courses</h2>
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
    </section>
  );
}
