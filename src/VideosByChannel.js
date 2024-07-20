import React, { useState, useEffect } from "react";
import "./VideosByChannel.css";
import VideoCard from "./VideoCard";
import { useParams } from 'react-router-dom';

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
function VideosByChannel() {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const channel_id = getCookie("channel_id");


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { channel_name } = useParams();

  useEffect(() => {
    // Fetch or update data based on the new channel_name
    console.log(`Channel name changed to: ${channel_name}`);
    // Add your data fetching or updating logic here
  }, [channel_name]);

  const AllInfo = async (retryCount = 3) => {
    const requestBody = {
      user_id: userId,
      channel_id: channel_id
    };

    console.log("Channel_id in video eby channel:- ",channel_id);

    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/videosbychannel",
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
      setData(result);
      console.log("Response_video:-", result);
    } catch (error) {
      if (retryCount > 0) {
        await AllInfo(retryCount - 1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token, token) {
      console.log("Here")
      setLoading(true);
      AllInfo();
    }
  }, [channel_id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="VideosByChannel">
      <div className="Channel_video">
        {data.data.map((item) => (
          <VideoCard
          key={item.id}
          id={item.id}
          title={item.name}
          video={item.video_url}
          thumbnail={item.thumbnail_url}
          duration={item.duration}
          channel={item.channel_name}
          channelImage={item.channel_image}
          video_view={item.video_view}
          upload_time={item.upload_time}
          />
        ))}
      </div>
    </div>
  );
}

export default VideosByChannel;
