// import React from 'react';
// import styles from './Footer.module.css';

// const Footer = () => (
//   <footer className={styles.footer}>
//     <div className={styles.footerContainer}>
//       <div className={styles.footerSection}>
//         <h3>Quick Links</h3>
//         <ul>
//           <li>
//             <a href="/about">About</a>
//           </li>
//           <li>
//             <a href="/contact">Contact</a>
//           </li>
//           <li>
//             <a href="/courses">Courses</a>
//           </li>
//           <li>
//             <a href="/blog">Blog</a>
//           </li>
//         </ul>
//       </div>
//       <div className={styles.footerSection}>
//         <h3>Legal</h3>
//         <ul>
//           <li>
//             <a href="/terms">Terms of Service</a>
//           </li>
//           <li>
//             <a href="/privacy">Privacy Policy</a>
//           </li>
//         </ul>
//       </div>
//       <div className={styles.footerSection}>
//         <h3>Social</h3>
//         <ul>
//           <li>
//             <a href="https://facebook.com">Facebook</a>
//           </li>
//           <li>
//             <a href="https://twitter.com">Twitter</a>
//           </li>
//           <li>
//             <a href="https://linkedin.com">LinkedIn</a>
//           </li>
//           <li>
//             <a href="https://instagram.com">Instagram</a>
//           </li>
//         </ul>
//       </div>
//     </div>
//     <div className={styles.copyright}>
//       <p>&copy; {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
//     </div>
//   </footer>
// );

// export default Footer;

import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerWave}></div>

      <motion.div
        className={styles.footerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={footerVariants}
      >
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <h2 className={styles.logo}>
              Edu<span>Learn</span>
            </h2>
            <p className={styles.tagline}>
              Empowering your learning journey with quality education.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" aria-label="Facebook">
                <FaFacebook className={styles.socialIcon} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <FaTwitter className={styles.socialIcon} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn">
                <FaLinkedin className={styles.socialIcon} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram">
                <FaInstagram className={styles.socialIcon} />
              </a>
            </div>
          </div>

          <div className={styles.footerSections}>
            <motion.div
              className={styles.footerSection}
              custom={0}
              variants={listItemVariants}
            >
              <h3 className={styles.sectionTitle}>Quick Links</h3>
              <ul className={styles.footerLinks}>
                {["About", "Courses", "Pricing", "Blog"].map((item, i) => (
                  <motion.li
                    key={item}
                    custom={i + 1}
                    variants={listItemVariants}
                  >
                    <a
                      href={`/${item.toLowerCase()}`}
                      className={styles.footerLink}
                    >
                      <FaArrowRight className={styles.linkIcon} />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className={styles.footerSection}
              custom={1}
              variants={listItemVariants}
            >
              <h3 className={styles.sectionTitle}>Support</h3>
              <ul className={styles.footerLinks}>
                {["Help Center", "Contact Us", "FAQs", "Feedback"].map(
                  (item, i) => (
                    <motion.li
                      key={item}
                      custom={i + 1}
                      variants={listItemVariants}
                    >
                      <a
                        href={`/${item.toLowerCase().replace(" ", "-")}`}
                        className={styles.footerLink}
                      >
                        <FaArrowRight className={styles.linkIcon} />
                        {item}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>

            <motion.div
              className={styles.footerSection}
              custom={2}
              variants={listItemVariants}
            >
              <h3 className={styles.sectionTitle}>Legal</h3>
              <ul className={styles.footerLinks}>
                {[
                  "Terms of Service",
                  "Privacy Policy",
                  "Cookie Policy",
                  "GDPR",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    custom={i + 1}
                    variants={listItemVariants}
                  >
                    <a
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className={styles.footerLink}
                    >
                      <FaArrowRight className={styles.linkIcon} />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className={styles.footerSection}
              custom={3}
              variants={listItemVariants}
            >
              <h3 className={styles.sectionTitle}>Newsletter</h3>
              <p className={styles.newsletterText}>
                Subscribe to get updates on new courses and offers.
              </p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className={styles.newsletterInput}
                  required
                />
                <button type="submit" className={styles.newsletterButton}>
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} EduLearn. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <a href="/terms">Terms</a>
            <span className={styles.divider}>|</span>
            <a href="/privacy">Privacy</a>
            <span className={styles.divider}>|</span>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
