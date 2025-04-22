import React from 'react';
import styles from './HowItWorksSection.module.css';

const HowItWorksSection = () => (
  <section className={styles.howItWorksSection}>
    <h2>How It Works</h2>
    <div className={styles.steps}>
      <div className={styles.step}>
        <span className={styles.stepNumber}>1</span>
        <h3>Sign Up</h3>
        <p>Create your account to start your learning journey.</p>
      </div>
      <div className={styles.step}>
        <span className={styles.stepNumber}>2</span>
        <h3>Choose Course</h3>
        <p>Select from a wide range of courses tailored to your interests.</p>
      </div>
      <div className={styles.step}>
        <span className={styles.stepNumber}>3</span>
        <h3>Learn</h3>
        <p>Engage with interactive lessons and expert instructors.</p>
      </div>
      <div className={styles.step}>
        <span className={styles.stepNumber}>4</span>
        <h3>Get Certified</h3>
        <p>Earn a certificate to showcase your new skills.</p>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
