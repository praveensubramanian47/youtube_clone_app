import React, { useState, useEffect } from "react";
import "./PlayListVideos.css";
import PlaylistVideocard from "./PlaylistVideocard";
import PlaylistShortcard from "./PlaylistShortcard";
import DownloadSharpIcon from "@mui/icons-material/DownloadSharp";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import ShuffleSharpIcon from "@mui/icons-material/ShuffleSharp";
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

function PlayListVideos() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getCookie("token");
  const userId = getCookie("user_id");
  const username = getCookie("user_name");
  const playlist_id = getCookie("playlist_id");
  const playlist_name = getCookie("playlist_name");

  const [selectedTab, setSelectedTab] = useState("Videos");

  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  //Fetched all video and shorts in the playlist.
  useEffect(() => {
    const fetchVideos = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://insightech.cloud/videotube/api/public/api/fetchvideofromparticularplaylist?user_id=${userId}&playlist_id=${playlist_id}&playlist_name=${playlist_name}`,
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
        console.log("playlist:-", result);
        setData(result);
      } catch (error) {
        if (retryCount > 0) {
          await fetchVideos(retryCount - 1);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && userId && playlist_name && playlist_name) {
      fetchVideos();
      // console.log("videos:-",data.videos);
    } else {
      setError(
        "Missing authentication token or user ID or playlist name or id."
      );
      setLoading(false);
    }
  }, [token, userId, playlist_name, playlist_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="PlayListVideos">
      {data && (
        <div className="playlist_left">
          <div className="container">
            <div className="img">
              <img src={data.playlist_thumbnail} alt="" />
            </div>
            <h3>{playlist_name}</h3>
            <div className="details">
              <h6>{username}</h6>
              <p>
                {data.total_videos} Vidoes views Last updated on {getRelativeTime(data.upload_time)}
              </p>
            </div>
            <div className="icons">
              <div className="download">
                <DownloadSharpIcon />
              </div>
              <div className="more">
                <MoreVertSharpIcon />
              </div>
            </div>
            <div className="playlist_btns">
              <div className="play_all">
                <PlayArrowSharpIcon />
                <span>Play all</span>
              </div>
              <div className="shuffle">
                <ShuffleSharpIcon />
                <span>shuffle</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="playlist_right">
        <div className="tabs">
          <span
            className={`tab ${selectedTab === "Videos" ? "active" : ""}`}
            onClick={() => handleTabClick("Videos")}
          >
            Videos
          </span>
          <span
            className={`tab ${selectedTab === "Shorts" ? "active" : ""}`}
            onClick={() => handleTabClick("Shorts")}
          >
            Shorts
          </span>
        </div>

        <div
          className={`tab_content ${
            selectedTab === "Videos" ? "video_content" : "shorts_content"
          }`}
        >
          {selectedTab === "Videos" ? (
            <>
              {data.videos.map((video) => (
              <PlaylistVideocard
                key={video.id}
                id={video.id}
                name={video.name}
                video={video.video_url}
                thumbnail={video.thumbnail_url}
                duration={video.duration}
                channel_name={video.channel_name}
                channel_image={video.channel_image}
                video_viewer={video.video_viewer}
                upload_time={video.upload_time}
              />
              ))}
            </>
          ) : (
            <>
              <div className="short_card">
                <PlaylistShortcard title="How to use Linked in properly and want to return into that playlist api" />
              </div>
              <div className="short_card">
                <PlaylistShortcard title="How to use Linked in properly and want to return into that playlist api" />
              </div>
              <div className="short_card">
                <PlaylistShortcard title="How to use Linked in properly and want to return into that playlist api" />
              </div>
              <div className="short_card">
                <PlaylistShortcard title="How to use Linked in properly and want to return into that playlist api" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayListVideos;
