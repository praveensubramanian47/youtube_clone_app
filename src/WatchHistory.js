import React, { useState, useEffect, useRef } from "react";
import "./WatchHistory.css";
import ShortsRow from "./ShortsRow";
import WatchHistoryVideoRow from "./WatchHistoryVideoRow";
import WhatshotSharpIcon from "@mui/icons-material/WhatshotSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import PauseIcon from "@mui/icons-material/Pause";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CommentIcon from "@mui/icons-material/Comment";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowLeftSharpIcon from "@mui/icons-material/KeyboardArrowLeftSharp";
import KeyboardArrowRightSharpIcon from "@mui/icons-material/KeyboardArrowRightSharp";
import { useNavigate } from "react-router-dom";

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

function WatchHistory() {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const navigate = useNavigate();

  const shortsContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `https://insightech.cloud/videotube/api/public/api/history?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error Response Text:", errorText);
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message);
      }

      const result = await response.json();
      setData(result.history);
      console.log("Response:", result.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token, userId]);

  const scrollLeft = () => {
    if (shortsContainerRef.current) {
      setCount(count - 1);
      shortsContainerRef.current.scrollBy({
        left: -200, // Adjust this value to scroll more or less
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (shortsContainerRef.current) {
      setCount(count + 1);

      shortsContainerRef.current.scrollBy({
        left: 200, // Adjust this value to scroll more or less
        behavior: "smooth",
      });
    }
  };

  const removeVideoFromState = (videoId) => {
    setData((prevData) =>
      prevData.map((dayHistory) => ({
        ...dayHistory,
        videos: dayHistory.videos
          ? dayHistory.videos.filter((video) => video.id !== videoId)
          : [],
      }))
    );
  };

  const handleShortClick = (shorts) => {
    localStorage.setItem('shorts_details', JSON.stringify(shorts));
    navigate("/shorts");
  };

  return (
    <div className="WatchHistory">
      <div className="main-content">
        <h2>Watch history</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          data.map((dayHistory) => (
            <div key={dayHistory.day} className="watch_history_container">
              <h4 className="day">{dayHistory.day}</h4>
              <div className="watch_shorts">
                <WhatshotSharpIcon />
                <h5>Shorts</h5>
              </div>
              {dayHistory.shorts && (
                <div className="shorts_controls">
                  <KeyboardArrowLeftSharpIcon
                    className="scrollButton"
                    onClick={scrollLeft}
                  />
                  <div ref={shortsContainerRef} className="shorts_section">
                    {dayHistory.shorts
                      .slice(count, count + 3)
                      .map((short) => (
                        <div
                          key={short.id}
                          className="short"
                          onClick={() => handleShortClick(dayHistory.shorts)}
                        >
                          {short.type === "shorts" && (
                            <ShortsRow
                              views="24"
                              title={short.name}
                              image={short.thumbnail_url}
                              timestamp={new Date(
                                short.watch_time
                              ).toLocaleString()}
                              channel={short.channel_name}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                  <KeyboardArrowRightSharpIcon
                    className="scrollButton"
                    onClick={scrollRight}
                  />
                </div>
              )}
              <hr />
              {dayHistory.videos &&
                dayHistory.videos.map((video) => (
                  <div key={video.id} className="video_row">
                    {video.type === "video" && (
                      <WatchHistoryVideoRow
                        id={video.id}
                        views={video.video_view}
                        title={video.name}
                        description={video.description}
                        video={video.video_url}
                        image={video.thumbnail_url}
                        timestamp={new Date(video.watch_time).toLocaleString()}
                        channel={video.channel_name}
                        duration={video.duration}
                        userId={userId}
                        token={token}
                        removeVideoFromState={removeVideoFromState}
                      />
                    )}
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
      <div className="right-side-options">
        <div className="search-watch-history">
          <SearchIcon />
          <input type="text" placeholder="Search watch history" />
        </div>
        <hr />
        <div className="history-options">
          <button onClick={scrollLeft}>
            <DeleteSharpIcon />
            Clear all watch history
          </button>
          <button onClick={scrollRight}>
            <PauseIcon />
            Pass watch history
          </button>
          <button>
            <ManageAccountsIcon />
            Manage all history
          </button>
          <div className="manage-options">
            <button>
              <CommentIcon />
              Comments
            </button>
            <button>
              <PostAddIcon />
              Posts
            </button>
            <button>
              <LiveTvIcon />
              Live chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
