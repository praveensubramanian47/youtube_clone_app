import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faApple,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import { signInWithPopup, auth, googleProvider } from "./FirebaseConfig";
import axios from "axios";

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

function Login() {
  const [successmsg, setSuccessmsg] = useState();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://insightech.cloud/videotube/api/public/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const { token, user_id, name, email, username, profile_image } = data;
        console.log("Data:-", data);
        setSuccessmsg(data.message);


        setCookie("token", token, 1);
        setCookie("user_id", user_id, 1); 
        setCookie("user_name", name, 1);
        setCookie("email", email, 1);
        setCookie("channel_name", username, 1);
        setCookie("profile_img", profile_image, 1);

        setError(""); // Clear any previous error messages
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        console.log("Error:-", errorData.message);
      }
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = result.user.accessToken;
      const {
        email,
        displayName: name,
        uid: user_id,
        photoURL: profile_image,
      } = result.user;

      console.log("Google user details:", {
        name,
        user_id,
        email,
        profile_image,
      });

      const requestBody = {
        email: email,
        name: name,
        token: token,
      };

      console.log(requestBody);

      const { data } = await axios.post(
        "https://insightech.cloud/videotube/api/public/api/sociallogin",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessmsg(data.status.message);
      console.log("data:-", data.status);

      setCookie("token", data.status.Token, 1);
      setCookie("user_id", data.status.user_id, 1); 
      setCookie("email", email, 1);
      setCookie("channel_name", data.status.username, 1);
      setCookie("profile_img", data.status.profile_image);
      setCookie("user_name", data.status.name);
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="Login">
      <div className="login_content">
        <form method="POST" onSubmit={handleLogin}>
          <h2>Login</h2> <br />
          <input
            type="email"
            id="email"
            placeholder="Email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />{" "}
          <br />
          <div className="password-login-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {passwordVisible ? (
                <VisibilityOffSharpIcon />
              ) : (
                <RemoveRedEyeSharpIcon />
              )}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="rememberMe">
            <div className="checkbox">
              <input type="checkbox" name="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <div className="checkbox2">
              <Link to={"/forgotpassword"} className="ink-no-style">
                <label htmlFor="forgetpassword">Forgot password?</label>
              </Link>
            </div>
          </div>
          {successmsg && <p className="login_success_msg">{successmsg}</p>}
          <button className="login_bth" type="submit">
            <h6>Login</h6>
          </button>
        </form>
        <div className="login_withOther">
          <hr className="hr1" />
          <span>OR</span>
          <hr className="hr2" />
        </div>
        <div className="login_withIcon">
          <FontAwesomeIcon icon={faGoogle} onClick={handleGoogleSignIn} />
          <FontAwesomeIcon icon={faFacebookF} />
          <FontAwesomeIcon className="apple" icon={faApple} />
        </div>
        <div className="register">
          <p>
            Don't have an account?
            <Link to={"/signup"} className="ink-no-style">
              <span>Register Now</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
