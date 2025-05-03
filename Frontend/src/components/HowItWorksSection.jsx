import React from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaBookOpen,
  FaClock,
  FaChartLine,
  FaCertificate,
} from "react-icons/fa";
import styles from "./HowItWorksSection.module.css";

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your account to access personalized learning materials and track your progress.",
    icon: <FaUserPlus />,
  },
  {
    title: "Choose a Course",
    description:
      "Browse our catalog and pick a course that suits your interest or career goals.",
    icon: <FaBookOpen />,
  },
  {
    title: "Learn at Your Pace",
    description:
      "Access interactive lessons, video lectures, and quizzes anytime, anywhere.",
    icon: <FaClock />,
  },
  {
    title: "Track Your Progress",
    description:
      "Use your dashboard to monitor learning stats and get recommendations.",
    icon: <FaChartLine />,
  },
  {
    title: "Earn Certificates",
    description:
      "Complete courses to receive shareable certificates of achievement.",
    icon: <FaCertificate />,
  },
];

const HowItWorksSection = () => {
  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>How It Works</h2>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <div className={styles.icon}>{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
