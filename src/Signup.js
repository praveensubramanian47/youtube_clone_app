import React, { useState } from "react";
import "./Signup.css";
import axios from "axios";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faApple,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from './UserContext';

function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  // const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/;
    if (!regex.test(password)) {
      return "Include uppercase, lowercase, digits, and special characters";
    }
    return "";
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const passwordValidationError = validatePassword(credentials.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    } else {
      setPasswordError("");
    }

    if (credentials.password !== credentials.confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      const response = await axios.post(
        "https://insightech.cloud/videotube/api/public/api/register",
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          user_name: credentials.user_name,
        }
      );
      console.log("Signup successful:", response.data);

      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle error (e.g., display an error message)
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="Signup">
      <div className="signup_content">
        <form onSubmit={handleSignup}>
          <h2>Signup</h2> <br />
          <input
            type="text"
            placeholder="User name"
            name="user_name"
            value={credentials.user_name}
            onChange={handleChange}
          />{" "}
          <br />
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={credentials.name}
            onChange={handleChange}
          />{" "}
          <br />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />{" "}
          <br />
          <div className="password-input-container">
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
          {passwordError && <p className="error-message">{passwordError}</p>}
          <div className="password-input-container">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleChange}
            />
            <button type="button" onClick={toggleConfirmPasswordVisibility}>
              {confirmPasswordVisible ? (
                <VisibilityOffSharpIcon />
              ) : (
                <RemoveRedEyeSharpIcon />
              )}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="error-message">{confirmPasswordError}</p>
          )}
          <button type="submit" className="signupbtn">
            <h6>Signup</h6>
          </button>
        </form>

        <div className="sign">
          <p>
            Already have an account!
            <Link to={"/login"} className="ink-no-style">
              <span>Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
