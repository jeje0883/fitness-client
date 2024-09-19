// src/pages/Register.js
import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/sharedStyles.css'; // Import the CSS file

const Register = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for registration logic
    const userData = { email };
    login(userData);
    navigate('/workouts');
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login" className="link">Login here.</Link>
      </p>
    </div>
  );
};

export default Register;
