// Home.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';

const Home = () => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      history.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div>
      <h1>Welcome to RTACS</h1>
      <p>Your real-time threat alert and coordination system.</p>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h2>Features</h2>
        <ul>
          <li><a href="/report">Report Threat</a></li>
          <li><a href="/map">View Live Threat Map</a></li>
          <li><a href="/chat">Coordination Chatroom</a></li>
          <li><a href="/dashboard">Admin Dashboard</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
