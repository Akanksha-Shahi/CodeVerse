// ThreatForm.js
import React, { useState } from 'react';
import { firestore, auth } from '../firebase';

const ThreatForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      setError('Please select a location on the map.');
      return;
    }

    try {
      const user = auth.currentUser ;
      await firestore.collection('incidents').add({
        title,
        description,
        priority,
        location,
        status: 'Open',
        reportedBy: user.uid,
        timestamp: new Date().toISOString(),
      });
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('Low');
      setLocation({ lat: null, lng: null });
      setError('');
    } catch (error) {
      console.error("Error reporting threat: ", error);
      setError('Failed to report threat.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report Threat</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <p>Location: {location.lat && location.lng ? `${location.lat}, ${location.lng}` : 'Not set'}</p>
      <button type="submit">Submit Threat</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default ThreatForm;
