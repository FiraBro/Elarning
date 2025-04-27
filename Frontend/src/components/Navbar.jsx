import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    let role = localStorage.getItem("userRole");
    // Normalize role: if no token or role is missing or "null" string, set to null
    if (!token || !role || role === "null") {
      role = null;
    }
    setUserRole(role);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add(styles.menuOpen);
    } else {
      document.body.classList.remove(styles.menuOpen);
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserRole(null);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Debugging - remove or comment out in production
  // console.log("isLoggedIn:", isLoggedIn, "userRole:", userRole);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">E-Learning Platform</Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <Link to="/browse">Browse Courses</Link>

          {isLoggedIn && userRole === "student" && (
            <Link to="/mycourse">My Courses</Link>
          )}

          {isLoggedIn ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className={styles.authLink}>
                Sign Up
              </Link>
              <Link to="/login" className={styles.authLink}>
                Login
              </Link>
            </>
          )}

          {/* Show Become Instructor only if logged in and userRole is "admin" */}
          {isLoggedIn && userRole === "admin" && (
            <Link to="/admin/dashboard" className={styles.instructorButton}>
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className={styles.mobileMenu}>
          <button
            onClick={toggleMobileMenu}
            className={`${styles.menuButton} ${
              isMobileMenuOpen ? styles.active : ""
            }`}
            aria-label="Mobile menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`${styles.mobileNavLinks} ${
          isMobileMenuOpen ? styles.active : ""
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <Link to="/browse" onClick={toggleMobileMenu}>
          Browse Courses
        </Link>
        {isLoggedIn && userRole === "student" && (
          <Link to="/mycourse" onClick={toggleMobileMenu}>
            My Courses
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/profile" onClick={toggleMobileMenu}>
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" onClick={toggleMobileMenu}>
              Sign Up
            </Link>
            <Link to="/login" onClick={toggleMobileMenu}>
              Login
            </Link>
          </>
        )}

        {/* Show Become Instructor only if logged in and userRole is "admin" */}
        {isLoggedIn && userRole === "admin" && (
          <Link
            to="/admin/dashboard"
            onClick={toggleMobileMenu}
            className={styles.instructorButton}
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className={`${styles.backdrop} ${
            isMobileMenuOpen ? styles.active : ""
          }`}
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
