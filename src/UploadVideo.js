import React, { useRef, useState } from "react";
import "./UploadVideo.css";
import UploadSharpIcon from "@mui/icons-material/UploadSharp";
import axios from "axios";

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

function UploadVideo() {
  const token = getCookie("token");
  const userId = getCookie("user_id");

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [commentChat, setCommentChat] = useState("on");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!videoFile || !title || !description) {
      alert("Please fill in all the fields and select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);
    formData.append("user_id", userId);
    formData.append("thumbnail_url", thumbnailUrl); // Assuming you have a URL or can handle thumbnail separately
    formData.append("visibility", visibility);
    formData.append("comments_chat", commentChat);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "https://insightech.cloud/videotube/api/public/api/videoupload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Video uploaded successfully:", response.data);
      setSuccessMessage("Video uploaded successfully!");
      // Reset form fields
      setVideoFile(null);
      setThumbnailUrl("");
      setTitle("");
      setDescription("");
      setVisibility("Public");
      setCommentChat("on");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Failed to upload video: ${JSON.stringify(error.response.data.message)}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("Failed to upload video: No response from server.");
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to upload video: ${error.message}`);
      }
    }
  };

  return (
    <div className="UploadVideo">
      <form onSubmit={handleUpload}>
        <div className="video_container">
          <div className="upload_video_thumbnail">
            <div className="uploadIcon" onClick={handleIconClick}>
              <UploadSharpIcon className="" style={{ fontSize: 70 }} />
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              name="video"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {videoFile && <div className="video_name">{videoFile.name}</div>}
          </div>
          <div className="upload_video_details">
            <div className="style">
              <label>Title</label> <br />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="description">
              <label>Description</label> <br />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="video_state">
              <div className="public">
                <label>Visibility</label> <br />
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  required
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <div className="comment_state">
                <label>Comments</label> <br />
                <select
                  value={commentChat}
                  onChange={(e) => setCommentChat(e.target.value)}
                  required
                >
                  <option value="on">On</option>
                  <option value="off">Off</option>
                </select>
              </div>
            </div>
            <div className="submit_video">
              {successMessage && <div className="success_message">{successMessage}</div>}
              <button type="submit">UPLOAD VIDEO</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadVideo;
