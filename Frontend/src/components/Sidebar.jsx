// // import React from "react";
// // import { NavLink } from "react-router-dom";
// // import style from "./Sidebar.module.css";
// // export default function Sidebar() {
// //   return (
// //     <div className={style.sidebar}>
// //       <h1>Admin View</h1>
// //       <div className={style.sidebarLink}>
// //         <NavLink to="/dashboard">Dashboard</NavLink>
// //         <NavLink to="/course">Course</NavLink>
// //         <NavLink to='/user'>Users</NavLink>
// //       </div>
// //     </div>
// //   );
// // }

// import React from "react";
// import { NavLink } from "react-router-dom";
// import styles from "./Sidebar.module.css";

// const Sidebar = () => (
//   <nav className={styles.sidebar}>
//     <NavLink
//       to="/admin/dashboard"
//       className={({ isActive }) =>
//         isActive ? `${styles.link} ${styles.active}` : styles.link
//       }
//     >
//       Dashboard
//     </NavLink>
//     <NavLink
//       to="/admin/courses"
//       className={({ isActive }) =>
//         isActive ? `${styles.link} ${styles.active}` : styles.link
//       }
//     >
//       Course
//     </NavLink>
//     <NavLink
//       to="/admin/users"
//       className={({ isActive }) =>
//         isActive ? `${styles.link} ${styles.active}` : styles.link
//       }
//     >
//       User
//     </NavLink>
//   </nav>
// );

// export default Sidebar;


import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

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
            <span className={isMobileMenuOpen ? styles.hamburgerTopActive : styles.hamburgerTop}></span>
            <span className={isMobileMenuOpen ? styles.hamburgerMiddleActive : styles.hamburgerMiddle}></span>
            <span className={isMobileMenuOpen ? styles.hamburgerBottomActive : styles.hamburgerBottom}></span>
          </div>
        </button>
      )}

      {/* Sidebar */}
      <nav className={`${styles.sidebar} ${isMobileView && !isMobileMenuOpen ? styles.hidden : ''}`}>
        <div className={styles.sidebarContent}>
          <h1 className={styles.sidebarTitle}>Admin Panel</h1>
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
        <div 
          className={styles.overlay}
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
