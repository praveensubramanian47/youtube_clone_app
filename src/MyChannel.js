import React, { useEffect, useState } from "react";
import "./MyChannel.css";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import ChannelRow from "./ChannelRow";
import VideoRow from "./VideoRow";


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

function MyChannel() {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const channel_img = getCookie("profile_img");

  const [channelData, setChannelData] = useState(null);
  const [allVideos, setAllVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subs, setSubs] = useState(0);

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
        setChannelData(result);
        setSubs(result.data.subscribers);
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

  useEffect(() => {
    const AllVideo = async (retryCount = 3) => {
      const requestBody = {
        user_id: userId,
      };
      try {
        const response = await fetch(
          "https://insightech.cloud/videotube/api/public/api/channel/user-videos",
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
          throw new Error(errorText || "Network response was not ok");
        }

        const result = await response.json();
        console.log("Info Response:", result);
        setAllVideos(result);
      } catch (error) {
        if (retryCount > 0) {
          setTimeout(() => AllVideo(retryCount - 1), 1000);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      AllVideo();
    }
  }, [token, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="MyChannel">
      <div className="channel_filter">
        <TuneSharpIcon />
        <h2>FILTER</h2>
      </div>
      <hr />
      {channelData && channelData.data && (
        <ChannelRow
          image={channel_img}
          channel={channelData.data.username}
          subs={channelData.data.subscribers}
          noOfVideos={channelData.data.total_videos}
          description={channelData.data.description}
        />
      )}
      <hr />
      {allVideos && allVideos.data && allVideos.data.length > 0 ? (
        allVideos.data.map((item) => (
          <VideoRow
            key={item.id}
            id={item.id}
            views={item.video_view}
            video={item.video_url}
            subs={subs}
            description={item.description}
            timestamp={item.upload_time}
            channel={item.channel_name}
            title={item.name}
            image={item.thumbnail_url}
          />
        ))
      ) : (
        <div>No videos available.</div>
      )}
    </div>
  );
}

export default MyChannel;
