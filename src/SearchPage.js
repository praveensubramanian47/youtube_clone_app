import React, { useRef, useState } from "react";
import "./SearchPage.css";
import ChannelRow from "./ChannelRow";
import VideoRow from "./VideoRow";
import ShortsRow from "./ShortsRow";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";
import KeyboardArrowLeftSharpIcon from "@mui/icons-material/KeyboardArrowLeftSharp";
import KeyboardArrowRightSharpIcon from "@mui/icons-material/KeyboardArrowRightSharp";

function SearchPage() {
  const shortsContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    if (shortsContainerRef.current) {
      shortsContainerRef.current.scrollBy({
        left: -300, // Adjust this value to scroll more or less
        behavior: "smooth",
      });
      setScrollPosition(scrollPosition - 300);
    }
  };

  const scrollRight = () => {
    if (shortsContainerRef.current) {
      shortsContainerRef.current.scrollBy({
        left: 300, // Adjust this value to scroll more or less
        behavior: "smooth",
      });
      setScrollPosition(scrollPosition + 300);
    }
  };

  return (
    <div className="searchPage">
      <div className="searchPage_filter">
        <TuneSharpIcon />
        <h2>FILTER</h2>
      </div>

      <hr />

      {/* Shorts Section */}
      <div className="shorts_section">
        <div className="shorts-row">
          <ShortsRow
            views="1.2M"
            timestamp="2 hours ago"
            channel="Tech Channel"
            title="Amazing Tech Tips"
            image="https://picsum.photos/150/250"
          />
        </div>
        <div className="shorts-row">
          <ShortsRow
            views="1.2M"
            timestamp="2 hours ago"
            channel="Tech Channel"
            title="Amazing Tech Tips"
            image="https://picsum.photos/150/250"
          />
        </div>
        <div className="shorts-row">
          <ShortsRow
            views="1.2M"
            timestamp="2 hours ago"
            channel="Tech Channel"
            title="Amazing Tech Tips"
            image="https://picsum.photos/150/250"
          />
        </div>
        <div className="shorts-row">
          <ShortsRow
            views="1.2M"
            timestamp="2 hours ago"
            channel="Tech Channel"
            title="Amazing Tech Tips"
            image="https://picsum.photos/150/250"
          />
        </div>
        <div className="shorts-row">
          <ShortsRow
            views="1.2M"
            timestamp="2 hours ago"
            channel="Tech Channel"
            title="Amazing Tech Tips"
            image="https://picsum.photos/150/250"
          />
        </div>
        <div className="shorts-row">
          <ShortsRow
            views="1.2M"
            timestamp="2 hours ago"
            channel="Tech Channel"
            title="Amazing Tech Tips"
            image="https://picsum.photos/150/250"
          />
        </div>
        <div className="shorts-row">
          <ShortsRow
            views="1.2M"
            timestamp="2 hours ago"
            channel="Tech Channel"
            title="Amazing Tech Tips"
            image="https://picsum.photos/150/250"
          />
        </div>
      </div>

      {/* Videos Section
      <div className="video_row">
        <hr />

        <VideoRow
          views="1.4k"
          subs="659k"
          description="If you encounter messages promising free training or any other offers, make sure to verify the source, check for official communication channels, and exercise caution before clicking on any links. Be especially wary if the message is unsolicited or comes from an unfamiliar source."
          timestamp="59 seconds ago"
          channel="Rahul M"
          title="How to start your first investment"
          image="https://picsum.photos/250/140"
        />
      </div> */}
    </div>
  );
}

export default SearchPage;
