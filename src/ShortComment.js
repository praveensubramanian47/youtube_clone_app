import React, { useEffect, useState } from "react";
import "./ShortComment.css";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function ShortComment({
  token,
  userId,
  count,
  onClose,
  commentLength,
  shortId,
  username,
}) {
  const [comment, setComment] = useState([]);
  const [likedShortCommentIds, setLikedShortCommentIds] = useState([]);
  const [dislikedShortCommentIds, setDislikedShortCommentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Change the time format.
  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }

  useEffect(() => {
    const requestBody = {
      user_id: userId,
    };
    const shortInfo = async (retryCount = 3) => {
      try {
        const response = await fetch(
          "https://insightech.cloud/videotube/api/public/api/shortsfetch",
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
        setComment(result.data[count].comments);

        // Set Short liked comments ids
        const shortLikedCommentIdsArray = result.data[count].comments
          .filter((comment) => comment.isLiked)
          .map((comment) => comment.id);
        setLikedShortCommentIds(shortLikedCommentIdsArray);

        // Set Short Disliked comments ids
        const shortDislikedCommentIdsArray = result.data[count].comments
          .filter((comment) => comment.isDisliked)
          .map((comment) => comment.id);
        setDislikedShortCommentIds(shortDislikedCommentIdsArray);
      } catch (error) {
        if (retryCount > 0) {
          await shortInfo(retryCount - 1);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      shortInfo();
    }
  }, [token, userId]);

  useEffect(() => {
    console.log("Liked ID's:-", likedShortCommentIds);
    console.log("Disliked ID's:-", dislikedShortCommentIds);
  }, [likedShortCommentIds, dislikedShortCommentIds]);

  //Add new comments
  const handleShortAddComment = async () => {
    const inputElement = document.querySelector(".shorts-cmd input");
    const commentText = inputElement.value.trim();

    if (commentText !== "") {
      const requestBody = {
        shorts_id: shortId,
        user_name: username,
        comment: commentText,
        profile_image:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
      };

      console.log(requestBody);

      try {
        const response = await fetch(
          "https://insightech.cloud/videotube/api/public/api/shortscommentscreate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("All data:-", data);
          console.log("Comment Id:-",data.id);
          if (data.code === 200) {
            const newComment = {
              id: data.data.id,
              comment: data.data.comment,
              user_name: data.data.user_name,
              profile_image: data.data.profile_image,
              like: 0,
              dislike: 0,
              upload_time: data.data.upload_time,
            };
            setComment([...comment, newComment]);
            inputElement.value = ""; // Clear the input field after adding the comment
          } else {
            console.error("Error from comment else:", data.message);
          }
        } else {
          console.error("Error from comment catch:", await response.text());
        }
      } catch (error) {
        console.error("Error from comment catch:", error);
      }
    }
  };

  //Comments like
  const handleShortCommentThumbUp = async (comment, event) => {
    event.stopPropagation(); // Prevent closing the tab
    const isAlreadyLiked = likedShortCommentIds.includes(comment.id);
    const requestBody = {
      comment_id: comment.id,
      user_id: userId,
      is_like: !isAlreadyLiked,
    };

    console.log(requestBody);

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/shortscommentslike",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      const result = await response.json();
      if (result.code === 200) {
        setComment((prevComments) =>
          prevComments.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  isLiked: !isAlreadyLiked,
                  like: !isAlreadyLiked ? c.like + 1 : c.like - 1,
                  isDisliked: false,
                  dislike: c.isDisliked ? c.dislike - 1 : c.dislike,
                }
              : c
          )
        );

        if (!isAlreadyLiked) {
          setLikedShortCommentIds((prevIds) => [...prevIds, comment.id]);
        } else {
          setLikedShortCommentIds((prevIds) =>
            prevIds.filter((id) => id !== comment.id)
          );
        }
      } else {
        console.error("Error from like:", result.message);
      }
    } catch (error) {
      console.error("Error from like:", error);
    }
  };

  const handleShortCommentThumbDown = async (comment, event) => {
    event.stopPropagation(); // Prevent closing the tab
    const isAlreadyDisliked = dislikedShortCommentIds.includes(comment.id);
    const requestBody = {
      comment_id: comment.id,
      user_id: userId,
      is_dislike: !isAlreadyDisliked,
    };

    console.log(requestBody);

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/shortscommentsdislike",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      const result = await response.json();
      if (result.code === 200) {
        setComment((prevComments) =>
          prevComments.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  isDisliked: !isAlreadyDisliked,
                  dislike: !isAlreadyDisliked ? c.dislike + 1 : c.dislike - 1,
                  isLiked: false,
                  like: c.isLiked ? c.like - 1 : c.like,
                }
              : c
          )
        );

        if (!isAlreadyDisliked) {
          setDislikedShortCommentIds((prevIds) => [...prevIds, comment.id]);
        } else {
          setDislikedShortCommentIds((prevIds) =>
            prevIds.filter((id) => id !== comment.id)
          );
        }
      } else {
        console.error("Error from dislike:", result.message);
      }
    } catch (error) {
      console.error("Error from dislike:", error);
    }
  };

  return (
    <div className="ShortComment">
      <div className="short-comments">
        <div className="comments-header">
          <h4>
            Comments <span>{commentLength}</span>
          </h4>
          <CloseSharpIcon onClick={onClose} /> {/* Add onClick to close */}
        </div>
        {comment.map((comment, index) => (
          <div className="comment-info" key={index}>
            <div className="cmd-img">
              <img src={comment.profile_image} alt={comment.user_name} />
            </div>
            <div className="cmd-details">
              <p>
                {comment.user_name}
                <span> . {getRelativeTime(comment.upload_time)}</span>
              </p>
              <p className="cmd">{comment.comment}</p>
              <div className="shortcmd-action">
                <ThumbUpIcon
                  onClick={(event) => handleShortCommentThumbUp(comment, event)}
                  className="shortaction"
                  sx={{
                    fontSize: "1rem",
                    color: likedShortCommentIds.includes(comment.id)
                      ? "black"
                      : "gray",
                  }}
                />
                <span>{comment.like}</span>
                <ThumbDownIcon
                  onClick={(event) =>
                    handleShortCommentThumbDown(comment, event)
                  }
                  className="shortaction"
                  sx={{
                    fontSize: "1rem",
                    color: dislikedShortCommentIds.includes(comment.id)
                      ? "black"
                      : "gray",
                  }}
                />
                <span>{comment.dislike}</span>
              </div>
            </div>
          </div>
        ))}

        <div
          className="add-shortscomment"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="shorts-cmd">
            <div>
              <img
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
                alt=" "
              />
            </div>
            <div>
              <input type="text" placeholder="Add a comment.." />
              <hr />
            </div>
          </div>
          <div className="shorts-btns">
            <button className="short-btn1">Cancel</button>
            <button className="short-btn2" onClick={handleShortAddComment}>Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortComment;
