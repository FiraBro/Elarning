import React from "react";
import ReactPlayer from "react-player";
import styles from "./VideoPlayer.module.css";

const VideoPlayer = ({ url }) => (
  <div className={styles.playerContainer}>
    <ReactPlayer
      url={url}
      controls
      width="100%"
      height="100%"
      style={{ borderRadius: "10px", overflow: "hidden" }}
    />
  </div>
);

export default VideoPlayer;
