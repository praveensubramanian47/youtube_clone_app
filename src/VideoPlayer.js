import React, { useState, useEffect, useContext } from "react";
import "./VideoPlayer.css";
import PlayVideo from "./PlayVideo";
import FetchedVideo from "./FetchedVideo";
import { useVideo } from "./VideoContext";

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function VideoPlayer() {

  const token = getCookie('token');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const { token } = useContext(AuthContext);

  const { videoDetails } = useVideo();

  const video_id = videoDetails.id;
  const fetchInfo = async (retryCount = 2) => {
    try {
      const response = await fetch(
        `https://insightech.cloud/videotube/api/public/api/relatedvideos?video_id=${video_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error Response Text:", errorText);
        const errorData = JSON.parse(errorText);

        throw new Error(errorData.message);
      }

      const result = await response.json();
      setData(result);
      console.log(data);
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
    <div className="VideoPlayer">
      <div className="play-video">
        <PlayVideo />
      </div>
      <div className="FetchedVideo">
        {data.related_videos.map((item) => (
          <FetchedVideo
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

export default VideoPlayer;
