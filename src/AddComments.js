import React, { useState, useEffect } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useVideo } from "./VideoContext";
import "./AddComments.css";

function AddComments({ token, userId, videoId }) {
  const [comments, setComments] = useState([]);
  const [comment_id, setComment_id] = useState();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { videoDetails } = useVideo();


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


// new comments.

  useEffect(() => {
    console.log("new comments:", comments);
  }, [comments]);

  const handleAddComment = async () => {
    const commentText = document.querySelector(".add-comment input").value;

    const requestBody = {
      video_id: videoId,
      comment: commentText,
      user_name: "testing3",
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
              comment: commentText,
              user_name: "testing3",
              profile_image:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
            };
            setComments([...comments, newComment]);
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

    //Comments like and dislike.
    const handleCommentThumbUp = async (comment) => {
      const newCommentThumbUpState = !comment.isLiked;
      const requestBody = {
        comment_id: comment.id,
        user_id: userId,
        user_name: username, // Assuming you have user's name in the context
        is_like: newCommentThumbUpState,
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
          setData((prevData) => ({
            ...prevData,
            video: {
              ...prevData.video,
              comments: prevData.video.comments.map((c) =>
                c.id === comment.id
                  ? {
                      ...c,
                      isLiked: newCommentThumbUpState,
                      likes: newCommentThumbUpState ? c.likes + 1 : c.likes - 1,
                      isDisLiked: false,
                      dislikes: c.isDisLiked ? c.dislikes - 1 : c.dislikes,
                    }
                  : c
              ),
            },
          }));
        } else {
          console.error("Error from like:", result.message);
        }
      } catch (error) {
        console.error("Error from like:", error);
      }
    };
  
    const handleCommentThumbDown = async (comment) => {
      const newCommentThumbDownState = !comment.isDisLiked;
      const requestBody = {
        comment_id: comment.id,
        user_id: userId,
        user_name: username, // Assuming you have user's name in the context
        is_like: !newCommentThumbDownState, // is_like should be opposite for dislike action
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
          setData((prevData) => ({
            ...prevData,
            video: {
              ...prevData.video,
              comments: prevData.video.comments.map((c) =>
                c.id === comment.id
                  ? {
                      ...c,
                      isDisLiked: newCommentThumbDownState,
                      dislikes: newCommentThumbDownState
                        ? c.dislikes + 1
                        : c.dislikes - 1,
                      isLiked: false,
                      likes: c.isLiked ? c.likes - 1 : c.likes,
                    }
                  : c
              ),
            },
          }));
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
      <h4>130 Comments</h4>
        <div className="comment">
          {data && data.video.comments.map((comment, index) => (
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
                  onClick={}
                    className="action"
                  />
                  {comment.likes}

                  <ThumbDownIcon
                    className="action"
                  />
                  {comment.dislikes}
                </div>
              </div>
            ))}
        </div>
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
              <ThumbUpIcon className="action" />
              {/* <span>{comment.likes}</span> */}
              <ThumbDownIcon className="action" />
            </div>
          </div>
        ))}
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

export default AddComments;
