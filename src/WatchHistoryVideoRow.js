import React from "react";
import "./WatchHistoryVideoRow.css";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import Tooltip from "@mui/material/Tooltip";
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

function WatchHistoryVideoRow({
  id,
  video,
  views,
  description,
  duration,
  channel,
  title,
  image,
  userId,
  token,
  removeVideoFromState,
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

  const handleVideoClick = () => {
    setCookie("video_id", id, 1);
    navigate(`/video/${encodeURIComponent(video)}`);
  };

  const removeVideoFromHistory = async () => {
    const requestBody = {
      user_id: userId,
      video_id: id,
    };

    console.log("requestBody:-", requestBody);

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/history/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message);
      }

      const result = await response.json();
      console.log("Response from histroy:-", result.message);

      // Update parent component's state to remove the deleted video
      removeVideoFromState(id);
    } catch (error) {
      console.error("Failed to remove video from history:", error);
    }
  };

  return (
    <div className="WatchHistoryVideoRow">
      <div className="watchHistory_img_wrapper">
        <img src={image} alt="" onClick={handleVideoClick} />
        <div className="watchHistory_video_duration">{duration}</div>
      </div>
      <div className="watchHistory_video_text">
        <h3>{title}</h3>
        <p className="watchHistory_video_headline">
          {channel} • {formatViewCount(views)} views
        </p>
        <p className="watchHistory_video_description">
          {description.length > 130
            ? `${description.slice(0, 130)}...`
            : description}
        </p>
      </div>
      <div className="close_icon_wrapper">
        <Tooltip title="Remove from watch history">
          <CloseSharpIcon onClick={removeVideoFromHistory} />
        </Tooltip>
      </div>
    </div>
  );
}

export default WatchHistoryVideoRow;
