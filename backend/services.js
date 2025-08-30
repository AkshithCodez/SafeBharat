const geolib = require('geolib');

// Sample restricted zones for Hyderabad, India
const RESTRICTED_ZONES = [
    { name: "Charminar Restricted Zone", latitude: 17.3616, longitude: 78.4747, radius_m: 300 },
    { name: "Golkonda Fort Protected Area", latitude: 17.3833, longitude: 78.4011, radius_m: 500 },
];

/**
 * Checks if a location is inside any restricted zone.
 * @returns {object|null} An alert object if inside a zone, otherwise null.
 */
function checkGeofence(lat, lon) {
    const touristLocation = { latitude: lat, longitude: lon };
    for (const zone of RESTRICTED_ZONES) {
        const distance = geolib.getDistance(touristLocation, zone);
        if (distance <= zone.radius_m) {
            return {
                type: 'GEOFENCE_BREACH',
                message: `Alert: Tourist entered restricted zone: ${zone.name}`,
                location: { lat, lon }
            };
        }
    }
    return null;
}

/**
 * Detects anomalies based on location history.
 * @returns {object|null} An alert object if an anomaly is found, otherwise null.
 */
function detectAnomalies(touristId, history) {
    if (history.length < 2) return null;

    const lastUpdate = history[history.length - 1];
    const prevUpdate = history[history.length - 2];
    const timeDiffSeconds = lastUpdate.timestamp - prevUpdate.timestamp;

    // Anomaly 1: Prolonged Inactivity (e.g., > 1 hour)
    if (timeDiffSeconds > 3600) {
        return {
            type: 'INACTIVITY_ALERT',
            message: `Alert: Prolonged inactivity detected for tourist ${touristId}.`,
            details: `No location update for over ${(timeDiffSeconds / 60).toFixed(0)} minutes.`,
            location: { lat: lastUpdate.latitude, lon: lastUpdate.longitude }
        };
    }

    return null;
}

module.exports = { checkGeofence, detectAnomalies };