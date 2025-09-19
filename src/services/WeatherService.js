// services/WeatherService.js

/**
 * Fetch current weather from Open-Meteo based on latitude and longitude.
 * See: https://open-meteo.com/en/docs#api_form
 */
export async function getWeatherByCoords(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  const data = await res.json();

  return {
    temperature: data.current.temperature_2m,
    weather_code: data.current.weather_code,
    timestamp: data.current.time,
    description: getWeatherDescription(data.current.weather_code)
  };
}

/**
 * Convert weather code to human-readable description.
 * Ref: https://open-meteo.com/en/docs#weathervariables
 */
function getWeatherDescription(code) {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return codes[code] || 'Unknown';
}
