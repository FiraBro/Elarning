import React from 'react';
import styles from './Overview.module.css';

const Overview = () => (
  <header className={styles.hero}>
    <div className={styles.content}>
      <h1 className={styles.title}>Unlock Your Potential with <span className={styles.highlight}>E-Learning</span></h1>
      <p className={styles.subtitle}>
        Join thousands of learners and start mastering new skills, anytime, anywhere.
      </p>
      <div className={styles.ctaGroup}>
        <a href="#courses" className={styles.ctaPrimary}>Browse Courses</a>
        <a href="#signup" className={styles.ctaSecondary}>Sign Up Free</a>
      </div>
    </div>
    <img
      src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4764.jpg"
      alt="E-learning illustration"
      className={styles.heroImage}
    />
  </header>
);

export default Overview;
