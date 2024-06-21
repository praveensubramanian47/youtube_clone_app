import React from 'react'
import "./PlaylistShortcard.css"

function PlaylistShortcard({title}) {
  return (
    <div className='PlaylistShortcard'>
      <div className='short_container'>
        <img src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg" alt="" />
      </div>
      <div className='short_details'>
        <h4>{title.length > 2 ? `${title.slice(0, 35)}...` : title}</h4>
        <p>24K . views</p>
      </div>
    </div>
  )
}

export default PlaylistShortcard
