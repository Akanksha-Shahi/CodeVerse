// ThreatMap.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { firestore } from '../firebase';

const ThreatMap = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const snapshot = await firestore.collection('incidents').get();
        const incidentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setIncidents(incidentsData);
      } catch (error) {
        console.error("Error fetching incidents: ", error);
      }
    };

    fetchIncidents();
  }, []);

  const mapContainerStyle = {
    height: "400px",
    width: "800px"
  };

  const center = {
    lat: 28.61, // Default center latitude
    lng: 77.23  // Default center longitude
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        {incidents.map(incident => (
          <Marker
            key={incident.id}
            position={incident.location}
            title={incident.title}
            onClick={() => {
              // Handle marker click (e.g., navigate to incident detail)
              console.log(`Clicked on ${incident.title}`);
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default ThreatMap;
