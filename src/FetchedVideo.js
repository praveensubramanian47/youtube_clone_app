import React from "react";
import "./FetchedVideo.css";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useVideo } from "./VideoContext";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function FetchedVideo({
  id,
  title,
  video,
  thumbnail,
  duration,
  channel,
  channelImage,
  video_view,
  upload_time,
}) {
  const navigate = useNavigate();
  const { setVideoDetails } = useVideo();

  //Viwes function
  function formatViewCount(viewCount) {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`;
    } else {
      return viewCount.toString();
    }
  }

  //Time function like youtube
  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }

  const handleVideoClick = () => {
    setCookie("video_id", id, 1);
    navigate(`/video/${encodeURIComponent(video)}`);
  };
  
  return (
    <div className="FetchedVideo">
      <div className="side-video-list">
        <div className="FetchedVideo_img_wrapper"  onClick={handleVideoClick}>
          <img src={thumbnail} alt="" className="Fetchedvideo_img"/>
          <div className="FetchedVideo_duration">{duration}</div>
        </div>
        <div className="vid-info">
          <h4>{title.length > 45 ? `${title.slice(0, 45)}...` : title}</h4>
          <p>{channel}</p>
          <p className="views_style">
            {formatViewCount(video_view)} viwes . {getRelativeTime(upload_time)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FetchedVideo;
