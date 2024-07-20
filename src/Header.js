import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import NotificationCard from "./NotificationCard";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import VideoCallSharpIcon from "@mui/icons-material/VideoCallSharp";
import NotificationsSharpIcon from "@mui/icons-material/NotificationsSharp";
import SlideshowSharpIcon from "@mui/icons-material/SlideshowSharp";
import LiveTvSharpIcon from "@mui/icons-material/LiveTvSharp";
import Avatar from "@mui/material/Avatar";
import { Link, useNavigate } from "react-router-dom";

// New icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import TranslateIcon from "@mui/icons-material/Translate";
import SecurityIcon from "@mui/icons-material/Security";
import RoomIcon from "@mui/icons-material/Room";
import KeyboardIcon from "@mui/icons-material/Keyboard";

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

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

function Header() {
  const token = getCookie("token");
  const userId = getCookie("user_id");
  const userName = getCookie("user_name");
  const profile_img = getCookie("profile_img");
  const email = getCookie("email");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [inputSearch, setInputSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const optionsRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);


  const NotificationInfo = async (retryCount = 2) => {
    try {
      const response = await fetch(
        `https://insightech.cloud/videotube/api/public/api/bell-notifications?user_id=${userId}&fetch=all`,
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
        await NotificationInfo(retryCount - 1);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      NotificationInfo();
    }
  }, [token, userId]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputSearch(value);
    setCookie("input", value, 1);
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Logout failed:", errorText);
        throw new Error("Logout failed");
      }

      // Clear cookies on successful logout
      setCookie("token", "", -1); // Clear the token cookie
      setCookie("user_id", "", -1); // Clear the user_id cookie
      setCookie("user_name", "", -1); // Clear the user_name cookie
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="header_left">
        <MenuSharpIcon />
        <Link to={"/"}>
          <img
            className="header_logo"
            src="https://robohash.org/logo.png?size=150x150"
            alt="YouTube Logo"
          />
        </Link>
      </div>

      <div className="header_input">
        <input
          onChange={handleInputChange}
          value={inputSearch}
          placeholder="Search"
          type="text"
        />
        <Link to={`/search/${inputSearch}`}>
          <SearchSharpIcon className="header_inputButton" />
        </Link>
      </div>

      <div className="header_icons">
        <div className="header_icon" onClick={toggleOptions} ref={optionsRef}>
          <VideoCallSharpIcon />
          {showOptions && (
            <div className="video_options">
              <Link to={"/upload_video"} className="ink-no-style">
                <div className="click_icons">
                  <SlideshowSharpIcon className="Icon" />
                  <span>Upload video</span>
                </div>
              </Link>
              <div className="click_icons">
                <LiveTvSharpIcon className="Icon" />
                <span>Go Live</span>
              </div>
            </div>
          )}
        </div>

        <div
          className="header_icon"
          onClick={toggleNotifications}
          ref={notificationsRef}
        >
          <NotificationsSharpIcon />
          {showNotifications && (
            <div className="notifications_dropdown">
              <h3>Notifications</h3>
              {data &&
                data.map((item, index) => (
                  <div key={index} className="notifications_container">
                    {item.notifications.map((notification, i) => (
                      <NotificationCard
                        key={i} // Assuming notification has a unique identifier
                        type={notification.type}
                        user_avatar={notification.user_avatar}
                        notification_text={notification.notification_text}
                        time={notification.time}
                        thumbnail={notification.thumbnail}
                        video_id={notification.video_id}
                        short_id={notification.short_id}
                        user={notification.user}
                        channel_name={notification.channel_name}
                        channel_id={notification.channel_id}
                        created_at={notification.created_at}
                      />
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div
          className="header_icon"
          onClick={toggleProfileMenu}
          ref={profileMenuRef}
        >
          <Avatar
            src={profile_img}
            alt={profile_img}
            sx={{ width: 25, height: 25 }}
          />
          {showProfileMenu && (
            <div className="profile_menu">
              {token ? (
                <>
                  <div className="profile_item">
                    <Avatar
                      src={profile_img}
                      alt={profile_img}
                      sx={{ width: 40, height: 40 }}
                    />
                    <div className="profile_userInfo">
                      <p>{userName}</p>
                      <p className="email">{email}</p>
                      <div className="channel_create">
                        <p>Create your channel</p>
                      </div>
                    </div>
                  </div>

                  <div className="profile_item">
                    <AccountCircleIcon className="profile_icon" />
                    <span>Google Account</span>
                  </div>
                  <div className="profile_item">
                    <SwitchAccountIcon className="profile_icon" />
                    <span>Switch account</span>
                  </div>
                  <div className="profile_item" onClick={handleSignOut}>
                    <ExitToAppIcon className="profile_icon" />
                    <span>Log out</span>
                  </div>
                  <div className="profile_item">
                    <SettingsIcon className="profile_icon" />
                    <span>YouTube Studio</span>
                  </div>
                  <div className="profile_item">
                    <PaymentIcon className="profile_icon" />
                    <span>Purchases and memberships</span>
                  </div>
                  <div className="profile_item">
                    <DataUsageIcon className="profile_icon" />
                    <span>Your data in YouTube</span>
                  </div>
                  <div className="profile_item">
                    <Brightness4Icon className="profile_icon" />
                    <span>Appearance: Light</span>
                  </div>
                  <div className="profile_item">
                    <TranslateIcon className="profile_icon" />
                    <span>Language: English</span>
                  </div>
                  <div className="profile_item">
                    <SecurityIcon className="profile_icon" />
                    <span>Restricted Mode: Off</span>
                  </div>
                  <div className="profile_item">
                    <RoomIcon className="profile_icon" />
                    <span>Location: India</span>
                  </div>
                  <div className="profile_item">
                    <KeyboardIcon className="profile_icon" />
                    <span>Keyboard shortcuts</span>
                  </div>
                </>
              ) : (
                <div className="profile_item">
                  <ExitToAppIcon className="profile_icon" />
                  <Link to="/login" className="ink-no-style">
                    <span>Login</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
