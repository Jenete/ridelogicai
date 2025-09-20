import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RouteController } from "../controllers/RouteController";
import "./styles/RouteFinder.css";
import TimeSelector from "./TimeSelector";
import { stringSimilarity } from "../utils/similarity";
import ConfirmSearch from "./ConfirmSearch";
import WeatherToast from './WeatherToast';
import {FareController} from "../controllers/FareController";
import SavedRoutesList from "./SavedRoutesList";
import SuggestionBox from "./SuggestionBox";

export default function RouteFinder() {
  const [start, setStart] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [step, setStep] = useState(0); // 0=input, 1=results, 2=confirm
  const stops = RouteController.getAllStops();

  const handleTimeChange = (t) => setTime(t);

  const handleSearch = () => {
    if (!start || !to) return;

    const matchingRoutes = RouteController.getRoutesByStop(start).filter((r) =>
      r.stops.some((stop) => stringSimilarity(stop, to) >= 0.8)
    );

    const uniqueRoutes = [];
    const seenKeys = new Set();

    matchingRoutes.forEach((r) => {
      const key = `${r.from}-${r.to}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueRoutes.push(r);
      }
    });

    setResults(uniqueRoutes);
    if (uniqueRoutes.length > 0) setStep(1);
  };

  return (
    <div className="rlai-routefinder-container">
      {/* Slide 1: Inputs */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="slide-inputs"
            className="rlai-search-box"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Step 1: Enter trip details</h3>
            <div className="rlai-input-group">
              <i className="fa fa-map-marker fa-icons"></i>
              <SuggestionBox suggestions={stops} onSelect={(val)=> setStart(val)} placeholder={"Type location..."}/>
            </div>

            <div className="rlai-input-group">
              <i className="fa fa-flag-checkered fa-icons"></i>
              <SuggestionBox suggestions={stops} onSelect={(val)=> setTo(val)} placeholder={"Type destination..."}/>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rlai-search-btn"
              onClick={handleSearch}
            >
              <i className="fa fa-search"></i> Search
            </motion.button>
            <SavedRoutesList/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide 2: Results */}
      <AnimatePresence mode="wait">
        {step === 1 && results.length > 0 && (
          <motion.div
            key="slide-results"
            className="rlai-results"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Step 2: Select travel time</h3>
            <TimeSelector onTimeChange={handleTimeChange} />
            
            

            <div className="rlai-nav-buttons">
              <button onClick={() => setStep(0)} className="rlai-prev-btn">
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="rlai-next-btn"
                disabled={!time}
              >
                Next →
              </button>
            </div>

            
          </motion.div>
        )}
      </AnimatePresence>
      {/* Slide 3: Route */}
      <AnimatePresence mode="wait">
        {step === 2 && results.length > 0 && (
          <motion.div
            key="slide-results"
            className="rlai-results"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <button onClick={() => setStep(1)} className="rlai-prev-btn">
                ← Back
              </button>
            <h3>Step 3: Routes</h3>
            <h4>Matching routes ({results.length})</h4>
            {results.map((route) => (
              <motion.div
                key={route.route_id}
                className="rlai-route-card"
                whileHover={{ scale: 1.02 }}
onClick={(e) => {
                      // Add only if not already selected
                      if (!selectedRoutes.some((r) => r.route_id === route.route_id)) {
                        setSelectedRoutes([...selectedRoutes, route]);
                      }
                     else {
                      // Remove when unchecked
                      setSelectedRoutes(selectedRoutes.filter((r) => r.route_id !== route.route_id));
                    }
                  }}
              >
                

                <p className="rlai-bus-route">
                  <input
                  type="checkbox"
                  checked={selectedRoutes.some((r) => r.route_id === route.route_id)}
                />
                  <i className="fa fa-bus rlai-route-icon"></i>
                  <span className="rlai-route-label">
                    <strong>{route.from}</strong> → <strong>{route.to}</strong>
                  </span>
                  <span className="rlai-route-fare">
                    R{FareController.getFareByRoute(`${route.from} to ${route.to}`)}
                  </span>
                </p>
                
                <div className="rlai-route-line">
                  {route.stops.map((stop, idx) => {
                    let stopClass = "rlai-stop";
                    if (stringSimilarity(stop, start) > 0.8)
                      stopClass += " rlai-here";
                    if (stringSimilarity(stop, to) > 0.8)
                      stopClass += " rlai-destination";

                    return (
                      <div key={idx} className={stopClass}>
                        <span className="rlai-stop-name">{stop}</span>
                        {stopClass.includes("rlai-here") && (
                          <span className="rlai-icon">📍</span>
                        )}
                        {stopClass.includes("rlai-destination") && (
                          <span className="rlai-icon">🏁</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
            

            <div className="rlai-nav-buttons">
              <button onClick={() => setStep(1)} className="rlai-prev-btn">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="rlai-next-btn"
                disabled={!(selectedRoutes && selectedRoutes.length > 0)}
              >
                Next →
              </button>
            </div>

            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide 3: Confirm */}
      <AnimatePresence mode="wait">
        {step === 3 && selectedRoutes && selectedRoutes.length > 0 && time && (
          <motion.div
            key="slide-confirm"
            className="rlai-confirm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Step 3: Confirm & Search</h3>
            <ConfirmSearch
              from={start}
              to={to}
              time={time}
              routeIds={selectedRoutes.map((route) => route.pdf)}
            />
            <div className="rlai-nav-buttons">
              <button onClick={() => setStep(2)} className="rlai-prev-btn">
                ← Back
              </button>
            </div>
          </motion.div>
        )}
                <WeatherToast/>
        
      </AnimatePresence>
    </div>
  );
}
