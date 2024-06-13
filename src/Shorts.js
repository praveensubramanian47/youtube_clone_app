import React, { useEffect, useState } from 'react';
import ShortCard from './ShortCard';
import "./Shorts.css";

function Shorts() {
  //const [data, setData] = useState(null);
  const [count, setCount] = useState(0); // State for count
  const [videosArray, setVideosArray] = useState(0); 
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // https://insightech.cloud/videotube/api/public/api/shorts
        const response =  await fetch('http://127.0.0.1:8000/api/shorts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        // Assuming the API returns an object with a single video

        const videosArray = Array.isArray(data.status) ? Array.from(data.status) : [];
        setVideosArray(videosArray)

        console.log(videosArray[0])

      } catch (error) {
        console.error(error);
      }
    }; 

    fetchVideo();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        // Increase count by 1
        setCount(prevCount => prevCount + 1);

      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, []);

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === 'ArrowUp') {
        setCount(prevCount => prevCount - 1);
      }
    };
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);



  return (
    <div className='Shorts'>
      <div className='short'>
        <div className='Short-content'>
          {videosArray[count] && (
            <ShortCard
              video={videosArray[count].video_url}
              title={videosArray[count].description}
              channel={videosArray[count].name}
              channelImage="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
              thumb="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
              like={videosArray[count].likes}
              comment={videosArray[count].comment}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Shorts;
