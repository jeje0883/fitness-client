import React, { useContext, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';  // Add this line
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/sharedStyles.css'; // Import the CSS file


const Workouts = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '' });
  const [editWorkout, setEditWorkout] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Unified error handler
  const handleError = (message) => {
    console.error(message);
    setError(message);
    setLoading(false);
  };

  // Fetch workouts when the user is logged in
  const fetchWorkouts = useCallback(async () => {
    try {
      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts`, {
        headers: { 'Authorization': `Bearer ${user}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.statusText}`);
      }

      const data = await response.json();
      setWorkouts(data.workouts || data);
    } catch (err) {
      handleError(`Error fetching workouts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchWorkouts();
    }
  }, [user, navigate, fetchWorkouts]);

  // Add new workout
  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkout.name.trim() || !newWorkout.duration.trim()) {
      setError('Please provide both name and duration for the workout.');
      return;
    }

    try {
      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout`, {
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

      setNewWorkout({ name: '', duration: '' });
      fetchWorkouts();
    } catch (err) {
      handleError(`Error adding workout: ${err.message}`);
    }
  };

  // Mark workout as done
  const handleMarkAsDone = async (id) => {
    try {
      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to update workout status: ${response.statusText}`);
      }

      fetchWorkouts();
    } catch (err) {
      handleError(`Error marking workout as done: ${err.message}`);
    }
  };

  // Delete workout
  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete workout: ${response.statusText}`);
        }

        fetchWorkouts();
      } catch (err) {
        handleError(`Error deleting workout: ${err.message}`);
      }
    }
  };

  // Update workout
  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    if (!editWorkout.name.trim() || !editWorkout.duration.trim()) {
      setError('Please provide both name and duration for the workout.');
      return;
    }

    try {
      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${editWorkout.id || editWorkout._id}`, {
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

      setEditWorkout(null);
      fetchWorkouts();
    } catch (err) {
      handleError(`Error updating workout: ${err.message}`);
    }
  };

  // return (
  //   <div className="container">
  //     <h2>Welcome, {user?.email || 'User'}!</h2>

  //     {loading && <p>Loading workouts...</p>}
  //     {error && <p className="error">{error}</p>}

  //     {!loading && !error && (
  //       <>
  //         <section className="add-workout-section">
  //           <h3>Add New Workout</h3>
  //           <form onSubmit={handleAddWorkout} className="workout-form">
  //             <input
  //               type="text"
  //               name="name"
  //               placeholder="Workout Name"
  //               value={newWorkout.name}
  //               onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
  //               required
  //             />
  //             <input
  //               type="text"
  //               name="duration"
  //               placeholder="Duration (e.g., 30 mins)"
  //               value={newWorkout.duration}
  //               onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
  //               required
  //             />
  //             <button type="submit" className="button">Add Workout</button>
  //           </form>
  //         </section>

  //         <section className="workout-list-section">
  //           {workouts.length > 0 ? (
  //             <table className="workout-table">
  //               <thead>
  //                 <tr>
  //                   <th>#</th>
  //                   <th>Workout Name</th>
  //                   <th>Duration</th>
  //                   <th>Status</th>
  //                   <th>Actions</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {workouts.map((workout, index) => (
  //                   <tr key={workout.id || workout._id || index}>
  //                     <td>{index + 1}</td>
  //                     <td>{workout.name}</td>
  //                     <td>{workout.duration}</td>
  //                     <td>
  //                       <button
  //                         onClick={() => handleMarkAsDone(workout.id || workout._id)}
  //                         className={workout.completed || workout.status === 'completed' ? 'button-green' : 'button-yellow'}
  //                         disabled={workout.completed || workout.status === 'completed'}
  //                       >
  //                         {workout.completed || workout.status === 'completed' ? 'Done' : 'Mark as Done'}
  //                       </button>
  //                     </td>
  //                     <td>
  //                       <button onClick={() => setEditWorkout(workout)} className="button-blue">Edit</button>
  //                       <button onClick={() => handleDeleteWorkout(workout.id || workout._id)} className="button-red">Delete</button>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           ) : (
  //             <p>No workouts found. Start adding some!</p>
  //           )}
  //         </section>
  //       </>
  //     )}

  //     {/* Edit Workout Modal */}
  //     {editWorkout && ReactDOM.createPortal(
  //       <div className="modal-overlay" onClick={() => setEditWorkout(null)}>
  //         <div className="modal" onClick={(e) => e.stopPropagation()}>
  //           <h3>Edit Workout</h3>
  //           <form onSubmit={handleUpdateWorkout} className="workout-form">
  //             <input
  //               type="text"
  //               name="name"
  //               placeholder="Workout Name"
  //               value={editWorkout.name}
  //               onChange={(e) => setEditWorkout({ ...editWorkout, name: e.target.value })}
  //               required
  //             />
  //             <input
  //               type="text"
  //               name="duration"
  //               placeholder="Duration (e.g., 30 mins)"
  //               value={editWorkout.duration}
  //               onChange={(e) => setEditWorkout({ ...editWorkout, duration: e.target.value })}
  //               required
  //             />
  //             <div className="modal-actions">
  //               <button type="submit" className="button">Update Workout</button>
  //               <button type="button" onClick={() => setEditWorkout(null)} className="button button-secondary">Cancel</button>
  //             </div>
  //           </form>
  //         </div>
  //       </div>,
  //       document.body 
  //     )}
  //   </div>
  // );


  return (
    <div className="container">
      <h2>Welcome, {user?.email || 'User'}!</h2>

      {loading && <p>Loading workouts...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="add-workout-section">
            <button onClick={() => setShowAddModal(true)} className="button">Add New Workout</button>
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
                    <tr key={workout.id || workout._id || index}>
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
                        <button onClick={() => setEditWorkout(workout)} className="button-blue">Edit</button>
                        <button onClick={() => handleDeleteWorkout(workout.id || workout._id)} className="button-red">Delete</button>
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

      {/* Add Workout Modal */}
      {showAddModal && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
              <div className="modal-actions">
                <button id="addWorkout" type="submit" className="button">Add Workout</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="button button-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Workout Modal */}
      {editWorkout && ReactDOM.createPortal(
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
                <button type="submit" className="button">Update Workout</button>
                <button type="button" onClick={() => setEditWorkout(null)} className="button button-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );


};

export default Workouts;
