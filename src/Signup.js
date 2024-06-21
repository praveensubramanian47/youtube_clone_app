import React, { useState, useContext } from "react";
import "./Signup.css";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function Signup() {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handlesignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://insightech.cloud/videotube/api/public/api/register', credentials);
      console.log('Signup successful:', response.data);

      setUser({ name: credentials.name, email: credentials.email });

      // Handle success (e.g., update state, redirect, etc.)
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="Signup">
      <div className='signup_content'>
        <form onSubmit={handlesignup}>
          <h2>Signup</h2> <br />
          <input type='text' placeholder='Name' name='name' value={credentials.name} onChange={handleChange} /> <br />
          <input type='email' placeholder='Email' name='email' value={credentials.email} onChange={handleChange} /> <br />
          <input type='password' placeholder='Password' name='password' onChange={handleChange} /> <br />
          <input type='password' placeholder='Confirm password' name='confirmPassword' onChange={handleChange} /> <br />
          <button type='submit' className="signupbtn"><h3>Signup</h3></button>
        </form>

        <div className='signup_withOther'>
          <hr className='hr1'/>
          <span>OR</span>
          <hr className='hr2'/>
        </div>

        <div className='signup_withIcon'>
          <FontAwesomeIcon icon={faGoogle} />
          <FontAwesomeIcon icon={faFacebookF} />
          <FontAwesomeIcon className='apple' icon={faApple} />
        </div>

        <div className='sign'>
          <p>Already have an account!
            <Link to={'/login'} className='ink-no-style'>
              <span>Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
