// components/WeatherToast.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserLocation } from '../services/LocationService';
import { getWeatherByCoords } from '../services/WeatherService';
import './styles/WeatherToast.css';

export default function WeatherToast() {
  const [visible, setVisible] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { lat, lng, locationName } = await getUserLocation();
        const weather = await getWeatherByCoords(lat, lng);
        setWeatherInfo({ ...weather, locationName });
        setVisible(true);
        setTimeout(() => setVisible(false), 6000);
      } catch (err) {
        console.warn('Weather toast failed:', err.message);
      }
    };

    fetchWeather();
  }, []);

  return (
    <AnimatePresence>
      {visible && weatherInfo && (
        <motion.div
          className="weather-toast"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          🌤️ {weatherInfo.description} in <strong>{weatherInfo.locationName}</strong><br />
          🌡️ {weatherInfo.temperature}°C
        </motion.div>
      )}
    </AnimatePresence>
  );
}
