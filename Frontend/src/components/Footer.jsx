import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContainer}>
      <div className={styles.footerSection}>
        <h3>Quick Links</h3>
        <ul>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/courses">Courses</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
        </ul>
      </div>
      <div className={styles.footerSection}>
        <h3>Legal</h3>
        <ul>
          <li>
            <a href="/terms">Terms of Service</a>
          </li>
          <li>
            <a href="/privacy">Privacy Policy</a>
          </li>
        </ul>
      </div>
      <div className={styles.footerSection}>
        <h3>Social</h3>
        <ul>
          <li>
            <a href="https://facebook.com">Facebook</a>
          </li>
          <li>
            <a href="https://twitter.com">Twitter</a>
          </li>
          <li>
            <a href="https://linkedin.com">LinkedIn</a>
          </li>
          <li>
            <a href="https://instagram.com">Instagram</a>
          </li>
        </ul>
      </div>
    </div>
    <div className={styles.copyright}>
      <p>&copy; {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
