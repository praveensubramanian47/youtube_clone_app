import React, { useState, useRef } from "react";
import "./ShortCard.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentSharpIcon from "@mui/icons-material/CommentSharp";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import Avatar from "@mui/material/Avatar";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

function ShortCard({
  thumb,
  video,
  title,
  channel,
  channelImage,
  like,
  comment,
}) {
  // Like and unlike
  const [thumbUpClicked, setThumbUpClicked] = useState(false);
  const [thumbDownClicked, setThumbDownClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(like) || 0);

  const handleThumbUpClick = () => {
    if (thumbUpClicked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
      if (thumbDownClicked) {
        setThumbDownClicked(false);
      }
    }
    setThumbUpClicked(!thumbUpClicked);
  };

  const handleThumbDownClick = () => {
    if (thumbDownClicked) {
      setThumbDownClicked(false);
    } else {
      if (thumbUpClicked) {
        setLikeCount(likeCount - 1);
        setThumbUpClicked(false);
      }
      setThumbDownClicked(true);
    }
  };

  // Subscribe
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribeClick = () => {
    setSubscribed(!subscribed);
  };
  const buttonStyle = {
    backgroundColor: subscribed ? "rgba(0,0,0.3,0.6)" : "#ffffff",
    color: subscribed ? "#ffffff" : "black",
  };

  //Comments toggle

  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="ShortCard">
      <div className="shorts-container">
        <div className="shorts-video">
          <video className="centered-video" src={video} poster={thumb}></video>
          <div className="video-title">
            <div className="channel_details">
              <Avatar
                className="videoCard_avatar"
                alt={channel}
                src={channelImage}
                sx={{ width: 30, height: 30 }}
              />
              <p>{channel}</p>
              <button
                className="shorts_btn"
                style={buttonStyle}
                onClick={handleSubscribeClick}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
            <div className="shorts_desc">
              <p>{title}</p>
            </div>
          </div>
        </div>

        <div className="shorts_icons">
          <div
            className="icon"
            onClick={handleThumbUpClick}
            style={{
              backgroundColor: thumbUpClicked ? "black" : "lightgray",
              color: thumbUpClicked ? "white" : "black",
            }}
          >
            <ThumbUpIcon />
          </div>
          <p>{likeCount}</p>

          <div
            className="icon"
            onClick={handleThumbDownClick}
            style={{
              backgroundColor: thumbDownClicked ? "black" : "lightgray",
              color: thumbDownClicked ? "white" : "black",
            }}
          >
            <ThumbDownIcon />
          </div>
          <p className="style_p">Dislike</p>

          <div className="icon" onClick={toggleOptions}>
            <CommentSharpIcon />
            {showOptions && (
              <div className="short-comments">
                <div className="comments-header">
                  <h4>
                    Comments <span>88</span>
                  </h4>
                  <CloseSharpIcon />
                </div>
                <div className="comment-info">
                  <div className="cmd-img">
                    <img
                      src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
                      alt=""
                    />
                  </div>
                  <div className="cmd-details">
                    <p>
                      User_1<span> . 1 day ago</span>
                    </p>
                    <p className="cmd">This is cool</p>
                    <div className="shortcmd-action">
                      <ThumbUpIcon
                        className="shortaction"
                        sx={{ fontSize: "1rem" }}
                      />
                      <span>687</span>
                      <ThumbDownIcon
                        className="shortaction"
                        sx={{ fontSize: "1rem" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="comment-info">
                  <div className="cmd-img">
                    <img
                      src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
                      alt=""
                    />
                  </div>
                  <div className="cmd-details">
                    <p>
                      User_1<span> . 1 day ago</span>
                    </p>
                    <p className="cmd">This is cool</p>
                    <div className="shortcmd-action">
                      <ThumbUpIcon
                        className="shortaction"
                        sx={{ fontSize: "1rem" }}
                      />
                      <span>687</span>
                      <ThumbDownIcon
                        className="shortaction"
                        sx={{ fontSize: "1rem" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="comment-info">
                  <div className="cmd-img">
                    <img
                      src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
                      alt=""
                    />
                  </div>
                  <div className="cmd-details">
                    <p>
                      User_1<span> . 1 day ago</span>
                    </p>
                    <p className="cmd">This is superb</p>
                    <div className="shortcmd-action">
                      <ThumbUpIcon
                        className="shortaction"
                        sx={{ fontSize: "1rem" }}
                      />
                      <span>687</span>
                      <ThumbDownIcon
                        className="shortaction"
                        sx={{ fontSize: "1rem" }}
                      />
                    </div>
                  </div>
                </div>
                

                <div className="add-shortscomment" onClick={(event) => event.stopPropagation()}>
                  <div className="shorts-cmd">
                    <div>
                      <img src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' alt=' '/>
                    </div>
                    <div>
                      <input type='text' placeholder="Add a commetn.." />
                      <hr />
                    </div>                  
                  </div>
                  <div className="shorts-btns">
                    <button className="short-btn1">
                      Cancel
                    </button>
                    <button className="short-btn2">
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p>{comment}</p>

          <div className="icon">
            <ReplySharpIcon />
          </div>
          <p className="style_p">Share</p>

          <div className="icon">
            <MoreVertSharpIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortCard;
