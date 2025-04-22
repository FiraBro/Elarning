import React from 'react';
import styles from './CertificationsOutcomesSection.module.css';

const CertificationsOutcomesSection = () => (
  <section className={styles.certificationsOutcomesSection}>
    <h2>Certifications & Outcomes</h2>
    <p className={styles.intro}>
      Enhance your skills and career prospects with our comprehensive
      certifications.
    </p>
    <div className={styles.outcomesGrid}>
      <div className={styles.outcome}>
        <h3>Industry-Recognized Certifications</h3>
        <p>
          Validate your expertise with certifications recognized by leading
          companies.
        </p>
      </div>
      <div className={styles.outcome}>
        <h3>Practical Skill-Building</h3>
        <p>
          Gain hands-on experience through real-world projects and exercises.
        </p>
      </div>
      <div className={styles.outcome}>
        <h3>Career Advancement</h3>
        <p>
          Boost your resume and unlock new career opportunities with our
          training.
        </p>
      </div>
    </div>
    <p className={styles.conclusion}>
      Invest in your future and achieve your professional goals.
    </p>
  </section>
);

export default CertificationsOutcomesSection;
