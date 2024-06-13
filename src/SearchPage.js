import React from 'react'
import './SearchPage.css'
import ChannelRow from './ChannelRow';
import VideoRow from './VideoRow';
import TuneSharpIcon from '@mui/icons-material/TuneSharp';

function SearchPage() {
  return (
    <div className='searchPage'>
      <div className='searchPage_filter'>
        <TuneSharpIcon />
        <h2>FILTER</h2>
      </div>

      <hr />

      <VideoRow 
      views="1.4k"
      subs="659k"
      description="If you encounter messages promising free training or any other offers, make sure to verify the source, check for official communication channels, and exercise caution before clicking on any links. Be especially wary if the message is unsolicited or comes from an unfamiliar source."
      timestamp="59 seconds ago"
      channel="Rahul M"
      title="How to start your first invesment"
      image="https://picsum.photos/250/140"/>

      <VideoRow 
      views="1.4k"
      subs="659k"
      description="If you encounter messages promising free training or any other offers, make sure to verify the source, check for official communication channels, and exercise caution before clicking on any links. Be especially wary if the message is unsolicited or comes from an unfamiliar source."
      timestamp="59 seconds ago"
      channel="Rahul M"
      title="How to start your first invesment"
      image="https://picsum.photos/250/140"/>

      <VideoRow 
      views="1.4k"
      subs="659k"
      description="If you encounter messages promising free training or any other offers, make sure to verify the source, check for official communication channels, and exercise caution before clicking on any links. Be especially wary if the message is unsolicited or comes from an unfamiliar source."
      timestamp="59 seconds ago"
      channel="Rahul M"
      title="How to start your first invesment"
      image="https://picsum.photos/250/140"/>

      <VideoRow 
      views="1.4k"
      subs="659k"
      description="If you encounter messages promising free training or any other offers, make sure to verify the source, check for official communication channels, and exercise caution before clicking on any links. Be especially wary if the message is unsolicited or comes from an unfamiliar source."
      timestamp="59 seconds ago"
      channel="Rahul M"
      title="How to start your first invesment"
      image="https://picsum.photos/250/140"/>

      <VideoRow 
      views="1.4k"
      subs="659k"
      description="If you encounter messages promising free training or any other offers, make sure to verify the source, check for official communication channels, and exercise caution before clicking on any links. Be especially wary if the message is unsolicited or comes from an unfamiliar source."
      timestamp="59 seconds ago"
      channel="Rahul M"
      title="How to start your first invesment"
      image="https://picsum.photos/250/140"/>

      <VideoRow 
      views="1.4k"
      subs="659k"
      description="If you encounter messages promising free training or any other offers, make sure to verify the source, check for official communication channels, and exercise caution before clicking on any links. Be especially wary if the message is unsolicited or comes from an unfamiliar source."
      timestamp="59 seconds ago"
      channel="Rahul M"
      title="How to start your first invesment"
      image="https://picsum.photos/250/140"/>
    </div>
  )
}

export default SearchPage