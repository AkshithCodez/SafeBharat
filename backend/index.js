const express = require('express');
const { checkGeofence, detectAnomalies } = require('./services');

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory database for hackathon simplicity
const db = {
    tourists: {},
    location_history: {},
    alerts: []
};

// --- API Routes ---

app.post('/api/register', (req, res) => {
    const { id, name, emergency_contact } = req.body;
    if (!id || !name) return res.status(400).json({ error: 'ID and name are required.' });
    if (db.tourists[id]) return res.status(400).json({ error: 'Tourist already exists.' });

    db.tourists[id] = { id, name, emergency_contact };
    db.location_history[id] = [];
    console.log(`Registered: ${name} (ID: ${id})`);
    res.status(201).json({ message: 'Tourist registered successfully', tourist_id: id });
});

app.post('/api/update_location', (req, res) => {
    const { tourist_id, latitude, longitude } = req.body;
    if (!db.tourists[tourist_id]) return res.status(404).json({ error: 'Tourist not found.' });

    const locationUpdate = { latitude, longitude, timestamp: Date.now() / 1000 };
    const history = db.location_history[tourist_id];
    history.push(locationUpdate);

    const geofenceAlert = checkGeofence(latitude, longitude);
    if (geofenceAlert) {
        const alert = { ...geofenceAlert, tourist_id, timestamp: new Date().toISOString() };
        db.alerts.push(alert);
        console.log('ALERT (Geo-fence):', alert);
    }

    const anomalyAlert = detectAnomalies(tourist_id, history);
    if (anomalyAlert) {
        const alert = { ...anomalyAlert, tourist_id, timestamp: new Date().toISOString() };
        db.alerts.push(alert);
        console.log('ALERT (Anomaly):', alert);
    }
    
    res.status(200).json({ status: 'Location updated successfully' });
});

app.post('/api/panic', (req, res) => {
    const { tourist_id, latitude, longitude } = req.body;
    if (!db.tourists[tourist_id]) return res.status(404).json({ error: 'Tourist not found.' });

    const alert = {
        type: 'PANIC_BUTTON',
        tourist_id,
        location: { lat: latitude, lon: longitude },
        message: `PANIC signal from tourist ${db.tourists[tourist_id].name}`,
        timestamp: new Date().toISOString()
    };
    db.alerts.push(alert);
    console.error(`!!! PANIC ALERT:`, alert);
    
    res.status(200).json({ message: 'Panic signal received. Help is on the way.' });
});

// --- Dashboard Endpoints ---

app.get('/api/alerts', (req, res) => {
    const sortedAlerts = [...db.alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ alerts: sortedAlerts });
});

app.get('/api/tourist/:tourist_id', (req, res) => {
    const { tourist_id } = req.params;
    if (!db.tourists[tourist_id]) return res.status(404).json({ error: 'Tourist not found.' });
    
    res.json({
        profile: db.tourists[tourist_id],
        location_history: db.location_history[tourist_id]
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT} 🚀`);
});