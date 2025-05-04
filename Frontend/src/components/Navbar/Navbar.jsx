import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Sync auth state with localStorage and across tabs
  const syncAuthState = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    let role = localStorage.getItem("userRole");
    if (!token || !role || role === "null") {
      role = null;
    }
    setUserRole(role);
  };

  useEffect(() => {
    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  // Accessibility: Focus trap and Escape key
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const focusableEls = mobileMenuRef.current
      ? mobileMenuRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      : [];
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
      if (e.key === "Tab" && focusableEls.length) {
        // Focus trap
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus the first element when menu opens
    firstEl && firstEl.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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

  const handleMenuButtonClick = () => setIsMobileMenuOpen((open) => !open);

  const handleMobileLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">
            Edu<span>Learn</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
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

          {isLoggedIn && userRole === "admin" && (
            <Link to="/admin/dashboard" className={styles.instructorButton}>
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className={styles.mobileMenu}>
          <button
            onClick={handleMenuButtonClick}
            className={`${styles.menuButton} ${
              isMobileMenuOpen ? styles.active : ""
            }`}
            aria-label="Mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobileNavLinks"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobileNavLinks"
        className={`${styles.mobileNavLinks} ${
          isMobileMenuOpen ? styles.active : ""
        }`}
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        ref={mobileMenuRef}
      >
        <Link to="/browse" onClick={handleMobileLinkClick}>
          Browse Courses
        </Link>
        {isLoggedIn && userRole === "student" && (
          <Link to="/mycourse" onClick={handleMobileLinkClick}>
            My Courses
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/profile" onClick={handleMobileLinkClick}>
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleMobileLinkClick();
              }}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" onClick={handleMobileLinkClick}>
              Sign Up
            </Link>
            <Link to="/login" onClick={handleMobileLinkClick}>
              Login
            </Link>
          </>
        )}

        {isLoggedIn && userRole === "admin" && (
          <Link
            to="/admin/dashboard"
            onClick={handleMobileLinkClick}
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
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close mobile menu"
          tabIndex={0}
        />
      )}
    </>
  );
};

export default Navbar;
