import React, { useState } from "react";
import SuggestionBox from "./SuggestionBox";
import { RouteController } from "../controllers/RouteController";
import { FareController } from "../controllers/FareController";
import { motion } from "framer-motion";
import "./styles/FareEstimator.css";

export const FareEstimator = () => {
  const stops = RouteController.getAllStops();
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState(null);
  const [error, setError] = useState("");

  const calculateFare = () => {
    if (!from || !destination) {
      setError("⚠️ Please select both origin and destination.");
      setFare(null);
      return;
    }

    try {
      const result = FareController.getFareByRoute(`${from} to ${destination}`);
      setFare(result);
      setError("");
    } catch (err) {
      setError("❌ Could not calculate fare. Please try again.");
      setFare(null);
    }
  };

  return (
    <motion.div
      className="fe-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="fe-title"> Fare Estimator</h2>
      <p className="fe-subtitle">Quickly check your bus fare before you travel</p>

      <div className="fe-inputs">
        <SuggestionBox
          suggestions={stops}
          onSelect={(val) => setFrom(val)}
          placeholder="Enter origin"
        />
        <SuggestionBox
          suggestions={stops}
          onSelect={(val) => setDestination(val)}
          placeholder="Enter destination"
        />
      </div>

      <motion.button
        className="fe-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={calculateFare}
      >
        Estimate Fare
      </motion.button>

      {error && <p className="fe-error">{error}</p>}

      {fare && (
        <motion.div
          className="fe-result"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3>Estimated Fare</h3>
          <p className="fe-fare">R {fare}</p>
        </motion.div>
      )}
    </motion.div>
  );
};
