import React, { useState, useEffect } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import "./VideoComments.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function VideoComments({ token, userId, videoId, username, profile_image }) {
  const [comments, setComments] = useState([]);
  const [likedCommentIds, setLikedCommentIds] = useState([]);
  const [dislikedCommentIds, setDislikedCommentIds] = useState([]);
  const [likedReplyIds, setLikedReplyIds] = useState([]);
  const [dislikedReplyIds, setDislikedReplyIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [visibleReplyInputs, setVisibleReplyInputs] = useState({});
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});

  console.log("video id:-", videoId);

  useEffect(() => {
    const videoInfo = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://insightech.cloud/videotube/api/public/api/videoplay?video_id=${videoId}&user_id=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text(); // Get response text for more details
          throw new Error(errorText || "Network response was not ok");
        }
        const result = await response.json();
        const comments = result.video.comments || []; // Add a fallback for comments array

        // Set liked comment ids
        const likedCommentIdsArray = comments
          .filter((comment) => comment.isLiked)
          .map((comment) => comment.id);
        setLikedCommentIds(likedCommentIdsArray);

        // Set disliked comment ids
        const dislikedCommentIdsArray = comments
          .filter((comment) => comment.isDisLiked)
          .map((comment) => comment.id);
        setDislikedCommentIds(dislikedCommentIdsArray);

        // Set liked reply ids
        const likedReplyIdsArray = comments
          .flatMap((comment) => comment.replies)
          .filter((reply) => reply.isLiked)
          .map((reply) => reply.id);
        setLikedReplyIds(likedReplyIdsArray);

        // Set disliked reply ids
        const dislikedReplyIdsArray = comments
          .flatMap((comment) => comment.replies)
          .filter((reply) => reply.isDisLiked)
          .map((reply) => reply.id);
        setDislikedReplyIds(dislikedReplyIdsArray);

        setComments(comments); // Ensure comments are set
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
  }, [token, videoId, userId]);

  
  useEffect(() => {
    console.log("Liked Comment Ids:", likedCommentIds);
    console.log("Disliked Comment Ids:", dislikedCommentIds);
    console.log("Liked Reply Ids:", likedReplyIds);
    console.log("Disliked Reply Ids:", dislikedReplyIds);
  }, [likedCommentIds, dislikedCommentIds, likedReplyIds, dislikedReplyIds]);

  // Add new comments
  const handleAddComment = async () => {
    const requestBody = {
      video_id: videoId,
      comment: commentText,
      user_name: username,
      user_id: userId,
      profile_image: profile_image,
    };

    console.log(requestBody);

    if (commentText.trim() !== "") {
      try {
        const response = await fetch(
          "https://insightech.cloud/videotube/api/public/api/videoplaycomments",
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
          console.log(data.message);
          if (data.code === 200) {
            const newComment = {
              id: data.comment.comment_id, // Assuming the response includes the new comment ID
              comment: data.comment.comment,
              user_name: data.comment.user_name,
              profile_image: profile_image,
              likes: 0,
              dislikes: 0,
              replies: [], // Initialize an empty replies array
            };
            setComments([...comments, newComment]);
            setCommentText(""); // Clear comment text after adding
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

  const handleAddReply = async (commentId) => {
    const requestBody = {
      video_id: videoId,
      comment_id: commentId,
      reply: replyText[commentId], // Using replyText state for the reply content
      user_name: username,
      user_id: userId,
      profile_image: profile_image,
    };

    console.log("requestBody from reply:- ", requestBody);

    if (replyText[commentId]?.trim() !== "") {
      try {
        const response = await fetch(
          "https://insightech.cloud/videotube/api/public/api/reply-to-comment",
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
            const newReply = {
              id: data.reply.reply_id, // Assuming the response includes the new reply ID
              comment: replyText[commentId],
              user_name: data.reply.user_name,
              profile_image: profile_image,
              likes: 0,
              dislikes: 0,
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

  const handleCancelComment = () => {
    setCommentText(""); // Clear comment/reply text on cancel
  };

  const handleCancelReply = (commentId) => {
    // Clear the reply text and hide the reply input for the specific comment
    setReplyText((prevReplyText) => ({
      ...prevReplyText,
      [commentId]: "", // Clear reply input for specific comment
    }));
    
    setVisibleReplyInputs((prevVisibleReplyInputs) => ({
      ...prevVisibleReplyInputs,
      [commentId]: false, // Hide the reply input for specific comment
    }));
  };
  

  const handleThumbUp = async (item, isReply = false) => {
    const isAlreadyLiked = isReply
      ? likedReplyIds.includes(item.id)
      : likedCommentIds.includes(item.id);
    const requestBody = {
      comment_id: item.id,
      user_id: userId,
      user_name: username,
      is_like: !isAlreadyLiked,
    };

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/videoplaycommentslike",
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
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === item.id
              ? {
                  ...comment,
                  isLiked: !isAlreadyLiked,
                  likes: !isAlreadyLiked
                    ? comment.likes + 1
                    : comment.likes - 1,
                  isDisLiked: false,
                  dislikes: comment.isDisLiked
                    ? comment.dislikes - 1
                    : comment.dislikes,
                }
              : {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === item.id
                      ? {
                          ...reply,
                          isLiked: !isAlreadyLiked,
                          likes: !isAlreadyLiked
                            ? reply.likes + 1
                            : reply.likes - 1,
                          isDisLiked: false,
                          dislikes: reply.isDisLiked
                            ? reply.dislikes - 1
                            : reply.dislikes,
                        }
                      : reply
                  ),
                }
          )
        );

        if (isReply) {
          if (!isAlreadyLiked) {
            setLikedReplyIds((prevIds) => [...prevIds, item.id]);
          } else {
            setLikedReplyIds((prevIds) =>
              prevIds.filter((replyId) => replyId !== item.id)
            );
          }

          setDislikedReplyIds((prevIds) =>
            prevIds.filter((replyId) => replyId !== item.id)
          );
        } else {
          if (!isAlreadyLiked) {
            setLikedCommentIds((prevIds) => [...prevIds, item.id]);
          } else {
            setLikedCommentIds((prevIds) =>
              prevIds.filter((commentId) => commentId !== item.id)
            );
          }

          setDislikedCommentIds((prevIds) =>
            prevIds.filter((commentId) => commentId !== item.id)
          );
        }
      } else {
        console.error("Failed to update like status:", result.message);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleThumbDown = async (item, isReply = false) => {
    const isAlreadyDisliked = isReply
      ? dislikedReplyIds.includes(item.id)
      : dislikedCommentIds.includes(item.id);
    const requestBody = {
      comment_id: item.id,
      user_id: userId,
      user_name: username,
      is_dislike: !isAlreadyDisliked,
    };

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/videoplaycommentsdislike",
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
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === item.id
              ? {
                  ...comment,
                  isLiked: false,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes,
                  isDisLiked: !isAlreadyDisliked,
                  dislikes: !isAlreadyDisliked
                    ? comment.dislikes + 1
                    : comment.dislikes - 1,
                }
              : {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === item.id
                      ? {
                          ...reply,
                          isLiked: false,
                          likes: reply.isLiked ? reply.likes - 1 : reply.likes,
                          isDisLiked: !isAlreadyDisliked,
                          dislikes: !isAlreadyDisliked
                            ? reply.dislikes + 1
                            : reply.dislikes - 1,
                        }
                      : reply
                  ),
                }
          )
        );

        if (isReply) {
          if (!isAlreadyDisliked) {
            setDislikedReplyIds((prevIds) => [...prevIds, item.id]);
          } else {
            setDislikedReplyIds((prevIds) =>
              prevIds.filter((replyId) => replyId !== item.id)
            );
          }

          setLikedReplyIds((prevIds) =>
            prevIds.filter((replyId) => replyId !== item.id)
          );
        } else {
          if (!isAlreadyDisliked) {
            setDislikedCommentIds((prevIds) => [...prevIds, item.id]);
          } else {
            setDislikedCommentIds((prevIds) =>
              prevIds.filter((commentId) => commentId !== item.id)
            );
          }

          setLikedCommentIds((prevIds) =>
            prevIds.filter((commentId) => commentId !== item.id)
          );
        }
      } else {
        console.error("Failed to update dislike status:", result.message);
      }
    } catch (error) {
      console.error("Error updating dislike status:", error);
    }
  };

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

  const handleChange = (event) => {
    setCommentText(event.target.value); // Update comment/reply text
  };

  const toggleReplies = (commentId) => {
    setVisibleReplies((prevVisibleReplies) => ({
      ...prevVisibleReplies,
      [commentId]: !prevVisibleReplies[commentId],
    }));
  };

  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="addComments">
      <div className="comment">
        <h4>{comments.length} Comments</h4>
        <div className="comment">
          {comments.length > 0 && comments.map((comment, index) => (
            <div key={index} className="cmd">
              <div className="cmd-header">
                <img src={comment.profile_image} alt={comment.user_name} />
                <h3>
                  {comment.user_name} . 
                  <span style={{color: "gray", fontSize: "13px", marginLeft: "2px"}}>{getRelativeTime(comment.upload_time)}</span>
                </h3>
              </div>
              <p>{comment.comment}</p>
              <div className="comment-action">
                <ThumbUpIcon
                  onClick={() => handleThumbUp(comment)}
                  className="action"
                  sx={{
                    color: likedCommentIds.includes(comment.id)
                      ? "black"
                      : "gray",
                  }}
                />
                {comment.likes}

                <ThumbDownIcon
                  onClick={() => handleThumbDown(comment)}
                  className="action"
                  sx={{
                    color: dislikedCommentIds.includes(comment.id)
                      ? "black"
                      : "gray",
                  }}
                />
                {comment.dislikes}
                <div
                  className="reply"
                  onClick={() => handleShowReplyInput(comment.id)}
                >
                  <p>Reply</p>
                </div>
              </div>

              {visibleReplyInputs[comment.id] && (
                <div className="add-reply">
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
                  <div className="cmd_btns">
                    <button
                      className="reply_btn1"
                      onClick={() => handleCancelReply(comment.id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="reply_btn2"
                      onClick={() => handleAddReply(comment.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Display the new reply directly below the comment */}
              {comment.newReply && (
                <div className="new-reply">
                  <div className="cmd-header">
                    <img
                      src={comment.newReply.profile_image}
                      alt={comment.newReply.user_name}
                    />
                    <h3>
                      {comment.newReply.user_name}
                      <span> Just now</span>
                    </h3>
                  </div>
                  <p>{comment.newReply.comment}</p>
                  <div className="comment-action">
                    <ThumbUpIcon className="action" sx={{ color: "gray" }} />
                    {comment.newReply.likes}
                    <ThumbDownIcon className="action" sx={{ color: "gray" }} />
                    {comment.newReply.dislikes}
                  </div>
                </div>
              )}

              <div className="cmd_reply">
                <p onClick={() => toggleReplies(comment.id)}>Replies</p>
              </div>
              {visibleReplies[comment.id] && (
                <div className="replies-section">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="reply">
                      <div className="cmd-header">
                        <img src={reply.profile_image} alt={reply.user_name} />
                        <h3>
                          {reply.user_name} . 
                          <span style={{color: "gray", fontSize: "12px", marginLeft: "2px"}}>{getRelativeTime(reply.upload_time)}</span>
                        </h3>
                      </div>
                      <p>{reply.comment}</p>
                      <div className="comment-action">
                        <ThumbUpIcon
                          onClick={() => handleThumbUp(reply, true)}
                          className="action"
                          sx={{
                            color: likedReplyIds.includes(reply.id)
                              ? "black"
                              : "gray",
                            fontSize: "18px",
                          }}
                        />
                        {reply.likes}
                        <ThumbDownIcon
                          onClick={() => handleThumbDown(reply, true)}
                          className="action"
                          sx={{
                            color: dislikedReplyIds.includes(reply.id)
                              ? "black"
                              : "gray",
                            fontSize: "18px",
                          }}
                        />
                        {reply.dislikes}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment.."
          value={commentText}
          onChange={handleChange}
        />
        <hr />
        <div className="cmd_btns">
          <button className="btn1" onClick={handleCancelComment}>
            Cancel
          </button>
          <button className="btn2" onClick={handleAddComment}>
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoComments;
