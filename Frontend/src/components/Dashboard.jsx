import React from 'react'
import style from './Dashboard.module.css'
export default function Dashboard() {
  return (
    <div className={style.dashboard}>
      <div className={style.head}>
        <h1>Dashboard</h1>
      </div>
      <div className={style.revenueTotal}>
        <div className={style.total}>Total Student:5</div>
        <div className={style.revenue}>Total Revenue:100</div>
      </div>
      <div className={style.studentList}>
        <div className={style.studentListHeadOne}>Student List</div>
        <div className={style.studentListHeadTwo}>
          <div className="">Course Name</div>
          <div className="">Student Name</div>
          <div className="">Student Email</div>
        </div>
        <div className=""></div>
      </div>
    </div>
  )
}
