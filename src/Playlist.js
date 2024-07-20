import React, { useEffect, useState } from "react";
import "./Playlist.css";
import { Link } from "react-router-dom";
import PlaylistPlaySharpIcon from "@mui/icons-material/PlaylistPlaySharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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

function Playlist() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlaylistNames, setEditedPlaylistNames] = useState({});
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const token = getCookie("token");
  const userId = getCookie("user_id");
  const user_name = getCookie("user_name");

  const toggleOptions = (playlistId) => {
    if (activePlaylistId === playlistId && showOptions) {
      setShowOptions(false); // Close options if already open
    } else {
      setShowOptions(true); // Open options
      setActivePlaylistId(playlistId);
      setIsEditing(false); // Reset editing state
    }
  };

  const handleEditClick = (playlistId) => {
    toggleOptions(playlistId); // Close options when editing
    setIsEditing(playlistId); // Set editing mode
    setNewPlaylistName(editedPlaylistNames[playlistId] || ""); // Load current name for editing
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
        setData(result);
      } catch (error) {
        if (retryCount > 0) {
          await playlistInfo(retryCount - 1);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      playlistInfo();
    } else {
      setError("Missing authentication token or user ID.");
      setLoading(false);
    }
  }, [token, userId]);

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/playlist/delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlist_id: playlistId, user_id: userId }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Network response was not ok");
      }
      setData((prevData) =>
        prevData.playlist.filter((item) => item.Id !== playlistId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditPlaylist = async (playlistId) => {
    const requestBody = {
      playlist_id: playlistId,
      user_id: userId,
      user_name: user_name,
      playlist_name: newPlaylistName,
    };

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/playlists/edit",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Network response was not ok");
      }
      const updatedPlaylist = await response.json();
      setEditedPlaylistNames((prevNames) => ({
        ...prevNames,
        [playlistId]: newPlaylistName,
      }));
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      setError(error.message);
    }
  };

  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }

  const handleViewFullPlaylist = (id, name) => {
    setCookie("playlist_id", id, 1);
    setCookie("playlist_name", name, 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="Playlist">
      <h3>Playlists</h3>
      <div className="playlist">
        {data &&
          data.playlist.map((item) => (
            <div className="lists" key={item.Id}>
              <div className="playlist_img">
                <img src={item.playlist_thumbnail} alt={item.playlist_name} />
                <div className="total_videos">
                  <PlaylistPlaySharpIcon sx={{ fontSize: "1rem" }} />
                  <p>{item.video_count} videos</p>
                </div>
              </div>
              <div className="detail">
                <div className="details">
                  {isEditing === item.Id ? (
                    <input
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onBlur={() => handleEditPlaylist(item.Id)}
                    />
                  ) : (
                    <h4>
                      {editedPlaylistNames[item.Id] || item.playlist_name}
                    </h4>
                  )}
                  <span>{item.is_watch_later ? "Watch Later" : "Private . Playlist"}</span>
                  <span>Updated {getRelativeTime(item.upload_time)}</span>
                  <Link
                    to={`/playlistvideo/${item.playlist_name}`}
                    className="link_style"
                    onClick={() => handleViewFullPlaylist(item.Id, item.playlist_name)}
                  >
                    <span style={{ textDecoration: "none" }}>View full playlist</span>
                  </Link>
                </div>
                {!item.is_watch_later && (
                  <div className="playlist_feature">
                    <div className="toggle">
                      <MoreVertIcon onClick={() => toggleOptions(item.Id)} />
                      {showOptions && activePlaylistId === item.Id && (
                        <div className="playlist_function">
                          <div className="delete" onClick={() => handleDeletePlaylist(item.Id)}>
                            <DeleteSharpIcon />
                            <span>Delete</span>
                          </div>
                          <div className="edit" onClick={() => handleEditClick(item.Id)}>
                            <EditSharpIcon />
                            <span>Edit</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Playlist;
