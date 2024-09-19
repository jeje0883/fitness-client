// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the UserContext
export const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage, if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('filnessUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to handle user login
  const login = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('filnessUser', JSON.stringify(userInfo));
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('filnessUser');
  };

  // Optional: Synchronize state across tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'filnessUser') {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
