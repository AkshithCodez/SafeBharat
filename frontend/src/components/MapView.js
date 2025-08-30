import React from 'react';

function MapView({ location }) {
  return (
    <div className="map-view-placeholder" style={{
      backgroundColor: '#333',
      padding: '20px',
      borderRadius: '4px',
      textAlign: 'center',
      marginBottom: '20px'
    }}>
      <h3>Last Known Location</h3>
      {/* In a real app, you would integrate React-Leaflet or Google Maps here */}
      {location ? (
        <p>{`Lat: ${location.lat.toFixed(4)}, Lon: ${location.lon.toFixed(4)}`}</p>
      ) : (
        <p>Waiting for location data from an alert...</p>
      )}
    </div>
  );
}

export default MapView;