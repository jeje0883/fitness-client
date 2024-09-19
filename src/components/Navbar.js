import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/sharedStyles.css'; // Import the CSS file

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">MyFitnessApp</h1>
      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        ) : (
          <>
            <span className="navbar-welcome">Welcome, {user.email}</span>
            <Link to="/workouts" className="navbar-link">Workouts</Link>
            <button onClick={handleLogout} className="navbar-logout-button">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
