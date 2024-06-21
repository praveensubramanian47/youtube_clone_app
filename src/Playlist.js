import React, { useEffect, useState } from "react";
import "./Playlist.css";
import { Link } from "react-router-dom";
import PlaylistPlaySharpIcon from "@mui/icons-material/PlaylistPlaySharp";
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

  const token = getCookie("token");
  const userId = getCookie("user_id");


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

  //Time function like YouTube
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
      <h1>Playlists</h1>
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
              <div className="details">
                <h4>{item.playlist_name}</h4>
                <p>Private . Playlist</p>
                <p>Updated {getRelativeTime(item.upload_time)}</p>
                <Link to={"/playlistvideos"}>
                  <p
                    onClick={() =>
                      handleViewFullPlaylist(item.Id, item.playlist_name)
                    }>
                    View full playlist
                  </p>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Playlist;
