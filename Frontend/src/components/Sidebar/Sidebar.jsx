import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styles from "../Sidebar/Sidebar.module.css";

const menuItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/courses", label: "Course Management" },
  { to: "/admin/users", label: "User Management" },
];

const Sidebar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const checkScreenSize = useCallback(() => {
    if (typeof window !== "undefined") {
      setIsMobileView(window.innerWidth <= 768);
    }
  }, []);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  // Close sidebar on Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      {isMobileView && (
        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebarNav"
        >
          {/* Hamburger */}
          <div className={styles.hamburger}>{/* ... */}</div>
        </button>
      )}

      <nav
        id="sidebarNav"
        role="navigation"
        className={`${styles.sidebar} ${
          isMobileView && !isMobileMenuOpen ? styles.hidden : ""
        }`}
      >
        <div className={styles.sidebarContent}>
          <NavLink to="/" className={styles.sidebarTitle}>
            Back To Home
          </NavLink>
          <div className={styles.navLinks}>
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                onClick={() => isMobileView && setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {isMobileView && isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
          tabIndex={-1}
        />
      )}
    </>
  );
};

export default Sidebar;
