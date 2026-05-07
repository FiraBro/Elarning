import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <main className={styles.contentGrow}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
