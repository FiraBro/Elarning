import React from "react";
import style from "./overview.module.css";
// import demo from "../../public/demo.jpg";
export default function Overview() {
  return (
    <div className={style.overview}>
      <div className="">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa numquam
          maxime, iusto exercitationem dicta culpa minus est voluptatem
          temporibus autem. Numquam et excepturi eveniet quidem laboriosam amet,
          libero tempora culpa?
        </p>
      </div>
      <div className="">
        <img src='/demo.jpg' alt="demo" width={400} height={200} />
      </div>
    </div>
  );
}
