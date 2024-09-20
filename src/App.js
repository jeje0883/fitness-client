// src/App.js
import React from 'react';
import { UserProvider } from './context/UserContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Workouts from './pages/Workouts';
import Register from './pages/Register';
import NavBar from './components/NavBarLink';


// Import other pages as needed

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/register" element={<Register />} />
          {/* Add other routes here */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
  
};

export default App;
