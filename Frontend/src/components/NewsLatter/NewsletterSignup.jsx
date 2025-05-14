import React, { useState } from "react";
import styles from "./NewsletterSignup.module.css";
import { subscriptionService } from "../../service/api";

const TELEGRAM_LINK = "https://t.me/FiraBro";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Please enter your email", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      await subscriptionService.subscribe(email);
      setMessage({
        text: "Thank you for subscribing! Check your email for confirmation.",
        type: "success",
      });
      setEmail("");
    } catch (error) {
      setMessage({
        text: error.message || "Subscription failed. Please try again later.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.newsletterSignup}>
      <div className={styles.content}>
        <h2>Join Our Learning Community</h2>
        <p>
          Stay updated with the latest courses, exclusive content, and special
          offers. Subscribe to our newsletter or join our Telegram community!
        </p>

        <form onSubmit={handleSubmit} className={styles.subscriptionForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.communityLinks}>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.telegramButton}
          >
            <span role="img" aria-label="Telegram">
              📢
            </span>{" "}
            Join us on Telegram
          </a>
        </div>

        <ul className={styles.benefitsList}>
          <li>
            <span role="img" aria-label="Checkmark">
              ✔️
            </span>
            Access exclusive tutorials and resources
          </li>
          <li>
            <span role="img" aria-label="Checkmark">
              ✔️
            </span>
            Get notified about new courses and workshops
          </li>
          <li>
            <span role="img" aria-label="Checkmark">
              ✔️
            </span>
            Receive personalized learning recommendations
          </li>
        </ul>
      </div>
    </section>
  );
};

export default NewsletterSignup;
