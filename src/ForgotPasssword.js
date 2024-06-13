import React, {useState, useContext} from 'react'
import axios from 'axios';
import "./ForgotPassword.css";
import { AuthContext } from './AuthContext';
import { Alert } from 'react-bootstrap';


function ForgotPasssword() {

  const { token } = useContext(AuthContext);
  const[Credentials, setCredentials] = useState({
    email:'',
  });

  //Alert function
  const showAlert = (message) => {
    return (
      <Alert variant="warning">
        {message}
      </Alert>
    );
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try{
      const response = await axios.post('https://insightech.cloud/videotube/api/public/api/forgotpassword', Credentials , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the bearer token here
        },
      });
      console.log('Message send sucessfully:', response.data);
    }
    catch(error){
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // console.error('Request data:', error.request);
        showAlert(error.request.email);
        
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      console.error('Config:', error.config);
    }
  };
  return (
    <div className='ForgotPassword'>
      <div className='content'>
       <form onSubmit={handleForgotPassword}>
          <h2>Forgot Passsword</h2>
          <p>Enter your email to receive an email for reset tour password.</p>
          <input type='email' placeholder='Email' name='email'value={Credentials.email} onChange={handleChange}/> <br />
          <button type='submit' className='forgotbtn'><h3>Send</h3></button>
       </form> 
      </div>
    </div>
  ) 
}

export default ForgotPasssword
