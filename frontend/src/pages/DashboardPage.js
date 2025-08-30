import React, { useState, useEffect } from 'react';
import AlertList from '../components/AlertList';
import MapView from '../components/MapView';
import * as api from '../api/touristApi';

function DashboardPage() {
  const [alerts, setAlerts] = useState([]);
  const [lastLocation, setLastLocation] = useState(null);

  useEffect(() => {
    // Fetch alerts immediately and then every 5 seconds
    const fetchAlerts = () => {
      api.getAlerts()
        .then(data => {
          setAlerts(data.alerts);
          // For the map, track the location from the latest alert
          if (data.alerts.length > 0 && data.alerts[0].location) {
            setLastLocation(data.alerts[0].location);
          }
        })
        .catch(error => console.error("Failed to fetch alerts:", error));
    };

    fetchAlerts();
    const intervalId = setInterval(fetchAlerts, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <section className="page-section">
      <h2>Authority Dashboard</h2>
      <MapView location={lastLocation} />
      <AlertList alerts={alerts} />
    </section>
  );
}

export default DashboardPage;