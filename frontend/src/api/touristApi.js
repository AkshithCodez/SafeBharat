const API_PREFIX = '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const registerTourist = async (touristData) => {
  const response = await fetch(`${API_PREFIX}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(touristData),
  });
  return handleResponse(response);
};

export const updateLocation = async (locationData) => {
  const response = await fetch(`${API_PREFIX}/update_location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locationData),
  });
  return handleResponse(response);
};

export const triggerPanic = async (panicData) => {
  const response = await fetch(`${API_PREFIX}/panic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(panicData),
  });
  return handleResponse(response);
};

export const getAlerts = async () => {
  const response = await fetch(`${API_PREFIX}/alerts`);
  return handleResponse(response);
};