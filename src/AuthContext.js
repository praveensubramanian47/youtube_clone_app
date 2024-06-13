import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post('https://insightech.cloud/videotube/api/public/api/login', credentials);
      const accessToken = response.data.token;
      const user_id = response.data.user_id; // Assuming the API returns the user ID
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', user_id);
      setToken(accessToken);
      setUserId(user_id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      console.log('Login successful', response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  console.log('token:', token);
  console.log('userId:', userId);

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
