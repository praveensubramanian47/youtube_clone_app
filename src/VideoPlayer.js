import React, { useState, useEffect } from "react";
import "./VideoPlayer.css";
import PlayVideo from "./PlayVideo";
import FetchedVideo from "./FetchedVideo";

// Function to get a cookie value by name
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

function VideoPlayer() {
  const token = getCookie("token");
  const video_id = getCookie("video_id");
  const userId = getCookie("user_id");


  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(token);
    const videoInfo = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://insightech.cloud/videotube/api/public/api/videoplay?video_id=${video_id}&user_id=${userId}`,
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
        console.log("Video Info Response:", result); // Log the response structure
        setData1(result.video); // Directly set data1 to the video object
        console.log("Message:", result.message);
      } catch (error) {
        if (retryCount > 0) {
          setTimeout(() => videoInfo(retryCount - 1), 1000); // Retry after 1 second
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
  }, [token, video_id, userId]);

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
      console.log("Related Videos Response:", result); // Log the response structure
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
  }, [token, video_id]);

  console.log("Data1:", data1);
  console.log("Data:", data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="VideoPlayer">
      <div className="play-video">
        {data1 ? (
          <PlayVideo
            id={data1.id}
            name={data1.name}
            video={data1.video_url}
            thumbnail={data1.thumbnail_url}
            video_duration={data1.duration}
            channel_name={data1.channel_name}
            channel_id={data1.channel_id}
            channel_image={data1.channel_image}
            video_view={data1.video_view}
            upload_time={data1.upload_time}
            likes={data1.likes}
            dislikes={data1.dislikes}
            isSubscribed={data1.isSubscribed}
            description={data1.description}
            subscribers={data1.number_of_channel_subscribers}
            isVideoLike={data1.isVideoLike}
            isVideoDislike={data1.isVideoDislike}
            resolutions={data1.resolutions}
          />
        ) : (
          <div>No video available</div>
        )}
      </div>
      <div className="FetchedVideo">
        {data && data.related_videos && Array.isArray(data.related_videos) ? (
          data.related_videos.map((item) => (
            <FetchedVideo
              key={item.id} // Ensure you provide a unique key
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
          ))
        ) : (
          <div>No related videos available</div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
