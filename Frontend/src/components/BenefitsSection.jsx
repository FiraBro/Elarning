import React from "react";
import styles from "./BenefitsSection.module.css";

// You can replace these SVG icons with your own or use an icon library like react-icons
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Lifetime Access",
    description: "Study at your own pace with unlimited course access forever.",
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
          d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2v2m0 16v2m8-10h-2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05L4.636 4.636m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414"
        />
      </svg>
    ),
    title: "Affordable Pricing",
    description:
      "Get the best value with competitive course fees and discounts.",
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
  },
];

const BenefitsSection = () => (
  <section className={styles.benefitsSection}>
    <h2 className={styles.heading}>Why Choose Us</h2>
    <p className={styles.subheading}>
      Our platform benefits designed to help you succeed
    </p>
    <div className={styles.benefitsGrid}>
      {benefits.map(({ icon, title, description }) => (
        <div key={title} className={styles.benefitCard}>
          <div className={styles.iconWrapper}>{icon}</div>
          <h3 className={styles.benefitTitle}>{title}</h3>
          <p className={styles.benefitDescription}>{description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default BenefitsSection;
