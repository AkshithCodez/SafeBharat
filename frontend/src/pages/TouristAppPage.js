import React, { useState, useEffect } from 'react';
import PanicButton from '../components/PanicButton';
import * as api from '../api/touristApi';

const TOURIST_ID = 'tourist_1701';

function TouristAppPage() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    api.registerTourist({ id: TOURIST_ID, name: 'Ravi Kumar', emergency_contact: '9876543210' })
      .then(() => setStatus('Registered. Tracking location...'))
      .catch(() => setStatus('Error: Registration failed'));

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          
          api.updateLocation({ tourist_id: TOURIST_ID, latitude, longitude })
            .then(() => setStatus('Protected'))
            .catch(() => setStatus('Error: Failed to update location'));
        },
        () => setStatus('Error: GPS permission denied.'),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setStatus('Error: Geolocation not supported');
    }
  }, []);

  const handlePanic = () => {
    if (!location.lat) {
      alert('Cannot get location. Cannot trigger panic.');
      return;
    }
    setStatus('PANIC SIGNAL SENT!');
    api.triggerPanic({ tourist_id: TOURIST_ID, latitude: location.lat, longitude: location.lon })
      .then(response => alert(response.message))
      .catch(error => alert(error.message));
  };

  return (
    <section className="page-section">
      <h2>Tourist Safety App 🇮🇳</h2>
      <div className="status-panel">
        <p>STATUS: <span className={status.includes('Error') ? 'status-error' : 'status-ok'}>{status}</span></p>
        <p>Location: {location.lat ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` : 'N/A'}</p>
      </div>
      <PanicButton onClick={handlePanic} />
    </section>
  );
}

export default TouristAppPage;