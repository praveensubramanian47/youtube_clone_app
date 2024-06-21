import React from 'react';
import './ShortsRow.css';

function ShortsRow({ views, timestamp, channel, title, image }) {
  return (
    <div className="shortsRow">
      <img src={image} alt={title} />
      <div className="shortsRow_text">
        <h3>{title}</h3>
        <p className="shortsRow_headline">
          {views} views
        </p>
      </div>
    
    </div>
  );
}

export default ShortsRow;
