import React, { useState, useEffect } from "react";
import "./RecommendedVideos.css";
import VideoCard from "./VideoCard";
import KeyboardArrowLeftSharpIcon from "@mui/icons-material/KeyboardArrowLeftSharp";
import KeyboardArrowRightSharpIcon from "@mui/icons-material/KeyboardArrowRightSharp";

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

function RecommendedVideos() {
  const categories = [
    "All",
    "Gaming",
    "Music",
    "Sports",
    "Movies",
    "News",
    "Vocal Music",
    "Lyrics",
    "Tamil cinema",
    "Game Shows",
    "Computer programming",
    "Science fiction",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categoryPerPage = 10;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getCookie('token');
  const userId = getCookie('user_id');

  const fetchInfo = async (retryCount = 2) => {
    try {
      let url;
      if (selectedCategory === "All") {
        url = "https://insightech.cloud/videotube/api/public/api/trending";
      } else {
        url = `https://insightech.cloud/videotube/api/public/api/category?category=${selectedCategory}`;
      }

      const response = await fetch(url, {
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
      setData(result);
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

  const scrollLeft = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  const scrollRight = () => {
    setCurrentIndex(
      Math.min(
        currentIndex + 1,
        Math.floor((categories.length - 1) / categoryPerPage)
      )
    );
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    fetchInfo();
  };

  useEffect(() => {
    if (token) {
      fetchInfo();
    }
  }, [token, selectedCategory]);

  const displayedCategories = categories.slice(
    currentIndex * categoryPerPage,
    Math.min((currentIndex + 1) * categoryPerPage, categories.length)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="recommendedVideos">
      <div className="category-list-container">
        <button
          className={`category-list-btn category-list-btn-left ${
            currentIndex === 0 ? "disabled" : ""
          }`}
          onClick={scrollLeft}
          disabled={currentIndex === 0}
        >
          <KeyboardArrowLeftSharpIcon />
        </button>
        <div className="category-list">
          {displayedCategories.map((category, index) => (
            <div
              key={index}
              className={`category-item ${
                category === selectedCategory ? "selected" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <button
          className={`category-list-btn category-list-btn-right ${
            currentIndex ===
            Math.floor((categories.length - 1) / categoryPerPage)
              ? "disabled"
              : ""
          }`}
          onClick={scrollRight}
          disabled={
            currentIndex ===
            Math.floor((categories.length - 1) / categoryPerPage)
          }
        >
          <KeyboardArrowRightSharpIcon />
        </button>
      </div>
      <div className="recommendedVideos_videos">
        {data.videos.map((item) => (
          <VideoCard
            key={item.id}
            id={item.id}
            title={item.name}
            video={item.video_url}
            thumbnail={item.thumbnail_url}
            duration={item.duration}
            channel={item.channel_name}
            channelImage={item.channel_image}
            video_view={item.video_viewer}
            upload_time={item.upload_time}
          />
        ))}
      </div>
    </div>
  );
}

export default RecommendedVideos;
