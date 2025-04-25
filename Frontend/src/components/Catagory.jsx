import React from 'react'
import style from './catagory.module.css'
export default function Catagory() {
  return (
    <div className={style.catagory}>
      <p>Discover variety of courses and start learning!</p>
      <div className={style.browseCourse}>
        <button className={style.browseBtn}>Browse Course</button>
        <button className={style.startLearning}>Start Learning</button>
      </div>
    </div>
  )
}
