import React from "react";
import style from "./GlobalError.module.css";
import { useNavigate } from "react-router-dom";
export default function GlobalError() {
  const navigate = useNavigate();
  return (
    <div className={style.global}>
      <div>This page is not Found(404)</div>
      <button onClick={() => navigate("/")}>Back To Home</button>
    </div>
  );
}
