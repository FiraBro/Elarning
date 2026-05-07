import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const syncAuthState = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setUserRole(token && role !== "null" ? role : null);
  };

  useEffect(() => {
    syncAuthState();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", syncAuthState);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    syncAuthState();
    navigate("/");
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <Link to="/">
              Edu<span>Learn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.navLinks}>
            <Link
              to="/browse"
              className={
                location.pathname === "/browse" ? styles.activeLink : ""
              }
            >
              Browse
            </Link>

            {isLoggedIn && userRole === "student" && (
              <Link
                to="/mycourse"
                className={
                  location.pathname === "/mycourse" ? styles.activeLink : ""
                }
              >
                My Learning
              </Link>
            )}

            <div className={styles.divider}></div>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className={styles.profileLink}>
                  Profile
                </Link>
                {userRole === "admin" && (
                  <Link to="/admin/dashboard" className={styles.adminBadge}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.loginLink}>
                  Login
                </Link>
                <Link to="/signup" className={styles.signupBtn}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={styles.menuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.drawerOpen : ""}`}
        ref={mobileMenuRef}
      >
        <div className={styles.drawerLinks}>
          <Link to="/browse">Browse Courses</Link>
          {isLoggedIn && userRole === "student" && (
            <Link to="/mycourse">My Learning</Link>
          )}
          <hr className={styles.drawerDivider} />
          {isLoggedIn ? (
            <>
              <Link to="/profile">Profile</Link>
              {userRole === "admin" && (
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className={styles.mobileSignupBtn}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
