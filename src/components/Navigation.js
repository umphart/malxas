import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">Scrap Tracker</Link>
      </div>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/">Daily Record</Link>
            <Link to="/history">History</Link>
            <Link to="/dashboard">Dashboard</Link>
            <div className="user-info">
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;