// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import styles from "./Navbar.module.css";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.classList.add(styles.menuOpen);
//     } else {
//       document.body.classList.remove(styles.menuOpen);
//     }
//   }, [isMobileMenuOpen]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userId");
//     setIsLoggedIn(false);
//     setIsMobileMenuOpen(false);
//     navigate("/");
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <>
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>
//           <Link to="/">E-Learning Platform</Link>
//         </div>

//         {/* Desktop Navigation */}
//         <div className={styles.navLinks}>
//           <Link to="/browse">Browse Courses</Link>
//           <Link to="/mycourse">My Courses</Link>

//           {isLoggedIn ? (
//             <>
//               <Link to="/profile">Profile</Link>
//               <button onClick={handleLogout} className={styles.logoutButton}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/signup" className={styles.authLink}>
//                 Sign Up
//               </Link>
//               <Link to="/login" className={styles.authLink}>
//                 Login
//               </Link>
//             </>
//           )}

//           <Link to="/instructor" className={styles.instructorButton}>
//             Become Instructor
//           </Link>
//         </div>

//         {/* Mobile Navigation */}
//         <div className={styles.mobileMenu}>
//           <button
//             onClick={toggleMobileMenu}
//             className={`${styles.menuButton} ${
//               isMobileMenuOpen ? styles.active : ""
//             }`}
//             aria-label="Mobile menu"
//           >
//             {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu Dropdown */}
//       <div
//         className={`${styles.mobileNavLinks} ${
//           isMobileMenuOpen ? styles.active : ""
//         }`}
//         aria-hidden={!isMobileMenuOpen}
//       >
//         <Link to="/browse" onClick={toggleMobileMenu}>
//           Browse Courses
//         </Link>
//         <Link to="/mycourse" onClick={toggleMobileMenu}>
//           My Courses
//         </Link>

//         {isLoggedIn ? (
//           <>
//             <Link to="/profile" onClick={toggleMobileMenu}>
//               Profile
//             </Link>
//             <button
//               onClick={() => {
//                 handleLogout();
//                 toggleMobileMenu();
//               }}
//               className={styles.logoutButton}
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/signup" onClick={toggleMobileMenu}>
//               Sign Up
//             </Link>
//             <Link to="/login" onClick={toggleMobileMenu}>
//               Login
//             </Link>
//           </>
//         )}

//         <Link
//           to="/instructor"
//           onClick={toggleMobileMenu}
//           className={styles.instructorButton}
//         >
//           Become Instructor
//         </Link>
//       </div>

//       {/* Backdrop */}
//       {isMobileMenuOpen && (
//         <div
//           className={`${styles.backdrop} ${
//             isMobileMenuOpen ? styles.active : ""
//           }`}
//           onClick={toggleMobileMenu}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;

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

    const role = localStorage.getItem("userRole");
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

  return (
    <>
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

          {/* Conditionally render Become Instructor */}
          {/* {(!isLoggedIn || userRole !== "student") && (
            <Link to="/instructor" className={styles.instructorButton}>
              Become Instructor
            </Link>
          )} */}
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

        {/* Conditionally render Become Instructor in mobile menu */}
        {(!isLoggedIn || userRole !== "student") && (
          <Link
            to="/instructor"
            onClick={toggleMobileMenu}
            className={styles.instructorButton}
          >
            Become Instructor
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
