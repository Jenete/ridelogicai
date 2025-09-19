// components/UserLocationPopup.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getUserLocation
} from '../services/LocationService';
import './styles/UserLocationPopup.css';

export default function UserLocationPopup({onLocation}) {
  const [showPopup, setShowPopup] = useState(true);
  const [locationName, setLocationName] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAllowLocation = async () => {
    setLoading(true);
    try {
      const { locationName, lat, lng } = await getUserLocation();
      setLocationName(locationName);
      onLocation(locationName);
      sessionStorage.setItem('user_location', JSON.stringify({ locationName, lat, lng }));
      setToastVisible(true);
    } catch (err) {
      console.error('Failed to get your location. Please enable location access.');
    } finally {
      setLoading(false);
      setShowPopup(false);
      setTimeout(() => setToastVisible(false), 5000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="location-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="location-popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>📍 Allow Location Access</h3>
              <p>We'd like to use your location to give nearby transport info.</p>
              <div className="location-popup-actions">
                <button onClick={handleAllowLocation} disabled={loading}>
                  {loading ? 'Getting location...' : 'Allow Access'}
                </button>
                <button onClick={() => setShowPopup(false)} className="cancel-btn">
                  No thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastVisible && (
          <motion.div
            className="location-toast"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            ✅ You are at {locationName}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
