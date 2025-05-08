import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { courseService, userService } from "../../service/api";
import styles from "./ReviewDisplaySection.module.css";

export default function ReviewDisplaySection() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await courseService.getAllReviews(1);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return;

    const interval = setInterval(() => {
      handleChange((currentIndex + 1) % reviews.length, "next");
    }, 6000);

    return () => clearInterval(interval);
  }, [reviews, currentIndex]);

  const handleChange = (newIndex, dir) => {
    if (isAnimating || newIndex === currentIndex) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 700); // Match with CSS animation duration
  };

  const handleDotClick = (index) => {
    const dir = index > currentIndex ? "next" : "prev";
    handleChange(index, dir);
  };

  const review = reviews[currentIndex];

  return (
    <section className={styles.reviewSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>What Our Learners Say</h2>

        {reviews.length === 0 ? (
          <p className={styles.empty}>No reviews yet.</p>
        ) : (
          <div className={styles.cardWrapper}>
            <div
              key={review._id}
              className={`${styles.card} ${styles.slide} ${
                isAnimating
                  ? direction === "next"
                    ? styles.slideOutLeft
                    : styles.slideOutRight
                  : direction === "next"
                  ? styles.slideInRight
                  : styles.slideInLeft
              }`}
            >
              <div className={styles.header}>
                <div className={styles.avatarContainer}>
                  <img
                    src={
                      review.user?.photo
                        ? userService.getUserImageUrl(review.user.photo)
                        : "/default-avatar.jpg"
                    }
                    alt={`Profile photo of ${review.user?.name || "Anonymous"}`}
                    className={styles.avatar}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/default-avatar.jpg";
                    }}
                  />
                  <h4 className={styles.username}>
                    {review.user?.name || "Anonymous"}
                  </h4>
                </div>
                <div className={styles.stars}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className={styles.comment}>"{review.comment}"</p>
              {review.course?.title && (
                <p className={styles.course}>Course: {review.course.title}</p>
              )}
            </div>
          </div>
        )}

        <div className={styles.pageDots}>
          {reviews.map((_, index) => (
            <span
              key={index}
              onClick={() => handleDotClick(index)}
              className={`${styles.dot} ${
                currentIndex === index ? styles.activeDot : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
