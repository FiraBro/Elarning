// import React from "react";
// import Sidebar from "../components/Sidebar";
// import { Outlet } from "react-router-dom";
// import style from "./Applayout.module.css";
// export default function Applayout() {
//   return (
//     <div className={style.layout}>
//       <Sidebar />
//       <Outlet />
//     </div>
//   );
// }

import React from "react";
import Sidebar from "../components/Sidebar";
import styles from "./AdminLayout.module.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className={styles.layout}>
    <Sidebar />
    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
