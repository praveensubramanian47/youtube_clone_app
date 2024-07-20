import React, { useState, useEffect } from "react";
import SidebarRow from "./SidebarRow";
import "./Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotSharpIcon from "@mui/icons-material/WhatshotSharp";
import SubscriptionsSharpIcon from "@mui/icons-material/SubscriptionsSharp";
import AccountBoxSharpIcon from "@mui/icons-material/AccountBoxSharp";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";
import SlideshowSharpIcon from "@mui/icons-material/SlideshowSharp";
import WatchLaterSharpIcon from "@mui/icons-material/WatchLaterSharp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import PlaylistPlaySharpIcon from "@mui/icons-material/PlaylistPlaySharp";
import { Link } from "react-router-dom";

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

// Function to set a cookie value
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function Sidebar() {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const channel_name = getCookie("channel_name");

  console.log(token);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SubscribersInfo = async (retryCount = 2) => {
    try {
      const response = await fetch(
        `https://insightech.cloud/videotube/api/public/api/subscribedchannels?user_id=${userId}`,
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
      setData(result.data);
      console.log("Response:", result.message);
    } catch (error) {
      if (retryCount > 0) {
        console.log(`Retrying... (${2 - retryCount + 1})`);
        await SubscribersInfo(retryCount - 1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      SubscribersInfo();
    }
  }, [token, userId]);

  const handleVideoCardClick = (channel_id, channel_name) => {
    console.log("channel_id:", channel_id);
    console.log("channel_name:", channel_name);

    setCookie("channel_id", channel_id, 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sidebar" style={{ position: "sticky", top: 0 }}>
      <Link to={"/"} className="ink-no-style">
        <SidebarRow Icon={HomeIcon} title="Home" />
      </Link>

      <Link to={"/shorts"} className="ink-no-style">
        <SidebarRow Icon={WhatshotSharpIcon} title="Shorts" />
      </Link>
      <Link to={"/Subscription"} className="ink-no-style">
        <SidebarRow Icon={SubscriptionsSharpIcon} title="Subscription" />
      </Link>
      <hr />

      <h6>Subscriptions</h6>
      {data &&
        data.map((item) => (
          <Link
            to={`/channelvideos/${item.channel_name}`}
            className="ink-no-style"
            key={item.channel_id} // Adding a unique key for each item in the list
          >
            <div
              onClick={() =>
                handleVideoCardClick(item.channel_id, item.channel_name)
              }
            >
              <SidebarRow
                id={item.channel_id}
                Icon={item.channel_image}
                title={item.channel_name}
              />
            </div>
          </Link>
        ))}

      <hr />
      <Link to={`/channel/${channel_name}`} className="ink-no-style">
        <SidebarRow Icon={AccountBoxSharpIcon} title="Your channel" />
      </Link>

      <Link to={"/history"} className="ink-no-style">
        <SidebarRow Icon={HistorySharpIcon} title="History" />
      </Link>

      <Link to={"/playlists"} className="ink-no-style">
        <SidebarRow Icon={PlaylistPlaySharpIcon} title="Playlist" />
      </Link>

      <SidebarRow Icon={SlideshowSharpIcon} title="Your videos" />

      <Link to={"/playlistvideo/Watch%20Later"} className="ink-no-style">
        <SidebarRow Icon={WatchLaterSharpIcon} title="Watch later" />
      </Link>
      <hr />
    </div>
  );
}

export default Sidebar;
