import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HeroSection.module.css";

import bg1 from "../../assets/coding.jpg";
import bg2 from "../../assets/bugati.jpg";
import bg3 from "../../assets/home.jpg";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    bgImage: bg1,
    title: "Unlock Your Potential",
    subtitle: "Start learning from world-class instructors today",
    buttonText: "Explore Courses",
    buttonLink: "/courses",
    textAnimation: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    },
    bgAnimation: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1.5 } },
    },
  },
  {
    bgImage: bg2,
    title: "Learn At Your Pace",
    subtitle: "Access courses anytime, anywhere on any device",
    buttonText: "Join Free",
    buttonLink: "/signup",
    textAnimation: {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, type: "spring" },
      },
    },
    bgAnimation: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1.5 } },
    },
  },
  {
    bgImage: bg3,
    title: "Upgrade Your Skills",
    subtitle: "Master in-demand skills for the future of work",
    buttonText: "Start Now",
    buttonLink: "/courses",
    textAnimation: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    },
    bgAnimation: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1.5 } },
    },
  },
];

const AUTO_SLIDE_INTERVAL = 8000; // 8 seconds

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    navigate(slides[currentSlide].buttonLink);
  };

  return (
    <section className={styles.heroContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={slides[currentSlide].bgAnimation}
          className={styles.heroBackground}
          style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
          aria-hidden="true"
        />
      </AnimatePresence>

      <div className={styles.heroContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slides[currentSlide].textAnimation}
            className={styles.textContent}
          >
            <h1 className={styles.heroTitle}>{slides[currentSlide].title}</h1>
            <p className={styles.heroSubtitle}>
              {slides[currentSlide].subtitle}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.heroButton}
              onClick={handleCTA}
              aria-label={slides[currentSlide].buttonText}
            >
              {slides[currentSlide].buttonText}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className={styles.slideIndicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              currentSlide === index ? styles.active : ""
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
