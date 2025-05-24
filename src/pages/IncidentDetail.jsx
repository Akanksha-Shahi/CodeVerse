// IncidentDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';

const IncidentDetail = () => {
  const { id } = useParams(); // Get the incident ID from the URL parameters
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const incidentDoc = await firestore.collection('incidents').doc(id).get();
        if (incidentDoc.exists) {
          setIncident({ id: incidentDoc.id, ...incidentDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching incident: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChatMessages = async () => {
      try {
        const chatSnapshot = await firestore.collection('chats').doc(id).collection('messages').get();
        const messagesData = chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatMessages(messagesData);
      } catch (error) {
        console.error("Error fetching chat messages: ", error);
      }
    };

    fetchIncident();
    fetchChatMessages();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      await firestore.collection('chats').doc(id).collection('messages').add({
        sender: "Current User", // Replace with actual user info
        message: newMessage,
        timestamp: new Date().toISOString(),
      });
      setChatMessages([...chatMessages, { sender: "Current User", message: newMessage, timestamp: new Date().toISOString() }]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  if (loading) {
    return <p>Loading incident details...</p>;
  }

  if (!incident) {
    return <p>Incident not found.</p>;
  }

  return (
    <div>
      <h1>Incident Detail</h1>
      <h2>{incident.title}</h2>
      <p><strong>Description:</strong> {incident.description}</p>
      <p><strong>Priority:</strong> {incident.priority}</p>
      <p><strong>Status:</strong> {incident.status}</p>
      <h3>Chat Messages</h3>
      <div>
        {chatMessages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.message} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default IncidentDetail;
