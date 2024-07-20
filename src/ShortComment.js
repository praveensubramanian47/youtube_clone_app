import React, { useEffect, useState } from "react";
import "./ShortComment.css";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
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

function ShortComment({
  token,
  userId,
  count,
  onClose,
  commentLength,
  shortId,
  username,
}) {
  const profile_image = getCookie("profile_img");

  const [comments, setComments] = useState([]);
  const [likedShortCommentIds, setLikedShortCommentIds] = useState([]);
  const [dislikedShortCommentIds, setDislikedShortCommentIds] = useState([]);
  const [likedReplyIds, setLikedReplyIds] = useState([]);
  const [dislikedReplyIds, setDislikedReplyIds] = useState([]);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [visibleReplyInputs, setVisibleReplyInputs] = useState({});
  const [replyText, setReplyText] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }

  useEffect(() => {
    const requestBody = {
      user_id: userId,
    };
    const fetchShortInfo = async (retryCount = 3) => {
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
        setComments(result.data[count].comments);

        const likedIds = result.data[count].comments
          .filter((comment) => comment.isLiked)
          .map((comment) => comment.id);
        setLikedShortCommentIds(likedIds);

        const dislikedIds = result.data[count].comments
          .filter((comment) => comment.isDisliked)
          .map((comment) => comment.id);
        setDislikedShortCommentIds(dislikedIds);

        const likedReplyIdsArray = result.data[count].comments
          .flatMaP((comment) => comment.replies)
          .filter((reply) => reply.isLiked)
          .map((reply) => reply.id);
        setLikedReplyIds(likedReplyIdsArray);

        const dislikedReplyIdsArray = result.data[count].comments
          .flatMaP((comment) => comment.replies)
          .filter((reply) => reply.isDisliked)
          .map((reply) => reply.id);
        setDislikedReplyIds(dislikedReplyIdsArray);
      } catch (error) {
        if (retryCount > 0) {
          await fetchShortInfo(retryCount - 1);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchShortInfo();
    }
  }, [token, userId, count]);

  useEffect(() => {
    console.log("Liked Comment Ids:", likedShortCommentIds);
    console.log("Disliked Comment Ids:", dislikedShortCommentIds);
    console.log("Liked Reply Ids:", likedReplyIds);
    console.log("Disliked Reply Ids:", dislikedReplyIds);
  }, [
    likedShortCommentIds,
    dislikedShortCommentIds,
    likedReplyIds,
    dislikedReplyIds,
  ]);

  const handleShortAddComment = async () => {
    const inputElement = document.querySelector(".shorts-cmd input");
    const commentText = inputElement.value.trim();

    if (commentText !== "") {
      const requestBody = {
        shorts_id: shortId,
        user_name: username,
        comment: commentText,
        profile_image: profile_image,
      };

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
          if (data.code === 200) {
            const newComment = {
              id: data.data.id,
              comment: data.data.comment,
              user_name: data.data.user_name,
              profile_image: data.data.profile_image,
              like: 0,
              dislike: 0,
              upload_time: data.data.upload_time,
              replies: [], // Initialize replies array
            };
            setComments([...comments, newComment]);
            inputElement.value = ""; // Clear the input field after adding the comment
          } else {
            console.error("Error:", data.message);
          }
        } else {
          console.error("Error:", await response.text());
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  //Replies toggle
  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  //reply input
  const handleShowReplyInput = (commentId) => {
    setVisibleReplyInputs({
      ...visibleReplyInputs,
      [commentId]: true,
    });
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText((prevReplyText) => ({
      ...prevReplyText,
      [commentId]: text,
    }));
  };

  const handleAddReply = async (commentId) => {
    const requestBody = {
      shorts_id: shortId,
      comment_id: commentId,
      comment: replyText[commentId], // Using replyText state for the reply content
      user_name: username,
      profile_image: profile_image,
    };

    console.log("requestBody from reply:- ", requestBody);

    if (replyText[commentId]?.trim() !== "") {
      try {
        const response = await fetch(
          "https://insightech.cloud/videotube/api/public/api/shorts/comment/reply",
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

          console.log("data from reply comment:- ", data);
          if (data.code === 200) {
            const newReply = {
              id: data.id, // Assuming the response includes the new reply ID
              comment: replyText[commentId],
              user_name: username,
              profile_image: profile_image,
              like: 0,
              dislike: 0,
            };
            setComments((prevComments) =>
              prevComments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, replies: [...comment.replies, newReply] }
                  : comment
              )
            );
            setReplyText((prevReplyText) => ({
              ...prevReplyText,
              [commentId]: "", // Clear reply input after successful submission
            }));

            setVisibleReplyInputs((prevVisibleReplyInputs) => ({
              ...prevVisibleReplyInputs,
              [commentId]: false, // Hide reply input after successful submission
            }));

            console.log("comments:-", comments);
          } else {
            console.error("Error from reply else:", data.message);
          }
        } else {
          console.error("Error from reply catch:", await response.text());
        }
      } catch (error) {
        console.error("Error from reply catch:", error);
      }
    }
  };

  const handleCancelReply = (commentId) => {
    // setVisibleReplyInputs(false);
    setReplyText((prevReplyText) => ({
      ...prevReplyText,
      [commentId]: "", // Clear reply input for specific comment
    }));
  };

  const handleShortCommentThumbUp = async (comment, isReply = false) => {
    const isAlreadyLiked = isReply
      ? likedReplyIds.includes(comment.id)
      : likedShortCommentIds.includes(comment.id);
    const requestBody = {
      comment_id: comment.id,
      user_id: userId,
      is_like: !isAlreadyLiked,
    };

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

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Liked") {
          if (isReply) {
            setLikedReplyIds((prevLikedIds) => [...prevLikedIds, comment.id]);
            setDislikedReplyIds((prevDislikedIds) =>
              prevDislikedIds.filter((id) => id !== comment.id)
            );
          } else {
            setLikedShortCommentIds((prevLikedIds) => [
              ...prevLikedIds,
              comment.id,
            ]);
            setDislikedShortCommentIds((prevDislikedIds) =>
              prevDislikedIds.filter((id) => id !== comment.id)
            );
          }
        } else if (data.message === "Unliked") {
          if (isReply) {
            setLikedReplyIds((prevLikedIds) =>
              prevLikedIds.filter((id) => id !== comment.id)
            );
          } else {
            setLikedShortCommentIds((prevLikedIds) =>
              prevLikedIds.filter((id) => id !== comment.id)
            );
          }
        }
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleShortCommentThumbDown = async (comment, isReply = false) => {
    const isAlreadyDisliked = isReply
      ? dislikedReplyIds.includes(comment.id)
      : dislikedShortCommentIds.includes(comment.id);
    const requestBody = {
      comment_id: comment.id,
      user_id: userId,
      is_dislike: !isAlreadyDisliked,
    };

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

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Disliked") {
          if (isReply) {
            setDislikedReplyIds((prevDislikedIds) => [
              ...prevDislikedIds,
              comment.id,
            ]);
            setLikedReplyIds((prevLikedIds) =>
              prevLikedIds.filter((id) => id !== comment.id)
            );
          } else {
            setDislikedShortCommentIds((prevDislikedIds) => [
              ...prevDislikedIds,
              comment.id,
            ]);
            setLikedShortCommentIds((prevLikedIds) =>
              prevLikedIds.filter((id) => id !== comment.id)
            );
          }
        } else if (data.message === "Undisliked") {
          if (isReply) {
            setDislikedReplyIds((prevDislikedIds) =>
              prevDislikedIds.filter((id) => id !== comment.id)
            );
          } else {
            setDislikedShortCommentIds((prevDislikedIds) =>
              prevDislikedIds.filter((id) => id !== comment.id)
            );
          }
        }
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="ShortComment">
      <div className="short-comments">
        <div className="comments-header">
          <h4>
            Comments <span>{commentLength}</span>
          </h4>
          <CloseSharpIcon onClick={onClose} />
        </div>
        {comments.map((comment) => (
          <div className="comment-info" key={comment.id}>
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
                  onClick={() => handleShortCommentThumbUp(comment)}
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
                  onClick={() => handleShortCommentThumbDown(comment)}
                  className="shortaction"
                  sx={{
                    fontSize: "1rem",
                    color: dislikedShortCommentIds.includes(comment.id)
                      ? "black"
                      : "gray",
                  }}
                />
                <span>{comment.dislike}</span>

                <div
                  className="cmd-reply-part"
                  onClick={() => handleShowReplyInput(comment.id)}
                >
                  <p>Reply</p>
                </div>
              </div>
              {visibleReplyInputs[comment.id] && (
                <div className="short-add-reply">
                  <input
                    id={`reply-input-${comment.id}`}
                    type="text"
                    placeholder="Add a public reply"
                    value={replyText[comment.id] || ""}
                    onChange={(e) =>
                      handleReplyChange(comment.id, e.target.value)
                    }
                  />
                  <hr />
                  <div className="shorts-cmd-btns">
                    <button
                      className="shorts-cmd-btn1"
                      onClick={() => handleCancelReply(comment.id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="shorts-cmd-btn2"
                      onClick={() => handleAddReply(comment.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
              <div className="shorts-cmd-reply">
                <p onClick={() => toggleReplies(comment.id)}>Replies</p>
              </div>
              {visibleReplies[comment.id] && (
                <div className="shorts-replies-section">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="replys">
                      <div className="cmd-headers">
                        <img src={reply.profile_image} alt={reply.user_name} />
                        <div className="shorts-cmd-info">
                          <p className="user-info">
                            {reply.user_name}
                            <span> . {getRelativeTime(reply.upload_time)}</span>
                          </p>
                          <p>{reply.comment}</p>
                          <div className="comment-action">
                            <ThumbUpIcon
                              onClick={() =>
                                handleShortCommentThumbUp(reply, true)
                              }
                              className="action"
                              sx={{
                                color: likedReplyIds.includes(reply.id)
                                  ? "black"
                                  : "gray",
                                fontSize: "18px",
                              }}
                            />
                            {reply.like}
                            <ThumbDownIcon
                              onClick={() =>
                                handleShortCommentThumbDown(reply, true)
                              }
                              className="action"
                              sx={{
                                color: dislikedReplyIds.includes(reply.id)
                                  ? "black"
                                  : "gray",
                                fontSize: "18px",
                              }}
                            />
                            {reply.dislike}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div
          className="add-shortscomment"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="shorts-cmd">
            <div>
              <img src={profile_image} alt={username} />
            </div>
            <div className="shorts-cmd-input">
              <input type="text" placeholder="Add a comment.." />
              <hr />
            </div>
          </div>
          <div className="shorts-btns">
            <button className="short-btn1">Cancel</button>
            <button className="short-btn2" onClick={handleShortAddComment}>
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortComment;
