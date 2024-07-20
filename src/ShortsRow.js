import React from 'react';
import './ShortsRow.css';

function ShortsRow({ views, title, image }) {
  return (
    <div className="shortsRow">
      <img src={image} alt={title} />
      <div className="shortsRow_text">
      <h3>{title.length > 55 ? `${title.slice(0, 55)}...` : title}</h3>

        <p className="shortsRow_headline">
          {views} views
        </p>
      </div>
    
    </div>
  );
}

export default ShortsRow;
