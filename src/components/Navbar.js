// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>MyFitnessApp</h1>
      <div style={styles.links}>
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            <span style={styles.welcome}>Welcome, {user.email}</span>
            <Link to="/workouts" style={styles.link}>Workouts</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

// Updated inline styles for better consistency
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure all items align properly
    padding: '20px',
    backgroundColor: '#333',
    color: 'white',
  },
  logo: {
    fontSize: '24px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
    padding: '10px', // Add padding to match button's size
  },
  welcome: {
    marginRight: '10px',
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    marginLeft: '10px', // Add margin to separate from the links
  },
};

export default Navbar;
