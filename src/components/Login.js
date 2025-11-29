// src/components/Login.js - Updated
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import './Auth.css';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    // Check if admin exists and show appropriate message
    const adminExists = authService.hasAdminUser();
    if (!adminExists) {
      setInfo('No admin account found. Redirecting to registration...');
      setTimeout(() => onSwitchToRegister(), 2000);
    }
  }, [onSwitchToRegister]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.username.trim() || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(formData.username, formData.password);
      
      if (result.success) {
        console.log('Login successful, user:', result.user);
        login(result.user, result.token);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (info) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="info-message">{info}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter admin username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          <p>Need to create an admin account? </p>
          <button 
            type="button" 
            className="switch-button"
            onClick={onSwitchToRegister}
          >
            Create Admin Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;