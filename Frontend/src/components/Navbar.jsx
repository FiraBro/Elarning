import React from "react";
import { FaBookOpen } from "react-icons/fa";
import style from "./Navbar.module.css";

// Logo component displaying the open book icon
function Logo() {
  return <FaBookOpen size={48} color="green" cursor='pointer' />;
}

export default function Navbar() {
  return (
    <div className={style.navbar}>
      <div className={style.left}>
        <Logo />
      </div>
      <div className={style.right}>
        <button className={style.myCourse}>MyCourse</button>
        <button className={style.authentication}>Login</button>
      </div>
    </div>
  );
}
