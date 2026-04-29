import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const menuItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { to: "/admin/courses", label: "Courses", icon: <BookOpen size={20} /> },
  { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar on mobile when navigating
  const handleNavClick = () => {
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header / Toggle */}
      <div className={styles.mobileHeader}>
        <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleBtn}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className={styles.mobileLogo}>Admin Panel</span>
      </div>

      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>A</div>
            <span className={styles.logoText}>LMS Admin</span>
          </div>
        </div>

        <div className={styles.menuSection}>
          <p className={styles.sectionLabel}>Main Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={handleNavClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className={styles.footerSection}>
          <NavLink to="/" className={styles.secondaryLink}>
            <Home size={20} />
            <span>Public Site</span>
          </NavLink>
          <button
            className={styles.logoutBtn}
            onClick={() => console.log("Logout")}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
