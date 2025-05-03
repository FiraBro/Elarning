import React from "react";
import { motion } from "framer-motion";
import styles from "./CertificationsOutcomesSection.module.css";

const CertificationsOutcomesSection = () => (
  <section className={styles.certificationsOutcomesSection}>
    <motion.h2
      className={styles.title}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
      }}
      viewport={{ once: true }}
    >
      Certifications & Outcomes
    </motion.h2>

    <motion.p
      className={styles.intro}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        delay: 0.2,
      }}
      viewport={{ once: true }}
    >
      Enhance your skills and career prospects with our comprehensive
      certifications.
    </motion.p>

    <motion.div
      className={styles.outcomesGrid}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
        delay: 0.3,
      }}
      viewport={{ once: true }}
    >
      <motion.div
        className={styles.outcome}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: 0.4,
        }}
        viewport={{ once: true }}
      >
        <h3>Industry-Recognized Certifications</h3>
        <p>
          Validate your expertise with certifications recognized by leading
          companies.
        </p>
      </motion.div>

      <motion.div
        className={styles.outcome}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: 0.6,
        }}
        viewport={{ once: true }}
      >
        <h3>Practical Skill-Building</h3>
        <p>
          Gain hands-on experience through real-world projects and exercises.
        </p>
      </motion.div>

      <motion.div
        className={styles.outcome}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: 0.8,
        }}
        viewport={{ once: true }}
      >
        <h3>Career Advancement</h3>
        <p>
          Boost your resume and unlock new career opportunities with our
          training.
        </p>
      </motion.div>
    </motion.div>

    <motion.p
      className={styles.conclusion}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        delay: 1,
      }}
      viewport={{ once: true }}
    >
      Invest in your future and achieve your professional goals.
    </motion.p>
  </section>
);

export default CertificationsOutcomesSection;
