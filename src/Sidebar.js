import React from 'react';
import SidebarRow from './SidebarRow';
import './Sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotSharpIcon from '@mui/icons-material/WhatshotSharp';
import SubscriptionsSharpIcon from '@mui/icons-material/SubscriptionsSharp';
import AccountBoxSharpIcon from '@mui/icons-material/AccountBoxSharp';
import HistorySharpIcon from '@mui/icons-material/HistorySharp';
import SlideshowSharpIcon from '@mui/icons-material/SlideshowSharp';
import WatchLaterSharpIcon from '@mui/icons-material/WatchLaterSharp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import PlaylistPlaySharpIcon from '@mui/icons-material/PlaylistPlaySharp';
import { Link } from 'react-router-dom';


function Sidebar(){
    return(
            <div className='sidebar' style={{ position: 'sticky', top: 0 }}>
             <Link to={'/'} className='ink-no-style'>
                <SidebarRow Icon={HomeIcon} title="Home"/>
             </Link>

             <Link to={'/shorts'} className='ink-no-style'>
                <SidebarRow Icon={WhatshotSharpIcon} title="Shorts"/>
             </Link>
             <SidebarRow Icon={SubscriptionsSharpIcon} title="Subscription" />

             <hr />
             <SidebarRow Icon={AccountBoxSharpIcon} title="Your channel"/>
             <SidebarRow Icon={HistorySharpIcon} title="History"/>

             <Link to={'/playlists'} className='ink-no-style'>
               <SidebarRow Icon={PlaylistPlaySharpIcon} title="Playlist" />
             </Link>
             <SidebarRow Icon={SlideshowSharpIcon} title="Your videos"/>
             <SidebarRow Icon={WatchLaterSharpIcon} title="Watch later"/>
             <SidebarRow Icon={ThumbUpOffAltIcon} title="Liked videos"/>
             <hr />

            </div>
    );
}

export default Sidebar;