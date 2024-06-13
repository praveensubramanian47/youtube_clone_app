import React, { useState, useEffect } from "react";
import "./VideoCard.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlaylistAddSharpIcon from "@mui/icons-material/PlaylistAddSharp";
import PlaylistPlaySharpIcon from "@mui/icons-material/PlaylistPlaySharp";
import { useNavigate } from "react-router-dom";
import { useVideo } from "./VideoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function VideoCard({
  id,
  thumbnail,
  video,
  title,
  channel,
  video_view,
  channelImage,
  upload_time,
  duration,
}) {
  const token = getCookie('token');
  const userId = getCookie('user_id');
  const username = getCookie('user_name');
  const navigate = useNavigate();
  const { setVideoDetails } = useVideo();
  const [showOptions, setShowOptions] = useState(false);
  const [showOptionCreate, setShowOptionsCreate] = useState(false);

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
    setVideoDetails({
      id,
      videoUrl: encodeURIComponent(video),
      upload_time: getRelativeTime(upload_time),
      video_view: formatViewCount(video_view),
      duration,
    });
    navigate(`/video/${encodeURIComponent(video)}`);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleOptionsCreate = () => {
    setShowOptionsCreate(!showOptionCreate);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".toggle") === null) {
        setShowOptions(false);
        setShowOptionsCreate(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handlePlaylistCreate = (e) => {
    e.preventDefault(); // Add this line to prevent the default form submission behavior

    const playlistNameInput = document.querySelector(
      ".playlist_functions input"
    );
    const playlistName = playlistNameInput.value.trim();

    if (playlistName) {
      const requestBody = {
        user_id: userId,
        user_name: username,
        playlist_name: playlistName,
      };

      console.log("create playlist:", requestBody);

      fetch(
        "https://insightech.cloud/videotube/api/public/api/createplaylist",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.message);
            playlistNameInput.value = "";
            setShowOptionsCreate(false);
          } else {
            console.log("Error from create playlist:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error from create playlist:", error);
        });
    } else {
      console.log("Playlist name cannot be empty");
    }
  };

  return (
    <div className="videoCard">
      <div className="videoCard_img_wrapper" onClick={handleVideoClick}>
        <img src={thumbnail} alt="" className="videoCard_img" />
        <div className="videoCard_duration">{duration}</div>
      </div>
      <div className="videocard_info">
        <div className="videoCard_avatar">
          <img className="" src={channelImage} alt={channel} />
        </div>

        <div className="videoCard_text">
          <h4>{title.length > 2 ? `${title.slice(0, 25)}...` : title}</h4>
          <p>{channel}</p>
          <p>
            {formatViewCount(video_view)} views . {getRelativeTime(upload_time)}
          </p>
        </div>

        <div className="video_feature">
          <div className="toggle">
            <MoreVertIcon onClick={toggleOptions} />

            {showOptions && (
              <div className="playlist_options">
                <div className="add_playlist">
                  <PlaylistPlaySharpIcon className="toggle" />
                  <span>Add to playlist</span>
                </div>
                <div className="create_playlist" onClick={toggleOptionsCreate}>
                  <PlaylistAddSharpIcon />
                  <span>Create playlist</span>
                </div>
              </div>
            )}

            {showOptionCreate && (
              <div className="playlist_functions">
                <form onSubmit={handlePlaylistCreate}>
                  <input
                    type="text"
                    placeholder="Enter the playlist name"
                    className="playlist-name-input"
                  />
                  <button type="submit">Create</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
