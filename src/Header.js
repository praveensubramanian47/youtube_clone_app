import React, { useState } from 'react';
import './Header.css';
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import VideoCallSharpIcon from '@mui/icons-material/VideoCallSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import SlideshowSharpIcon from '@mui/icons-material/SlideshowSharp';
import LiveTvSharpIcon from '@mui/icons-material/LiveTvSharp';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';

function Header(){

    const [inputSearch, setInputSearch] = useState("")
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };


    return(
        <div className='header'>
            <div className='header_left'>
                <MenuSharpIcon />
                <Link to={'/'}>
                <img 
                className='header_logo'
                src='https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_YouTube_%282015-2017%29.svg' alt=''
                />
                </Link>
                
            </div>
                

            <div className='header_input'>
                <input onChange={e => setInputSearch(e.target.value)} 
                value={inputSearch} 
                placeholder='Search'
                type='text'/>

                <Link to={`/search/${inputSearch}`}>
                    <SearchSharpIcon className='header_inputButton' />
                </Link>
            </div>
            
            <div className='header_icons'>
                <div className='header_icon' onClick={toggleOptions}>
                    <VideoCallSharpIcon />
                    
                    {showOptions && (
                        <div className='video_options'>
                            <Link to={'/upload_video'} className='ink-no-style'>
                             <div className='clcick_icons'>
                                <SlideshowSharpIcon className='Icon'/>
                                <span> Upload video</span>
                             </div>
                            </Link>

                            <div className='click_icons'>
                                <LiveTvSharpIcon className='Icon' />
                                <span>Go Live</span>
                            </div>
                            
                        </div>
                    )}
                </div>
                <NotificationsSharpIcon className='header_icon'/>

                <Link to={'/login'}>
                    <Avatar src="" alt="" sx={{ width: 25, height: 25 }} />
                </Link>

            </div>
            
        </div>
    );
}
                    

export default Header;