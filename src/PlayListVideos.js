import React from "react";
import "./PlayListVideos.css";
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';

function PlayListVideos() {
  return (
    <div className="PlayListVideos">
      <div className="playlist_left">
        <div className="container">
          <div className="img">
            <img
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
              alt=""
            />
          </div>
          <h3>Liked Videos</h3>
          <div className="details">
            <h6>Praveen Subramanian</h6>
            <p>429 Vidoes No views Last updated on May 23, 2024</p>
          </div>
          <div className="icons">
            <div className="download">
              <DownloadSharpIcon />
            </div>
            <div className="more">
              <MoreVertSharpIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="playlist_right"></div>
    </div>
  );
}

export default PlayListVideos;
