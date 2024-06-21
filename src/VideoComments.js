import React, { useState, useEffect } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useVideo } from "./VideoContext";
import "./VideoComments.css";

function VideoComments({ token, userId, videoId, username }) {
  const [comments, setComments] = useState([]);
  const [likedCommentIds, setLikedCommentIds] = useState([]);
  const [dislikedCommentIds, setDislikedCommentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { videoDetails } = useVideo();

  useEffect(() => {
    console.log(token);
    const videoInfo = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://insightech.cloud/videotube/api/public/api/videoplay?video_id=${videoDetails.id}&user_id=${userId}`,
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
        console.log("Video Info:", result); // Log the response data

        // Set liked comment ids
        const likedCommentIdsArray = result.video.comments
          .filter((comment) => comment.isLiked)
          .map((comment) => comment.id);
        setLikedCommentIds(likedCommentIdsArray);

        // Set disliked comment ids
        const dislikedCommentIdsArray = result.video.comments
          .filter((comment) => comment.isDisLiked)
          .map((comment) => comment.id);
        console.log("Disliked Comment IDs:", dislikedCommentIdsArray);
        setDislikedCommentIds(dislikedCommentIdsArray);

        setComments(result.video.comments); // Ensure comments are set
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

  useEffect(() => {
    console.log("Liked Id's:", likedCommentIds);
    console.log("DisLiked Id's:", dislikedCommentIds);
  }, [likedCommentIds, dislikedCommentIds]);

  //Add new comments
  const handleAddComment = async () => {
    const commentText = document.querySelector(".add-comment input").value;

    const requestBody = {
      video_id: videoId,
      comment: commentText,
      user_name: username,
      user_id: userId,
      profile_image:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
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
          if (data.code === 200) {
            const newComment = {
              id: data.comment.comment_id, // Assuming the response includes the new comment ID
              comment: data.comment.comment,
              user_name: data.comment.user_name,
              profile_image:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
              likes: 0,
              dislikes: 0,
            };
            setComments([...comments, newComment]);
            console.log("All comments:-",comments);
            document.querySelector(".add-comment input").value = "";
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

  const handleCancelComment = () => {
    document.querySelector(".add-comment input").value = "";
  };

  const handleCommentThumbUp = async (comment) => {
    const isAlreadyLiked = likedCommentIds.includes(comment.id);
    const requestBody = {
      comment_id: comment.id,
      user_id: userId,
      user_name: username,
      is_like: !isAlreadyLiked,
    };

    console.log(requestBody);

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
          prevComments.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  isLiked: !isAlreadyLiked,
                  likes: !isAlreadyLiked ? c.likes + 1 : c.likes - 1,
                  isDisLiked: false,
                  dislikes: c.isDisLiked ? c.dislikes - 1 : c.dislikes,
                }
              : c
          )
        );

        if (!isAlreadyLiked) {
          setLikedCommentIds((prevIds) => [...prevIds, comment.id]);
        } else {
          setLikedCommentIds((prevIds) =>
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

  const handleCommentThumbDown = async (comment) => {
    const isAlreadyDisliked = dislikedCommentIds.includes(comment.id);
    const requestBody = {
      comment_id: comment.id,
      user_id: userId,
      user_name: username,
      is_dislike: !isAlreadyDisliked,
    };

    console.log(requestBody);

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
          prevComments.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  isDisLiked: !isAlreadyDisliked,
                  dislikes: !isAlreadyDisliked
                    ? c.dislikes + 1
                    : c.dislikes - 1,
                  isLiked: false,
                  likes: c.isLiked ? c.likes - 1 : c.likes,
                }
              : c
          )
        );

        if (!isAlreadyDisliked) {
          setDislikedCommentIds((prevIds) => [...prevIds, comment.id]);
        } else {
          setDislikedCommentIds((prevIds) =>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;



  return (
    <div className="addComments">
      <div className="comment">
        <h4>{comments.length} Comments</h4>
        <div className="comment">
          {comments.map((comment, index) => (
            <div key={index} className="cmd">
              <div className="cmd-header">
                <img src={comment.profile_image} alt={comment.user_name} />
                <h3>
                  {comment.user_name}
                  <span> 1 day ago</span>
                </h3>
              </div>
              <p>{comment.comment}</p>
              <div className="comment-action">
                <ThumbUpIcon
                  onClick={() => handleCommentThumbUp(comment)}
                  className="action"
                  sx={{
                    color: likedCommentIds.includes(comment.id)
                      ? "black"
                      : "gray",
                  }}
                />
                {comment.likes}

                <ThumbDownIcon
                  onClick={() => handleCommentThumbDown(comment)}
                  className="action"
                  sx={{
                    color: dislikedCommentIds.includes(comment.id)
                      ? "black"
                      : "gray",
                  }}
                />
                {comment.dislikes}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="add-comment">
        <input type="text" placeholder="Add a comment.." />
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
