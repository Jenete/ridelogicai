// services/LocationService.js

/**
 * Reverse geocode coordinates to a human-readable address.
 */
export async function getLocationFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to reverse geocode');
  const data = await res.json();
  return data.display_name || `${lat}, ${lng}`;
}

/**
 * Request user location using the browser's geolocation API.
 */
export function getCurrentUserCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => reject(error)
      );
    }
  });
}

/**
 * Get both the user's coordinates and the resolved location name.
 */
export async function getUserLocation() {
  const coords = await getCurrentUserCoords();
  const locationName = await getLocationFromCoords(coords.lat, coords.lng);
  return {
    ...coords,
    locationName
  };
}

/**
 * Convert a location name to coordinates (geocoding).
 */
export async function getCoordsFromLocation(placeName) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to geocode place name');
  const data = await res.json();
  if (!data.length) throw new Error('No coordinates found for location');
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    display_name: data[0].display_name
  };
}
