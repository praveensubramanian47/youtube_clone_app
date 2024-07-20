import React from 'react';
import './SidebarRow.css';

function SidebarRow({ selected, Icon, title }) {
  return (
    <div className={`sidebarRow ${selected && "selected"}`}>
      {typeof Icon === 'string' ? (
        <img src={Icon} alt={title} className="sidebarRow_icon" />
      ) : (
        <Icon className='sidebarRow_icon' />
      )}
      <span className='sidebarRow_title' style={{ textDecoration: 'none' }}>{title}</span>
    </div>
  );
}

export default SidebarRow;
