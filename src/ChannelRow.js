import React from "react";
import "./ChannelRow.css";
import Avatar from "@mui/material/Avatar";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import { Link } from "react-router-dom";

function ChannelRow({
  image,
  channel,
  subs,
  noOfVideos,
  description,
  verified,
}) {
  return (
    <div className="channelRow">
      <Avatar
        className="channelRow_logo"
        alt={channel}
        src={image}
        sx={{ width: 120, height: 120 }}
      />

      <div className="channelRow_text">
        <div className="channel_edit">
          <h4>{channel}</h4>
          <Link to={"/editchannel"}>
            <EditSharpIcon style={{ fontSize: 18 }} />
          </Link>
        </div>

        <p>
          {subs} subscribers . {noOfVideos} videos
        </p>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ChannelRow;
