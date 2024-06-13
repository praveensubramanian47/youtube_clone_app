import React, { useRef, useState } from 'react';
import './UploadVideo.css';
import UploadSharpIcon from '@mui/icons-material/UploadSharp';
import axios from 'axios';


function UploadVideo() {
  const fileInputRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [msg, setmsg] = useState(null);
  const [formData, setFormData] = useState({
    token: '1',
    user_name: 'sk',
    title: 'Playvideo',
    description: 'Video is on',
    video: null, // Will store the selected video file
  });

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger click event on file input element
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      video: file,
    });
  
    // Generate a URL-like representation of the file
    const fileUrl = URL.createObjectURL(file);
    setVideoUrl(fileUrl);

    setFormData({
      ...formData,
      video: fileUrl,
    });
  };

  // const valueToShow = {msg};
  // const showAlert = () => {
    // alert({valueToShow});
  // };


  const handleUpload = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post('http://127.0.0.1:8000/api/uploadvideo', formData);
        // video: videoUrl, // Pass the video URL to the backend API
        
      // });
      console.log('Successful:', response.data);

      setmsg(
        response.data.message
      );

      console.log(msg);

    } catch (error) {
      console.error('Failed:', error);
    } 
  };

  return (
    <div className='UploadVideo'>
      <form onSubmit={handleUpload}>
        <div className='heading'>
          <h3>Upload Videos</h3>
          <hr />
          <div className='uploadIcon'>
            <UploadSharpIcon classes='icon' style={{ fontSize: 70 }} />
          </div>
          <p>{msg}</p>
          <div className='contents'>
            <span>
              <p className='para1'>Drag and drop video file to upload</p>
              <p className='para2'>Your videos will be private until you publish them</p>
            </span>
          </div>
          <input
            type='file'
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            name='video'
          /> 
          <div className='upload_btn'>
            <button className='button' type='button' onClick={handleButtonClick}>
              SELECT FILES
            </button>
            <button className='button' type='submit'>
            UPLOAD
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UploadVideo;
