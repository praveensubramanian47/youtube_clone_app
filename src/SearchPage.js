import React, { useRef, useEffect, useState } from "react";
import "./SearchPage.css";
import ShortsRow from "./ShortsRow";
import VideoRow from "./VideoRow";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import KeyboardArrowLeftSharpIcon from "@mui/icons-material/KeyboardArrowLeftSharp";
import KeyboardArrowRightSharpIcon from "@mui/icons-material/KeyboardArrowRightSharp";
import { useNavigate } from "react-router-dom";


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

function SearchPage() {
  const navigate = useNavigate();
  const shortsContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = getCookie("user_id");
  const token = getCookie("token");
  const value = getCookie("input");

  useEffect(() => {
    const SearchInfo = async (retryCount = 3) => {
      try {
        const requestBody = {
          search_data: value,
          user_id: userId,
        };
        const response = await fetch(
          "https://insightech.cloud/videotube/api/public/api/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        if (retryCount > 0) {
          await SearchInfo(retryCount - 1);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      SearchInfo();
    }
  }, [value, userId, token]);

  const scrollLeft = () => {
    if (shortsContainerRef.current) {
      shortsContainerRef.current.scrollBy({
        left: -300, // Adjust this value to scroll more or less
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (shortsContainerRef.current) {
      shortsContainerRef.current.scrollBy({
        left: 300, // Adjust this value to scroll more or less
        behavior: "smooth",
      });
    }
  };

  const handleShortClick = () => {
    const val = data.filter((data) => data.type === "short");

    console.log("val:-", val);
    localStorage.setItem('shorts_details', JSON.stringify(val));
    navigate("/shorts");
  };

  return (
    <div className="searchPage">
      <div className="searchPage_filter">
        <TuneSharpIcon />
        <h5>FILTER</h5>
      </div>

      <hr />

      {/* Shorts Section */}
      <div className="shorts_controls">
        <KeyboardArrowLeftSharpIcon
          className="scrollButton"
          onClick={scrollLeft}
        />
        <div className="shorts_section" ref={shortsContainerRef}>
          {data &&
            data.map((item) =>
              item.type === "short" ? (
                <div className="shorts-row" key={item.id} onClick={() => handleShortClick()}>
                  <ShortsRow
                    id={item.id}
                    views={item.video_view} 
                    title={item.name} 
                    image={item.thumbnail_url}
                  />
                </div>
              ) : null // You can also include other conditions for different types here
            )}
        </div>
        <KeyboardArrowRightSharpIcon
          className="scrollButton"
          onClick={scrollRight}
        />
      </div>
      <div className="video_row">
        <hr />
        {data &&
          data.map((item) =>
            item.type === "video" ? (
              <VideoRow
                key={item.id}
                id={item.id}
                views={item.video_view}
                video={item.video_url}
                subs={item.total_subscribers}
                description={item.description}
                timestamp="59 seconds ago"
                channel={item.channel_name}
                title={item.name}
                image={item.thumbnail_url}
              />
            ) : null
          )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SearchPage;
