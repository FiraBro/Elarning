import React from 'react';
import styles from './NewsletterSignup.module.css';

const NewsletterSignup = () => (
  <section className={styles.newsletterSignup}>
    <div className={styles.content}>
      <h2>Join Our Learning Community</h2>
      <p>
        Stay updated with the latest courses, exclusive content, and special
        offers. Subscribe to our newsletter and enhance your learning
        journey!
      </p>
      <form className={styles.signupForm}>
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
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

export default NewsletterSignup;
