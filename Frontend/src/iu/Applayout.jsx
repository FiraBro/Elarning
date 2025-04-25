import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import style from "./Applayout.module.css";
export default function Applayout() {
  return (
    <div className={style.layout}>
      <Sidebar />
      <Outlet />
    </div>
  );
}
