import React, { useEffect, useState, useRef } from "react";
import "./PlayVideo.css";
import AddComments from "./AddComments";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import PauseSharpIcon from "@mui/icons-material/PauseSharp";
import VolumeUpSharpIcon from "@mui/icons-material/VolumeUpSharp";
import VolumeMuteSharpIcon from "@mui/icons-material/VolumeMuteSharp";
import FullscreenSharpIcon from "@mui/icons-material/FullscreenSharp";
import FullscreenExitSharpIcon from "@mui/icons-material/FullscreenExitSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import BrandingWatermarkSharpIcon from "@mui/icons-material/BrandingWatermarkSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { useVideo } from "./VideoContext";
import { useUser } from "./UserContext";

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

function PlayVideo() {
  const { videoDetails } = useVideo();
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const username = getCookie("user_name");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Mini player
  const videoRef = useRef(null);
  const seekBarRef = useRef(null);
  const miniVideoRef = useRef(null);
  const miniPlayerRef = useRef(null);
  const miniPlayPauseRef = useRef(null);
  const miniSeekBarRef = useRef(null);
  const [isMainPlayerPlaying, setIsMainPlayerPlaying] = useState(false);
  const [isMiniPlayerPlaying, setIsMiniPlayerPlaying] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  //Like and unlike
  const [thumbUpClicked, setThumbUpClicked] = useState(false);
  const [thumbDownClicked, setThumbDownClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  //Comments like and dislike
  const [commentsLikedId, setCommentsLikeId] = useState([]);
  const [commentsDislikedId, setCommentsDisLikeId] = useState([]);

  const [commentThumbUpClicked, setCommentThumbUpClicked] = useState(false);
  const [commentThumbDownClicked, setCommentThumbDownClicked] = useState(false);

  const [commentsUserName, setCommentsUserName] = useState(null);
  const [commentUserId, setCommetUserId] = useState(0);
  const [commentId, setCommentId] = useState(0);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const [commentDislikeCount, setCommentDisLikeCount] = useState(0);

  //Subscribe
  const [subscribed, setSubscribed] = useState(false);

  // const videoId = `?video_id=${videoDetails.id}`;

  console.log(videoDetails.id);

  useEffect(() => {
    console.log(token);
    const videoInfo = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://insightech.cloud/videotube/api/public/api/videoplay?video_id=${videoDetails.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include the bearer token here
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text(); // Get response text for more details
          throw new Error(errorText || "Network response was not ok");
        }
        const result = await response.json();
        console.log("Video Info:", result); // Log the response data
        setData(result);
      } catch (error) {
        if (retryCount > 0) {
          await videoInfo(retryCount - 1);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      videoInfo();
    }
  }, [token, videoDetails.id]);

  // Video player setup
  useEffect(() => {
    const video = document.getElementById("my-video");
    const seekBar = document.getElementById("seek-bar");

    videoRef.current = video;
    seekBarRef.current = seekBar;

    if (video && seekBar) {
      const handlePlayPause = () => {
        if (video.paused) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      };

      const handleMuteUnmute = () => {
        video.muted = !video.muted;
        setIsMuted(video.muted);
      };

      const handleFullScreen = () => {
        if (!document.fullscreenElement) {
          video.requestFullscreen();
          setIsFullscreen(true);
        } else {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      };

      const handleSeekBarInput = () => {
        const duration = video.duration;
        const newTime = (seekBar.value / 100) * duration;
        video.currentTime = newTime;
      };

      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${
          remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
      };

      const updateSeekBar = () => {
        const duration = video.duration;
        if (duration) {
          const value = (video.currentTime / duration) * 100;
          seekBar.value = value;
          seekBar.style.background = `linear-gradient(to right, red ${value}%, #444 ${value}%)`;
          setCurrentTime(formatTime(video.currentTime));
          setDuration(formatTime(duration));
        }
      };

      const handleLoadedMetadata = () => {
        updateSeekBar();
      };

      video.addEventListener("timeupdate", updateSeekBar);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      document
        .getElementById("play-pause")
        .addEventListener("click", handlePlayPause);
      document
        .getElementById("mute-unmute")
        .addEventListener("click", handleMuteUnmute);
      document
        .getElementById("full-screen")
        .addEventListener("click", handleFullScreen);
      seekBar.addEventListener("input", handleSeekBarInput);

      return () => {
        video.removeEventListener("timeupdate", updateSeekBar);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        document
          .getElementById("play-pause")
          .removeEventListener("click", handlePlayPause);
        document
          .getElementById("mute-unmute")
          .removeEventListener("click", handleMuteUnmute);
        document
          .getElementById("full-screen")
          .removeEventListener("click", handleFullScreen);
        seekBar.removeEventListener("input", handleSeekBarInput);
      };
    }
  }, [data, videoDetails.duration]);

  const toggleMiniPlayer = () => {
    const mainVideo = document.getElementById("my-video");

    if (!isMiniPlayer && miniVideoRef.current && mainVideo) {
      miniVideoRef.current.currentTime = mainVideo.currentTime;
      mainVideo.pause();
      miniVideoRef.current.play();
    } else if (isMiniPlayer && miniVideoRef.current && mainVideo) {
      mainVideo.currentTime = miniVideoRef.current.currentTime;
      miniVideoRef.current.pause();
      mainVideo.play();
    }

    setIsMiniPlayer(!isMiniPlayer);
  };

  const handleMainPlayerPlayPause = () => {
    const mainVideo = document.getElementById("my-video");
    const miniVideo = miniVideoRef.current;

    if (mainVideo.paused) {
      mainVideo.play();
      setIsMainPlayerPlaying(true);

      if (!miniVideo.paused) {
        miniVideo.pause();
        setIsMiniPlayerPlaying(false);
      }
    } else {
      mainVideo.pause();
      setIsMainPlayerPlaying(false);
    }
  };

  const handleMiniPlayerPlayPause = () => {
    const miniVideo = miniVideoRef.current;
    const mainVideo = document.getElementById("my-video");

    if (miniVideo.paused) {
      miniVideo.play();
      setIsMiniPlayerPlaying(true);

      if (!mainVideo.paused) {
        mainVideo.pause();
        setIsMainPlayerPlaying(false);
      }
    } else {
      miniVideo.pause();
      setIsMiniPlayerPlaying(false);
    }
  };

  //Like and dislike
  useEffect(() => {
    if (data && data.video) {
      setLikeCount(data.video.likes ?? 0);
      setDislikeCount(data.video.dislikes ?? 0);
      // // setCommentLikeCount(data.video.comments)
      // setThumbUpClicked(data.video.isVideoLike ?? false);
      // setThumbDownClicked(data.video.isVideoDislike ?? false);
    }
  }, [data]);

  const user_id = `&user_id=${userId}`;

  // Function to fetch info
  const videoAllInfo = async (retryCount = 2) => {
    try {
      const response = await fetch(
        `https://insightech.cloud/videotube/api/public/api/videoplay?video_id=${videoDetails.id}&user_id=${userId}`,
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
        console.log(response);
        throw new Error(errorText || "Network response was not ok");
      }
      const result = await response.json();
      setSubscribed(result.video.isSubscribed);
      setThumbUpClicked(result.video.isVideoLike);
      setThumbDownClicked(result.video.isVideoDislike);
    } catch (error) {
      if (retryCount > 0) {
        await videoAllInfo(retryCount - 1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    if (token) {
      setLoading(true);
      videoAllInfo();
    }
  }, [token, videoDetails.id, userId]);

  //Like

  const handleThumbUpClick = () => {
    const newThumbUpState = !thumbUpClicked;

    const requestBody = {
      user_id: userId,
      video_id: videoDetails.id,
      is_like: newThumbUpState,
    };

    console.log("Like:", requestBody);

    fetch(
      "https://insightech.cloud/videotube/api/public/api/videoplayvideolike",
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
          setThumbUpClicked(newThumbUpState);
          setLikeCount(newThumbUpState ? likeCount + 1 : likeCount - 1);

          if (thumbDownClicked) {
            setThumbDownClicked(false);
            setDislikeCount(dislikeCount - 1);
          }

          console.log(data.message);
        } else {
          console.error("Error from like:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error from like:", error);
      });
  };

  //dislike
  const handleThumbDownClick = () => {
    const newThumbDownState = !thumbDownClicked;

    const requestBody = {
      user_id: userId,
      video_id: videoDetails.id,
      is_dislike: newThumbDownState,
    };

    console.log("Dislike:", requestBody);

    fetch(
      "https://insightech.cloud/videotube/api/public/api/videoplayvideodislike",
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
          setThumbDownClicked(newThumbDownState);
          setDislikeCount(
            newThumbDownState ? dislikeCount + 1 : dislikeCount - 1
          );

          if (thumbUpClicked) {
            setThumbUpClicked(false);
            setLikeCount(likeCount - 1);
          }

          console.log(data.message);
        } else {
          console.error("Error from dislike:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error from dislike:", error);
      });
  };

  //Subscribe
  const handleSubscribeClick = () => {
    const newSubscribedState = !subscribed;

    const requestBody = {
      user_id: userId,
      channel_id: data.video.channel_id,
      is_subscribed: newSubscribedState,
    };

    fetch(
      "https://insightech.cloud/videotube/api/public/api/channels/subscribe",
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
          setSubscribed(newSubscribedState);
          console.log(data.message);
        } else {
          console.error("Error subscribing to channel:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error subscribing to channel:", error);
      });
  };

  const buttonStyle = {
    backgroundColor: subscribed ? "#f1ebeb" : "black",
    color: subscribed ? "black" : "#f1ebeb",
  };

  //description

  const [expanded, setExpanded] = useState(false);
  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  //Share
  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: videoDetails.title,
          text: `Check out this video: ${videoDetails.title}`,
          url: `http://localhost:3000/video/${videoDetails.videoUrl}`,
        })
        .then(() => {
          console.log("share successfully");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      console.log("Web Share API not supported");
    }
  };

  //Resolution
  const [selectedResolution, setSelectedResolution] = useState(null);
  const handleResolutionChange = (resolution) => {
    setSelectedResolution(resolution);
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="play-video">
      <div className="video-container">
        {data && data.video && (
          <video id="my-video" ref={videoRef}>
            <source src={data.video.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="controls">
          <input
            type="range"
            id="seek-bar"
            ref={seekBarRef}
            min="0"
            max="100"
          />
          <div className="controls-parts">
            <div className="part-1">
              <button id="play-pause" onClick={handleMainPlayerPlayPause}>
                {isPlaying ? <PauseSharpIcon /> : <PlayArrowSharpIcon />}
              </button>
              <button id="mute-unmute">
                {isMuted ? <VolumeMuteSharpIcon /> : <VolumeUpSharpIcon />}
              </button>
              <p>
                {currentTime} / {duration}
              </p>
            </div>
            <div className="part-2">
              <button id="settings">
                <SettingsSharpIcon />
              </button>
              <button id="mini-player" onClick={toggleMiniPlayer}>
                <BrandingWatermarkSharpIcon />
              </button>
              <button id="full-screen">
                {isFullscreen ? (
                  <FullscreenExitSharpIcon sx={{ fontSize: "27px" }} />
                ) : (
                  <FullscreenSharpIcon sx={{ fontSize: "27px" }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMiniPlayer && (
        <div className="mini-player" ref={miniPlayerRef}>
          <div
            className="mini-video-container"
            id="mini-player"
            ref={miniPlayerRef}
          >
            <video id="mini-video" ref={miniVideoRef}>
              <source src={data.video.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="mini-player-controls">
              <div className="close">
                <button id="mini-close" onClick={toggleMiniPlayer}>
                  <CloseSharpIcon />
                </button>
              </div>
              <div className="play-pass">
                <button
                  id="mini-play-pause"
                  ref={miniPlayPauseRef}
                  onClick={handleMiniPlayerPlayPause}
                >
                  {isPlaying ? <PauseSharpIcon /> : <PlayArrowSharpIcon />}
                </button>
              </div>
              <div className="mini-seek-bar-container">
                <input
                  type="range"
                  id="mini-seek-bar"
                  defaultValue="0"
                  ref={miniSeekBarRef}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {data && data.video && <h3>{data.video.name}</h3>}
      <div className="play-video-info">
        <p>
          {videoDetails.video_view} Views &bull; {videoDetails.upload_time}
        </p>
        <div>
          <span>
            <ThumbUpIcon
              className="img"
              onClick={handleThumbUpClick}
              sx={{ color: thumbUpClicked ? "black" : "gray" }}
            />
            {likeCount}
          </span>
          <span>
            <ThumbDownIcon
              onClick={handleThumbDownClick}
              sx={{ color: thumbDownClicked ? "black" : "gray" }}
              className="img"
            />
            {dislikeCount}
          </span>
          <span>
            <ReplySharpIcon className="img" onClick={handleShareClick} />
          </span>
          <span>
            <MoreHorizSharpIcon className="img" />
          </span>
        </div>
      </div>
      <hr />
      {data && data.video && (
        <div className="publisher">
          <img src={data.video.channel_image} alt={data.video.channel_name} />
          <div>
            <p>{data.video.channel_name}</p>
            <span>{data.video.number_of_channel_subscribers} Subscribers</span>
          </div>
          <button style={buttonStyle} onClick={handleSubscribeClick}>
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      )}
      <div className="vid-description">
        {data && data.video && (
          <div className="description">
            {expanded ? (
              <div>
                <p>{data.video.description}</p>
                <a onClick={toggleDescription}>Show less</a>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: "1rem" }}>
                  {data.video.description.substring(0, 200)}
                </p>
                {data.video.description.length > 200 && (
                  <a onClick={toggleDescription}>..more</a>
                )}
              </div>
            )}
          </div>
        )}
        <hr />
        {data && data.video && (
          <AddComments token={token} userId={userId} videoId={data.video.id} comments={data}/>
        )}
      </div>
    </div>
  );
}

export default PlayVideo;
