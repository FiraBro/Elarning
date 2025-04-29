import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// import BackIcon from "./Button/BackIcon";
import styles from "../Sidebar/Sidebar.module.css";

const Sidebar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobileView && (
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <div className={styles.hamburger}>
            <span
              className={
                isMobileMenuOpen
                  ? styles.hamburgerTopActive
                  : styles.hamburgerTop
              }
            ></span>
            <span
              className={
                isMobileMenuOpen
                  ? styles.hamburgerMiddleActive
                  : styles.hamburgerMiddle
              }
            ></span>
            <span
              className={
                isMobileMenuOpen
                  ? styles.hamburgerBottomActive
                  : styles.hamburgerBottom
              }
            ></span>
          </div>
        </button>
      )}

      {/* Sidebar */}
      <nav
        className={`${styles.sidebar} ${
          isMobileView && !isMobileMenuOpen ? styles.hidden : ""
        }`}
      >
        <div className={styles.sidebarContent}>
          <NavLink to="/" className={styles.sidebarTitle}>
            Back To Home
          </NavLink>
          <div className={styles.navLinks}>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={() => isMobileView && setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={() => isMobileView && setMobileMenuOpen(false)}
            >
              Course Management
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={() => isMobileView && setMobileMenuOpen(false)}
            >
              User Management
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMobileView && isMobileMenuOpen && (
        <div className={styles.overlay} onClick={toggleMobileMenu} />
      )}
    </>
  );
};

export default Sidebar;
