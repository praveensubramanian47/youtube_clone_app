import React from 'react'
import "./PlaylistVideocard.css"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function PlaylistVideocard({id, name, video, thumbnail, duration, channel_name, channel_image, video_viewer, upload_time}) {

  console.log("Video id:-",id)
  function formatViewCount(viewCount) {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`;
    } else {
      return viewCount.toString();
    }
  }

  function getRelativeTime(uploadTime) {
    return dayjs(uploadTime).fromNow();
  }

  return (
    <div className="PlaylistVideocard">
      <div className="videoCard_img_wrapper">
        <img src={thumbnail} alt="" className="videoCard_img" />
        <div className="videoCard_duration">{duration}</div>
      </div>
      <div className='playlist_video_text'>
        <h3>{name}</h3>
        <p className='playlist_video_details'>
            {channel_name} . {formatViewCount(video_viewer)} views . {getRelativeTime(upload_time)}
        </p>
      </div>
    </div>
  )
}

export default PlaylistVideocard
