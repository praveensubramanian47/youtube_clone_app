import React from "react";
import "./VideoRow.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
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

function VideoRow({
  id,
  video,
  views,
  subs,
  description,
  duration,
  timestamp,
  channel,
  title,
  image,
}) {
  const navigate = useNavigate();

  function formatViewCount(viewCount) {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`;
    } else {
      return viewCount.toString();
    }
  }

  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }

  const handleVideoClick = () => {
    setCookie("video_id", id, 1);
    navigate(`/video/${encodeURIComponent(video)}`);
  };

  return (
    <div className="videoRow">
      <div className="videoRow_img_wrapper">
        <img src={image} alt="" onClick={handleVideoClick} />
        <div className="videoRow_duration">{duration}</div>
      </div>
      <div className="videoRow_text">
        <h5>{title.length > 25 ? `${title.slice(0, 40)}...` : title}</h5>
        <p className="videoRow_headline">
          {channel} . <span className="videoRow_sub">{subs}</span> Subscribers{" "}
          {formatViewCount(views)} views . {getRelativeTime(timestamp)}
        </p>

        {/* <p className="video_desc">{description.length > 25 ? `${title.slice(0, 150)}...`: description}</p> */}
      </div>
    </div>
  );
}

export default VideoRow;
