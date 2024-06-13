import React from 'react'
import './ChannelRow.css';
import Avatar from '@mui/material/Avatar';
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';

function ChannelRow({image, channel, subs, noOfVideos, description, verified}) {
  return (
    <div className='channelRow'>
        <Avatar className='channelRow_logo'
        alt={channel} src={image} 
        sx={{ width: 120, height: 120 }}/>

        <div className='channelRow_text'>
            <h4>{channel} {verified && <CheckCircleOutlineSharpIcon />}</h4>
            <p>
                {subs} subscribers . {noOfVideos} videos
            </p>
            <p>{description}</p>
        </div>
    </div>
  )
}

export default ChannelRow
