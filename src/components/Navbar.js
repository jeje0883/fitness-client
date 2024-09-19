// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Branding/Logo */}
        <Link to="/" className="navbar-logo">
          FitnessTracker<span>API</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/workouts" className="nav-links">
                  Workouts
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-links logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
