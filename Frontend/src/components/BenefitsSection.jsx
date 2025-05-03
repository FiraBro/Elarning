import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./BenefitsSection.module.css";

const benefits = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14l6.16-3.422a12.083 12.083 0 01.84 4.578c0 3.866-3.582 7-8 7s-8-3.134-8-7a12.083 12.083 0 01.84-4.578L12 14z"
        />
      </svg>
    ),
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of experience.",
    color: "#0d9488",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Certificate of Completion",
    description: "Earn recognized certificates to showcase your achievements.",
    color: "#7c3aed",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Online Community",
    description: "Connect with peers and share ideas.",
    color: "#ea580c",
  },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring", stiffness: 80 },
  },
  hover: { scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
};

const iconVariants = {
  hidden: { scale: 0.7, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
  hover: { scale: 1.15 },
};

const BenefitCard = ({ icon, title, description, color }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className={styles.benefitCard}
      style={{ "--card-accent": color }}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover="hover"
    >
      <motion.div
        className={styles.iconWrapper}
        variants={iconVariants}
        initial="hidden"
        animate={controls}
        whileHover="hover"
      >
        <div className={styles.iconBackground} />
        {icon}
      </motion.div>
      <h3 className={styles.benefitTitle}>{title}</h3>
      <p className={styles.benefitDescription}>{description}</p>
    </motion.div>
  );
};

const BenefitsSection = () => (
  <section className={styles.benefitsSection}>
    <div className={styles.header}>
      <h2 className={styles.heading}>Why Choose Us</h2>
      <p className={styles.subheading}>
        Our platform benefits designed to help you succeed
      </p>
    </div>
    <div className={styles.benefitsGrid}>
      {benefits.map((benefit, i) => (
        <BenefitCard key={benefit.title} {...benefit} />
      ))}
    </div>
  </section>
);

export default BenefitsSection;
