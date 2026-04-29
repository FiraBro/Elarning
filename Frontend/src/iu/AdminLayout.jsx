import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./AdminLayout.module.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      {/* Sidebar handles its own internal mobile logic */}
      <Sidebar />

      <main className={styles.content}>
        {/* The innerContent div acts as a "stage" for your dashboard cards/tables */}
        <div className={styles.innerContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
