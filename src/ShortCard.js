import React, { useState, useEffect } from "react";
import "./ShortCard.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentSharpIcon from "@mui/icons-material/CommentSharp";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import Avatar from "@mui/material/Avatar";
import ShortComment from "./ShortComment";

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

function ShortCard({
  id,
  description,
  video_url,
  title,
  thumb,
  channelImage,
  like,
  dislike,
  isLiked,
  isDisLiked,
  commentLen,
  count,
}) {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const username = getCookie("user_name");

  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);
  // Like and unlike
  const [thumbUpClicked, setThumbUpClicked] = useState(false);
  const [thumbDownClicked, setThumbDownClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);


  useEffect(() => {
    setThumbDownClicked(isDisLiked);
    setThumbUpClicked(isLiked);
    setLikeCount(like);
    setDislikeCount(dislike);
  }, [token, id]);


  //Store the short for play list.
  const shortIdInfo = async (retryCount = 2) => {
    const requestBody = {
      shorts_id: id,
      is_short_add: true,
      user_id: parseInt(userId, 10)
    };

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/fetch-shorts-details",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
      console.log("Shorts detail response :-", result.message);
    } catch (error) {
      if (retryCount > 0) {
        await shortIdInfo(retryCount - 1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      shortIdInfo();
    }
  }, [token, id]);

  //Like
  const handleThumbUpClick = () => {
    const newThumbUpState = !thumbUpClicked;

    const requestBody = {
      user_id: userId,
      shorts_id: id,
      is_liked: newThumbUpState,
    };

    console.log("Like:", requestBody);

    fetch("https://insightech.cloud/videotube/api/public/api/shortslike", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
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
      shorts_id: id,
      is_disliked: newThumbDownState,
    };

    console.log("Dislike:", requestBody);

    fetch("https://insightech.cloud/videotube/api/public/api/shortsdislike", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
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

  //description

  const [expanded, setExpanded] = useState(false);
  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  //Comments toggle
  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`comment-container ${showOptions ? "open" : ""}`}>
      <div className="shorts-container">
        <div className="shorts-video">
          <video className="centered-video" src={video_url} autoPlay loop/>
          <div className="video-title">
            <div className="channel_details">
              <Avatar
                className="videoCard_avatar"
                alt=""
                src={channelImage}
                sx={{ width: 30, height: 30 }}
              />
              <p className="title">{description}</p>
            </div>

            <div className="shorts_desc">
              <div className="description">
                <p>{title}</p>
                <a onClick={toggleDescription}>Show less</a>
              </div>
            </div>
          </div>
        </div>

        <div className="shorts_icons">
          <div
            className="icon"
            onClick={handleThumbUpClick}
            style={{
              backgroundColor: thumbUpClicked ? "white" : " rgba(0, 0, 0, 0.7)",
              color: thumbUpClicked ? "black" : "white",
            }}
          >
            <ThumbUpIcon />
          </div>
          <p>{likeCount}</p>

          <div
            className="icon"
            onClick={handleThumbDownClick}
            style={{
              backgroundColor: thumbDownClicked
                ? "white"
                : " rgba(0, 0, 0, 0.7)",
              color: thumbDownClicked ? "black" : "white",
            }}
          >
            <ThumbDownIcon />
          </div>
          <p>{dislikeCount}</p>

          {/* comments */}
          <div className="icon" onClick={toggleOptions}>
            <CommentSharpIcon />
          </div>
          <p>{commentLen}</p>

          <div className="icon">
            <ReplySharpIcon />
          </div>
          <p className="style_p">Share</p>

          <div className="icon">
            <MoreVertSharpIcon />
          </div>
        </div>
      </div>
      <div className={`comment-container ${showOptions ? "open" : ""}`}>
        {showOptions && (
          <ShortComment
            token={token}
            userId={userId}
            shortId={id}
            username={username}
            count={count}
            commentLength={commentLen}
          />
        )}
      </div>
    </div>
  );
}

export default ShortCard;