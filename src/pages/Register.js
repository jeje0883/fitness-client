

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/sharedStyles.css'; // Import the CSS file

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added confirm password state
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); // State to handle loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password matches confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true); // Set loading to true

      // Make API call to register the user
      const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password to the API
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Registration failed");
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      // Optionally, log the user in directly after successful registration:
      // const userData = { email };
      // login(userData);

      navigate('/login'); // Navigate to the login page on successful registration

    } catch (err) {
      setError(err.message); // Set error message on failure
    } finally {
      setLoading(false); // Stop loading once request is completed
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>} {/* Display error if any */}
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login" className="link">Login here.</Link>
      </p>
    </div>
  );
};

export default Register;
