import React, { useEffect, useState, useRef } from "react";
import "./PlayVideo.css";
import VideoComments from "./VideoComments";
import MiniPlayer from "./MiniPlayer";
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
import SlowMotionVideoSharpIcon from "@mui/icons-material/SlowMotionVideoSharp";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import AssistantPhotoSharpIcon from "@mui/icons-material/AssistantPhotoSharp";
import DownloadSharpIcon from "@mui/icons-material/DownloadSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
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

function PlayVideo({
  id,
  name,
  video,
  thumbnail,
  video_duration,
  channel_name,
  channel_id,
  channel_image,
  video_view,
  upload_time,
  likes,
  dislikes,
  isSubscribed,
  description,
  subscribers,
  isVideoLike,
  isVideoDislike,
  resolutions,
}) {
  // const { videoDetails } = useVideo();
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const username = getCookie("user_name");
  const video_id = getCookie("video_id");
  const profile_image = getCookie("profile_img");

  const [error, setError] = useState();

  //Main player
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [seekValue, setSeekValue] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  //Mini player
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);

  //Like and unlike
  const [thumbUpClicked, setThumbUpClicked] = useState(isVideoLike);
  const [thumbDownClicked, setThumbDownClicked] = useState(isVideoDislike);
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);

  //description
  const [expanded, setExpanded] = useState(false);

  // Report options
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [successmsg, setSuccessmsg] = useState();

  //Subscribe
  const [subscribed, setSubscribed] = useState(isSubscribed);

  const videoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".show_options") === null) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  //Vide play and pass
  const handlePlayPauseClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.playbackRate = playbackSpeed; // Set playback rate
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Video mute and unmute
  const handleMuteUnmuteClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle time update and seek bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setCurrentTime(formatTime(current));
      setSeekValue((current / duration) * 100);
    }
  };

  const handleSeekChange = (event) => {
    if (videoRef.current) {
      const newTime = (event.target.value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setSeekValue(event.target.value);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  }, [videoRef.current?.duration]);

  // Quality Selector Logic
  const handleQualityChange = (event) => {
    const newQuality = event.target.value;
    setSelectedQuality(newQuality);

    if (videoRef.current) {
      const wasPlaying = !videoRef.current.paused; // Check if the video was playing

      const handleLoadedData = () => {
        if (wasPlaying) {
          videoRef.current.play();
          setIsPlaying(true);
        }
        videoRef.current.removeEventListener("loadeddata", handleLoadedData); // Clean up the event listener
      };

      // Pause the video, change the source, and then wait for the video to load
      videoRef.current.pause();
      videoRef.current.src = newQuality || video;
      videoRef.current.load(); // Load the new video source
      videoRef.current.addEventListener("loadeddata", handleLoadedData);
    }
  };

  // Video download function
  const handleDownloadClick = () => {
    const downloadUrl = selectedQuality || video;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${name}.mp4`; // Set a default file name, adjust as needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloading(false); // Update state to indicate download is complete or not
  };

  //Video full screen
  const handleFullScreen = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      if (!document.fullscreenElement) {
        videoElement
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch((err) => {
            console.error("Error entering fullscreen mode:", err);
          });
      } else {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch((err) => {
            console.error("Error exiting fullscreen mode:", err);
          });
      }
    }
  };

  // Mini Player
  const handleMiniPlayerToggle = () => {
    setIsMiniPlayer(!isMiniPlayer);
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(!isPlaying);
    }

    console.log("Current duration:- ", videoRef.current.duration);
  };

  const handleMiniPlayerClose = () => {
    setIsMiniPlayer(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
  };

  //Video share

  const handleShareClick = () => {
    const videoUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: name,
          text: "Check out this video!",
          url: videoUrl,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing", error));
    }
  };

  //Like

  const handleThumbUpClick = () => {
    const newThumbUpState = !thumbUpClicked;

    const requestBody = {
      user_id: userId,
      video_id: video_id,
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
      video_id: video_id,
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
      channel_id: channel_id,
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
  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  // Report video
  const handleReportClick = () => {
    setIsReportOpen(!isReportOpen);

    fetch("https://insightech.cloud/videotube/api/public/api/report-reasons", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setReasons(data.reasons);
        } else {
          console.error("Error by showing report:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error by showing report:", error);
      });
  };

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleRadioChange = (event) => {
    setSelectedReason(event.target.value);
    console.log("Value:-", event.target.value);
  };

  const handleReportSubmit = () => {
    const requestBody = {
      user_id: userId,
      video_id: id,
      reason: selectedReason,
    };

    console.log("request Body:-", requestBody);

    fetch("https://insightech.cloud/videotube/api/public/api/report", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data.message);
          setSuccessmsg(data.message);
        } else {
          console.error("Error by submit report:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error by submit report:", error);
      });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="play-video">
      <div className="video-container">
        <video
          id="my-video"
          className="main-video"
          width="100%"
          ref={videoRef}
          poster={thumbnail}
          src={selectedQuality || video}
          type="video/mp4"
          onError={(e) => console.error("Video error:", e)}
          onTimeUpdate={handleTimeUpdate}
          playbackRate={playbackSpeed}
        ></video>

        {showOptions && (
          <div className="show_options">
            <h6>Report video</h6>
            {reasons.map((reason, index) => (
              <div className="options" key={index}>
                <input
                  type="radio"
                  id={`reason${index}`}
                  value={reason}
                  name="reportReason"
                  checked={selectedReason === reason}
                  onChange={handleRadioChange}
                />
                <label htmlFor={`reason${index}`}>{reason}</label>
              </div>
            ))}
            {successmsg && <p className="report_success_msg">{successmsg}</p>}

            <div className="report_btn">
              <button className="cancel" onClick={() => setSelectedReason("")}>
                Cancel
              </button>
              <button className="submit" onClick={handleReportSubmit}>
                Submit
              </button>
            </div>
          </div>
        )}

        <div className="controls">
          <input
            type="range"
            id="seek-bar"
            min="0"
            max="100"
            value={seekValue}
            onChange={handleSeekChange}
            style={{
              background: `linear-gradient(to right, red ${
                playbackSpeed * 100
              }%, #444 ${playbackSpeed * 100}%)`,
            }}
          />
          <div className="controls-parts">
            <div className="part-1">
              <button id="play-pause" onClick={handlePlayPauseClick}>
                {isPlaying ? <PauseSharpIcon /> : <PlayArrowSharpIcon />}
              </button>
              <button id="mute-unmute" onClick={handleMuteUnmuteClick}>
                {isMuted ? <VolumeMuteSharpIcon /> : <VolumeUpSharpIcon />}
              </button>
              {currentTime} / {duration}
            </div>
            <div className="part-2">
              <button id="settings" onClick={toggleSettings}>
                <SettingsSharpIcon />
              </button>
              <button id="mini-player" onClick={handleMiniPlayerToggle}>
                <BrandingWatermarkSharpIcon />
              </button>
              <button id="full-screen" onClick={handleFullScreen}>
                {isFullscreen ? (
                  <FullscreenSharpIcon sx={{ fontSize: "27px" }} />
                ) : (
                  <FullscreenExitSharpIcon sx={{ fontSize: "27px" }} />
                )}
              </button>
            </div>
          </div>
          {isMiniPlayer && (
            <MiniPlayer
              mainPlayerRef={videoRef}
              videoSrc={selectedQuality || video}
              thumbnail={thumbnail}
              onClose={handleMiniPlayerClose}
              mainCurrentTime={videoRef.current.currentTime}
            />
          )}
          {isSettingsOpen && (
            <div className="settings-menu">
              <div className="settings-item">
                <div className="play_fun">
                  <SlowMotionVideoSharpIcon />
                  <label htmlFor="playback-speed"> Speed:</label>
                </div>
                <select
                  value={playbackSpeed}
                  onChange={(e) => {
                    setPlaybackSpeed(parseFloat(e.target.value));
                    if (videoRef.current) {
                      videoRef.current.playbackRate = parseFloat(
                        e.target.value
                      );
                    }
                  }}
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>
              <div className="settings-item">
                <div className="play_fun">
                  <TuneSharpIcon />
                  <label htmlFor="quality">Quality:</label>
                </div>
                <select value={selectedQuality} onChange={handleQualityChange}>
                  <option value="">Auto</option>
                  {resolutions.map((resolution) => (
                    <option
                      key={resolution.id}
                      value={resolution.resolution_url}
                    >
                      {resolution.resolution}
                    </option>
                  ))}
                </select>
              </div>
              <div className="settings-item">
                <div className="play_fun">
                  <DownloadSharpIcon />
                  <button
                    onClick={handleDownloadClick}
                    disabled={isDownloading}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <h3>{name}</h3>
      <div className="play-video-info">
        <p>
          {formatViewCount(video_view)} Views &bull;{" "}
          {getRelativeTime(upload_time)}
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
            <MoreHorizSharpIcon className="img" onClick={handleReportClick} />
          </span>
        </div>
        {isReportOpen && (
          <div
            className="report_options"
            style={{ cursor: "pointer" }}
            onClick={handleShowOptions}
          >
            <AssistantPhotoSharpIcon />
            <span>Report</span>
          </div>
        )}
      </div>
      <hr />
      <div className="publisher">
        <img src={channel_image} alt={channel_name}/>
        <div>
          <p>{channel_name}</p>
          <span>{subscribers} Subscribers</span>
        </div>
        <button style={buttonStyle} onClick={handleSubscribeClick}>
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      <div className="vid-description">
        <div className="description">
          {expanded ? (
            <div>
              <p>{description}</p>
              <a onClick={toggleDescription}>Show less</a>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "1rem" }}>
                {description.substring(0, 200)}
              </p>
              {description.length > 200 && (
                <a onClick={toggleDescription}>..more</a>
              )}
            </div>
          )}
        </div>

        <hr />

        <VideoComments
          token={token}
          userId={userId}
          videoId={video_id}
          username={username}
          profile_image={profile_image}
        />
      </div>
    </div>
  );
}

export default PlayVideo;
