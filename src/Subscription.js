import React, { useState, useEffect } from "react";
import "./Subscription.css";
import VideoCard from "./VideoCard";
import ShortsRow from "./ShortsRow";

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

function Subscription() {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const username = getCookie("user_name");

  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchInfo = async (retryCount = 2) => {
    try {
      const response = await fetch(`https://insightech.cloud/videotube/api/public/api/videos/mixed?user_id=${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error Response Text:", errorText);
        const errorData = JSON.parse(errorText);
        
        throw new Error(errorData.message);
      }

      const result = await response.json();
      setValue(result);
    } catch (error) {
      if (retryCount > 0) {
        console.log(`Retrying... (${2 - retryCount + 1})`);
        await fetchInfo(retryCount - 1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInfo();
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="Subscription">
      <div className="subscription-video">
        {value.data.map((item) => (
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
            )
          )}
      </div>
    </div>
  );
}

export default Subscription;
