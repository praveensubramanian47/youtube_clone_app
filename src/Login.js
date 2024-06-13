import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://insightech.cloud/videotube/api/public/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user_id, name } = data;

        setCookie('token', token, 1); // 1 day expiry
        setCookie('user_id', user_id, 1); // 1 day expiry
        setCookie('user_name', name, 1); // 1 day expiry

        console.log(name, token, user_id);
        setMessage('Login successful');
        navigate('/');
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className='Login'>
      <div className='login_content'>
        <form method="POST" onSubmit={handleLogin}>
          <h2>Login</h2> <br />
          <input type='email' id='email' placeholder='Email' name='email' value= {credentials.email} onChange={handleChange}/> <br />
          <input type='password' id='password' placeholder='Password' name='password' value={credentials.password} onChange={handleChange}/> <br />
          <div className='rememberMe'>
            <div className='checkbox'>
              <input type="checkbox" name="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <div className='checkbox2'>
              <Link to={'/forgotpassword'} className='ink-no-style'>
                <label htmlFor="forgetpassword">Forgot password?</label>
              </Link> 
            </div>           
          </div>
          <button type='submit'><h3>Login</h3></button>
        </form>
        <div className='login_withOther'>
            <hr className='hr1'/>
            <span>OR</span>
            <hr className='hr2'/>
        </div>
        <div className='login_withIcon'>
          <FontAwesomeIcon icon={faGoogle} />
          <FontAwesomeIcon icon={faFacebookF} />
          <FontAwesomeIcon className='icons' icon={faApple}/>
        </div>
        <div className='register'>
          <p>Don't have an account? 
            <Link to={'/signup'} className='ink-no-style'>
              <span>Register Now</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
