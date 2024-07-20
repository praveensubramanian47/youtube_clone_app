import React from "react";
import "./NotificationCard.css";

function NotificationCard({type, user_avatar, notification_text, time, thumbnail, video_id, short_id, user, channel_name, channel_id, created_at}) {
  return (
    <div className="NotificationCard">
      <div className="notification_item">
        <div className="notificationImg1">
          <img src={user_avatar} alt={channel_name} />
        </div>
        <div>
          <p>{channel_name} uploaded: </p>
          <p>{notification_text}</p>
          <span>{time}</span>
        </div>
        <div className="notificationImg2">
          <img src={thumbnail} alt="User" />
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
