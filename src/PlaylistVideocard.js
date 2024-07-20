import React from 'react'
import "./PlaylistVideocard.css"
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

function PlaylistVideocard({id, name, video, thumbnail, duration, channel_name, channel_image, video_viewer, upload_time}) {

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
    <div className="PlaylistVideocard">
      <div className="videoCard_img_wrapper"  onClick={handleVideoClick}>
        <img src={thumbnail} alt="" className="videoCard_img" />
        <div className="videoCard_duration">{duration}</div>
      </div>
      <div className='playlist_video_text'>
        <h3>{name}</h3>
        <p className='playlist_video_details'>
            {channel_name} . {formatViewCount(video_viewer)} views . {getRelativeTime(upload_time)}
        </p>
      </div>
    </div>
  )
}

export default PlaylistVideocard
