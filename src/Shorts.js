import React, { useEffect, useState } from 'react';
import ShortCard from './ShortCard';
import "./Shorts.css";

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

function Shorts() {
  const [videosArray, setVideosArray] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const token = getCookie('token');
  const userId = getCookie('user_id');
  
  const fetchShortInfo = async (retryCount = 2) => {
    const requestBody = {
      user_id: userId,
    };
    
    try {
      const response = await fetch("https://insightech.cloud/videotube/api/public/api/shortsfetch", {
        method: "POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message);
      }

      const result = await response.json();
      setVideosArray(result.data);
    } catch (error) {
      if (retryCount > 0) {
        await fetchShortInfo(retryCount - 1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchShortInfo();
    }
  }, [token, userId]);
  
  useEffect(() => {
    console.log("Videos Array:", videosArray); // Log the entire array
    if (videosArray[count]) {
      console.log("Current Video Object:", videosArray[count]); // Log the specific video object
    }
  }, [videosArray, count]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' && count < videosArray.length - 1) {
        setCount(prevCount => prevCount + 1);
      } else if (event.key === 'ArrowUp' && count > 0) {
        setCount(prevCount => prevCount - 1);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [count, videosArray.length]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='Shorts'>
      <div className='short'>
        <div className='Short-content'>
          {videosArray.length > 0 && videosArray[count] && (
            <ShortCard
              id={videosArray[count].id}
              video_url={videosArray[count].video_url}
              title={videosArray[count].name}
              description={videosArray[count].description}
              channelImage={videosArray[count].profile_image}
              thumb="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
              like={videosArray[count].likes}
              dislike={videosArray[count].dislikes}
              isLiked={videosArray[count].isLiked || false}
              isDisLiked={videosArray[count].isDisliked || false}
              count={count}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Shorts;
