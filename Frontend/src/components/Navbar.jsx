// import React from "react";
// import styles from "./Navbar.module.css";

// const Navbar = () => (
//   <nav className={styles.navbar}>
//     <div className={styles.logo}>
//       <a href="/">E-Learning Platform</a>
//     </div>
//     <div className={styles.navLinks}>
//       <a href="/browse">Browse Courses</a>
//       <a href="/mycourse">My Courses</a>
//       <a href="/singup">Singup</a>
//       <a href="/login">Login</a>

//       <a href="/instructor" className={styles.signupButton}>
//         Sign Up
//       </a>
//     </div>
//   </nav>
// );

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">E-Learning Platform</Link>
      </div>

      {/* Desktop Navigation */}
      <div className={styles.navLinks}>
        <Link to="/browse">Browse Courses</Link>
        <Link to="/mycourse">My Courses</Link>

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

        <Link to="/instructor" className={styles.instructorButton}>
          Become Instructor
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className={styles.mobileMenu}>
        <button onClick={toggleMobileMenu} className={styles.menuButton}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {isMobileMenuOpen && (
          <div className={styles.mobileNavLinks}>
            <Link to="/browse" onClick={toggleMobileMenu}>
              Browse Courses
            </Link>
            <Link to="/mycourse" onClick={toggleMobileMenu}>
              My Courses
            </Link>

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

            <Link
              to="/instructor"
              onClick={toggleMobileMenu}
              className={styles.instructorButton}
            >
              Become Instructor
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
