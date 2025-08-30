import React from 'react';
import TouristAppPage from './pages/TouristAppPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="app-container">
      {/* For the demo, we show both pages at once. */}
      <TouristAppPage />
      <DashboardPage />
    </div>
  );
}

export default App;