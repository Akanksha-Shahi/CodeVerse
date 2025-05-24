// AdminPanel.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';

const AdminPanel = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const snapshot = await firestore.collection('incidents').get();
        const incidentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setIncidents(incidentsData);
      } catch (error) {
        console.error("Error fetching incidents: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const handleResolve = async (id) => {
    try {
      await firestore.collection('incidents').doc(id).update({ status: 'Resolved' });
      setIncidents(incidents.map(incident => incident.id === id ? { ...incident, status: 'Resolved' } : incident));
    } catch (error) {
      console.error("Error resolving incident: ", error);
    }
  };

  if (loading) {
    return <p>Loading incidents...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Incident Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => (
            <tr key={incident.id}>
              <td>{incident.title}</td>
              <td>{incident.description}</td>
              <td>{incident.priority}</td>
              <td>{incident.status}</td>
              <td>
                {incident.status === 'Open' && (
                  <button onClick={() => handleResolve(incident.id)}>Mark as Resolved</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
