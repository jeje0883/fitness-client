// src/pages/Workouts.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Workouts.css';

const Workouts = () => {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workouts when the component mounts
  useEffect(() => {

     const token = localStorage.getItem('token'); 
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authentication headers if required
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id }), // Assuming the backend expects 'userId'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch workouts.');
        }

        const data = await response.json();
        setWorkouts(data.workouts); // Adjust based on your API's response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchWorkouts();
    } else {
      setError('User not authenticated.');
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="workouts-container">
      <h2>My Workouts</h2>

      {loading && <p>Loading workouts...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && workouts.length === 0 && (
        <p>You have no workouts. Start by adding some!</p>
      )}

      {!loading && !error && workouts.length > 0 && (
        <table className="workouts-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Weight (kg)</th>
              {/* Add more headers based on your workout data */}
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout, index) => (
              <tr key={workout.id || index}>
                <td>{index + 1}</td>
                <td>{new Date(workout.date).toLocaleDateString()}</td>
                <td>{workout.exercise}</td>
                <td>{workout.sets}</td>
                <td>{workout.reps}</td>
                <td>{workout.weight}</td>
                {/* Add more cells based on your workout data */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Workouts;
