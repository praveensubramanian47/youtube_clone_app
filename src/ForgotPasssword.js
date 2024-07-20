import React, {useState} from 'react'
import axios from 'axios';
import "./ForgotPassword.css";

function ForgotPasssword() {

  const [successmsg, setSuccessmsg] = useState();
  const[Credentials, setCredentials] = useState({
    email:'',
  });


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
        },
      });
      setSuccessmsg(response.data.message);
      setCredentials("");
    }
    catch(error){
      console.error(error);
    }
  };
  return (
    <div className='ForgotPassword'>
      <div className='content'>
       <form onSubmit={handleForgotPassword}>
          <h2>Forgot Passsword</h2>
          <p>Enter your email to receive an email for reset tour password.</p>
          <input type='email' placeholder='Email' name='email'value={Credentials.email} onChange={handleChange}/> <br />
          {successmsg && <p className='forgot_success_msg'>{successmsg}</p>}
          <button type='submit' className='forgotbtn'><h3>Send</h3></button>
       </form> 
      </div>
    </div>
  ) 
}

export default ForgotPasssword
