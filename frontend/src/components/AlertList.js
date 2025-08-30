import React from 'react';

function AlertList({ alerts }) {
  if (alerts.length === 0) {
    return <p>No alerts at the moment.</p>;
  }

  return (
    <>
      <h3>Live Alerts</h3>
      <ul className="alert-list">
        {alerts.map((alert, index) => (
          <li key={index} className="alert-item">
            <strong>{alert.type.replace(/_/g, ' ')}</strong>
            <p>{alert.message}</p>
            <small>Tourist ID: {alert.tourist_id} | {new Date(alert.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </>
  );
}

export default AlertList;