import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./AdminLayout.module.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main
        className={`${styles.content} ${isMobile ? styles.mobileContent : ""}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
