import React from 'react';
import styles from './CourseCategoriesSection.module.css';

const categories = [
  {
    name: 'Programming',
    icon: '</>', // Placeholder - replace with actual icon
  },
  {
    name: 'Business',
    icon: '💼', // Placeholder - replace with actual icon
  },
  {
    name: 'Design',
    icon: '🎨', // Placeholder - replace with actual icon
  },
  {
    name: 'Marketing',
    icon: '📢', // Placeholder - replace with actual icon
  },
];

const popularCourses = [
  {
    title: 'Python for Beginners',
    instructor: 'John Smith',
    rating: 4.38,
    enrolledDate: '4 Nov',
    level: 'Beginner',
  },
  {
    title: 'Graphic Design Masterclass',
    instructor: 'Emily Johnson',
    rating: 4.73,
    level: 'Meediato',
  },
  {
    title: 'Data Science and Machine Learning',
    instructor: 'David Brown',
    rating: 4.46,
    level: 'Andanced',
  },
  {
    title: 'Digital Marketing Fundamentals',
    instructor: 'Sarah Milson',
    rating: 4.5,
    level: 'Adaunced',
  },
];

const CourseCategoriesSection = () => (
  <section className={styles.courseCategoriesSection}>
    <h2>Popular Courses</h2>
    <div className={styles.popularCoursesGrid}>
      {popularCourses.map((course, index) => (
        <div key={index} className={styles.courseCard}>
          <h3>{course.title}</h3>
          <p>By {course.instructor}</p>
          <p>Rating: {course.rating}</p>
          <p>Level: {course.level}</p>
        </div>
      ))}
    </div>
    <h2>Categories</h2>
    <div className={styles.categoriesGrid}>
      {categories.map((category) => (
        <div key={category.name} className={styles.categoryCard}>
          {category.icon}
          <p>{category.name}</p>
        </div>
      ))}
    </div>
  </section>
);

export default CourseCategoriesSection;
