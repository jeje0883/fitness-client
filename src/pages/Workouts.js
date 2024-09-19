// src/pages/Workouts.js
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Import jwt-decode
import '../styles/sharedStyles.css'; // Import the CSS file

const Workouts = () => {
  const { user } = useContext(UserContext); // user is the JWT token string
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '' });
  const [editWorkout, setEditWorkout] = useState(null); // Holds workout details for editing
  const [userEmail, setUserEmail] = useState('');

  // Decode the JWT token to get user information
  useEffect(() => {
    if (user) {
      try {
        const decoded = jwtDecode(user);
        setUserEmail(decoded.email);
      } catch (err) {
        setError('Invalid token. Please log in again.');
      }
    }
  }, [user]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch workouts when the component mounts or user changes
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/workouts/getMyWorkouts`, {
          headers: {
            'Authorization': `Bearer ${user}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch workouts: ${response.statusText}`);
        }

        const data = await response.json();
        setWorkouts(data.workouts || data); // Adjust based on API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  // Add workout
  const handleAddWorkout = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newWorkout.name.trim() || !newWorkout.duration.trim()) {
      setError('Please provide both name and duration for the workout.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/workouts/addWorkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`,
        },
        body: JSON.stringify(newWorkout),
      });

      if (!response.ok) {
        throw new Error(`Failed to add workout: ${response.statusText}`);
      }

      const addedWorkout = await response.json();
      setWorkouts((prevWorkouts) => Array.isArray(prevWorkouts) ? [...prevWorkouts, addedWorkout] : [addedWorkout]);

      setNewWorkout({ name: '', duration: '' }); // Reset form
    } catch (err) {
      setError(err.message);
    }
  };

  // Mark as done 
  const handleMarkAsDone = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/workouts/completeWorkoutStatus/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update workout status: ${response.statusText}`);
      }

      setWorkouts((prevWorkouts) =>
        Array.isArray(prevWorkouts)
          ? prevWorkouts.map((workout) =>
              workout.id === id ? { ...workout, completed: true } : workout
            )
          : []
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete workout
  const handleDeleteWorkout = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/workouts/deleteWorkout/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete workout: ${response.statusText}`);
      }

      // Update the workouts state by filtering out the deleted workout
      setWorkouts((prevWorkouts) =>
        Array.isArray(prevWorkouts)
          ? prevWorkouts.filter((workout) => (workout.id || workout._id) !== id)
          : []
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Update workout
  const handleUpdateWorkout = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!editWorkout.name.trim() || !editWorkout.duration.trim()) {
      setError('Please provide both name and duration for the workout.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/workouts/updateWorkout/${editWorkout.id || editWorkout._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`,
        },
        body: JSON.stringify(editWorkout),
      });

      if (!response.ok) {
        throw new Error(`Failed to update workout: ${response.statusText}`);
      }

      const updatedWorkout = await response.json();
      setWorkouts((prevWorkouts) =>
        Array.isArray(prevWorkouts)
          ? prevWorkouts.map((workout) =>
              workout.id === updatedWorkout.id || workout._id === updatedWorkout._id
                ? updatedWorkout
                : workout
            )
          : []
      );

      setEditWorkout(null); // Close edit modal
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return null; // Optionally, you can return a loader or a placeholder
  }

  return (
    <div className="container">
      <h2>Welcome, {userEmail || 'User'}!</h2> {/* Use decoded email or fallback */}

      {loading && <p>Loading workouts...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="add-workout-section">
            <h3>Add New Workout</h3>
            <form onSubmit={handleAddWorkout} className="workout-form">
              <input
                type="text"
                name="name"
                placeholder="Workout Name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                required
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g., 30 mins)"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                required
              />
              <button type="submit" className="button">
                Add Workout
              </button>
            </form>
          </section>

          <section className="workout-list-section">
            {workouts.length > 0 ? (
              <table className="workout-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Workout Name</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout, index) => (
                    <tr key={workout.id || workout._id}>
                      <td>{index + 1}</td>
                      <td>{workout.name}</td>
                      <td>{workout.duration}</td>
                      <td>
                        <button
                          onClick={() => handleMarkAsDone(workout.id || workout._id)}
                          className={workout.completed || workout.status === 'completed' ? 'button-green' : 'button-yellow'}
                          disabled={workout.completed || workout.status === 'completed'}
                        >
                          {workout.completed || workout.status === 'completed' ? 'Done' : 'Mark as Done'}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => setEditWorkout(workout)}
                          className="button-blue"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWorkout(workout.id || workout._id)}
                          className="button-red"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No workouts found. Start adding some!</p>
            )}
          </section>
        </>
      )}

      {/* Edit Workout Modal */}
      {editWorkout && (
        <div className="modal-overlay" onClick={() => setEditWorkout(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Workout</h3>
            <form onSubmit={handleUpdateWorkout} className="workout-form">
              <input
                type="text"
                name="name"
                placeholder="Workout Name"
                value={editWorkout.name}
                onChange={(e) => setEditWorkout({ ...editWorkout, name: e.target.value })}
                required
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g., 30 mins)"
                value={editWorkout.duration}
                onChange={(e) => setEditWorkout({ ...editWorkout, duration: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="button">
                  Update Workout
                </button>
                <button
                  type="button"
                  onClick={() => setEditWorkout(null)}
                  className="button button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
