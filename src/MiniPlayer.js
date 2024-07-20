import React, { useRef, useState, useEffect } from "react";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import PauseSharpIcon from "@mui/icons-material/PauseSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import "./MiniPlayer.css";

const MiniPlayer = ({
  video,
  thumbnail,
  onClose,
  mainPlayerRef,
  mainCurrentTime,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePlayPauseClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    const duration = video.duration;
    setCurrentTime(formatTime(current));

    if (!isNaN(duration)) {
      setSeekValue((current / duration) * 100);
    }
  };

  const handleSeekChange = (event) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (event.target.value / 100) * video.duration;
    video.currentTime = newTime;
    setSeekValue(event.target.value);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && Number.isFinite(mainCurrentTime)) {
      video.currentTime = mainCurrentTime;
    }
  }, [mainCurrentTime]);

  return (
    <div className="mini-player">
      <video
        ref={videoRef}
        src={video}
        poster={thumbnail}
        type="video/mp4"
        onTimeUpdate={handleTimeUpdate}
        className="mini-video"
      ></video>
      <button className="close-button" onClick={onClose}>
        <CloseSharpIcon />
      </button>
      <div className="center-controls" onClick={handlePlayPauseClick}>
        {isPlaying ? (
          <PauseSharpIcon fontSize="large" />
        ) : (
          <PlayArrowSharpIcon fontSize="large" />
        )}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={isNaN(seekValue) ? 0 : seekValue}
        onChange={handleSeekChange}
        className="mini-seek-bar"
      />
    </div>
  );
};

export default MiniPlayer;
