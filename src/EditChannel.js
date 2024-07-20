import React, { useState, useEffect } from "react";
import "./EditChannel.css";
import Avatar from "@mui/material/Avatar";
import AddAPhotoSharpIcon from "@mui/icons-material/AddAPhotoSharp";
import { useNavigate } from "react-router-dom";

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

function EditChannel() {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const user_name = getCookie("user_name");
  const channel_name = getCookie("channel_name");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [successmsg, setSuccessmsg] = useState("");
  const [description, setDescription] = useState("");
  const [channelImg, setChannelImg] = useState(null);
  const [channelImgUrl, setChannelImgUrl] = useState("");

  useEffect(() => {
    const ChannelInfo = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://insightech.cloud/videotube/api/public/api/user/profile?user_id=${userId}`,
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
          throw new Error(errorText || "Network response was not ok");
        }

        const result = await response.json();
        setUsername(result.data.username);
        setDescription(result.data.description);
      } catch (error) {
        if (retryCount > 0) {
          setTimeout(() => ChannelInfo(retryCount - 1), 1000);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      ChannelInfo();
    }
  }, [token, userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setChannelImg(file);
    setChannelImgUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("channel_img", channelImg);
    formData.append("username", username);
    formData.append("description", description);

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/updateChannel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setSuccessmsg("Channel updated successfully!");
        navigate(`/channel/${channel_name}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("An error occurred while updating the channel.");
    }
  };

  return (
    <div className="EditChannel">
      <form onSubmit={handleSubmit}>
        <div className="edit_channel_info">
          <h4>Edit Channel</h4>
          <div className="edit_container">
            <div className="edit_info">
              <div className="channel_img_edit">
                <input
                  type="file"
                  style={{ display: "none" }}
                  name="edit_profile_img"
                  onChange={handleFileChange}
                  id="fileInput"
                />
                <label htmlFor="fileInput">
                  {channelImgUrl ? (
                    <Avatar
                      src={channelImgUrl}
                      sx={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <AddAPhotoSharpIcon
                      sx={{ width: 100, height: 100 }}
                      className="avatar-icon"
                    />
                  )}
                </label>
              </div>
            </div>
            <div className="edit_user_info">
              <div className="edit_user_name">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="edit_channel_description">
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="edit_channel_url">
                <label>Channel URL</label>
                <input
                  type="text"
                  value={`https://insightech.cloud/videotube/api/public/api/${user_name}`}
                  readOnly
                />
              </div>
              {successmsg && <p className="login_success_msg">{successmsg}</p>}
              {error && <p className="error_msg">{error}</p>}
              <div className="edit_button">
                <button type="submit">Save</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditChannel;
