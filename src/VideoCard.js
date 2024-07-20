import React, { useState, useEffect } from "react";
import "./VideoCard.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlaylistAddSharpIcon from "@mui/icons-material/PlaylistAddSharp";
import PlaylistPlaySharpIcon from "@mui/icons-material/PlaylistPlaySharp";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Function to set a cookie value
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
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
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const username = getCookie("user_name");
  const navigate = useNavigate();

  const [showOptions, setShowOptions] = useState(false);
  const [showOptionCreate, setShowOptionCreate] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);

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

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleOptionsCreate = () => {
    setShowOptionCreate(!showOptionCreate);
    // setShowOptions(!showOptions);
  };

  const togglePlaylists = () => {
    setShowPlaylists(!showPlaylists);
    setShowOptionCreate(false); // Close the create playlist form if it's open
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".toggle") === null) {
        setShowOptions(false);
        setShowOptionCreate(false);
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
            setShowOptionCreate(false);
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

  useEffect(() => {
    const playlistInfo = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://insightech.cloud/videotube/api/public/api/fetchplaylist?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Network response was not ok");
        }
        const result = await response.json();
        setAvailablePlaylists(result.playlist);
        console.log("Result:-", result.message);
      } catch (error) {
        if (retryCount > 0) {
          await playlistInfo(retryCount - 1);
        } else {
          console.error(error.message);
        }
      }
    };

    if (token && userId) {
      playlistInfo();
    } else {
      console.error("Missing authentication token or user ID.");
    }
  }, [token, userId]);

  const handlePlaylistToggle = async (playlistId, playlistName) => {
    const requestBody = {
      user_id: userId,
      playlist_id: playlistId,
      playlist_name: playlistName,
      video_id: id,
    };

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/addvideoinplaylist",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(`Video added to playlist: ${playlistName}`);
      } else {
        console.error(`Error adding video to playlist: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding video to playlist:", error);
    }
  };

  return (
    <div className="videoCard">
      <div className="videoCard_img_wrapper" onClick={handleVideoClick}>
        <img src={thumbnail} alt="" className="videoCard_img" />
        <div className="videoCard_duration">{duration}</div>
      </div>
      <div className="videocard_info">
        <div className="video_text_details">
          <div className="videoCard_avatar">
            <img className="" src={channelImage} alt={channel} />
          </div>
          <div className="videoCard_text">
            <h4>{title.length > 25 ? `${title.slice(0, 25)}...` : title}</h4>
            <span>{channel}</span>
            <span>
              {formatViewCount(video_view)} views .{" "}
              {getRelativeTime(upload_time)}
            </span>
          </div>
        </div>

        <div className="video_feature">
          <div className="toggle">
            <MoreVertIcon onClick={toggleOptions} />

            {showOptions && (
              <div className="playlist_options">
                <div className="add_playlist" onClick={togglePlaylists}>
                  <PlaylistPlaySharpIcon className="toggle" />
                  <span>Add to playlist</span>
                </div>
                <div className="create_playlist" onClick={toggleOptionsCreate}>
                  <PlaylistAddSharpIcon />
                  <span>Create playlist</span>
                </div>
                {showPlaylists && (
                  <div className="available_playlists">
                    {availablePlaylists.map((playlist) => (
                      <div key={playlist.Id} className="playlist_item">
                        <input
                          type="checkbox"
                          id={`playlist-${playlist.Id}`}
                          onChange={() =>
                            handlePlaylistToggle(
                              playlist.Id,
                              playlist.playlist_name
                            )
                          }
                        />
                        <label htmlFor={`playlist-${playlist.Id}`}>
                          {playlist.playlist_name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showOptionCreate && (
              <div className="playlist_functions">
                <form onSubmit={handlePlaylistCreate}>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter the playlist name"
                      className="playlist-name-input"
                    />
                  </div>
                  <div>
                    <button type="submit">Create</button>
                  </div>
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
