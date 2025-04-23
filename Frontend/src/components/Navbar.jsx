import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => (
  <nav className={styles.navbar}>
    <div className={styles.logo}>
      <a href="/">E-Learning Platform</a>
    </div>
    <div className={styles.navLinks}>
      <a href="/browse">Browse Courses</a>
      <a href="/mycourse">My Courses</a>
      <a href="/singup">Singup</a>
      <a href="/login">Login</a>

      <a href="/instructor" className={styles.signupButton}>
        Sign Up
      </a>
    </div>
  </nav>
);

export default Navbar;
