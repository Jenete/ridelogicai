import React, { useState, useEffect } from "react";
import { handleGetSavedRoutes, handleSave, handleUnsave } from "../utils/routes";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/SavedRoutesList.css";
import { getBestTimes } from "../services/TranscribeAndChatService";
import BestTimesResult from "./BestTimesResult";
import TimeSelector from "./TimeSelector";

function SavedRoutesList() {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const updateRouteTime = (route, t) => {
  // create updated route object
  const updatedRoute = { ...route, time: t };

  // update state immutably
  setSavedRoutes((prev) =>
    prev.map((r) =>
      r.routeIds === route.routeIds && r.from === route.from && r.to === route.to
        ? updatedRoute
        : r
    )
  );
  handleSave(updatedRoute.routeIds,updatedRoute.from, updatedRoute.to, updatedRoute.time);
};

  useEffect(() => {
    setSavedRoutes(handleGetSavedRoutes());
  }, []);

  const handleSearch = async (route) => {
    setLoading(true);
    setResult("");
    setError(null);

    try {
      const res = await getBestTimes(route);
      setResult(res);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeRoute = (from, to) => {
    handleUnsave(from, to);
    setSavedRoutes(handleGetSavedRoutes()); // refresh list
  };

  if (savedRoutes.length === 0) {
    return <p className="sr-empty-text">No saved routes yet ⭐</p>;
  }

  return (
    <div className="sr-container">
      <h3 className="sr-title">⭐ Saved Routes</h3>
      <ul className="sr-list">
        <AnimatePresence>
          {savedRoutes.map((r, i) => (
            <motion.li
              key={i}
              className="sr-card"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="sr-info">
                <strong>{r.from} → {r.to}</strong>
                <div className="sr-time"><TimeSelector onTimeChange={(t)=> updateRouteTime(r, t)} defaultTime={r.time} />
                </div>
              </div>
              <div className="sr-actions">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSearch(r)}
                  className="sr-btn sr-btn-search"
                >
                  <i className="fa fa-search" aria-hidden="true"></i> Search
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeRoute(r.from, r.to)}
                  className="sr-btn sr-btn-unsave"
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </motion.button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {loading && <p className="sr-loading">⏳ Searching...</p>}
      {error && <p className="sr-error">❌ {error}</p>}
      {result && <BestTimesResult result={result} />}
    </div>
  );
}

export default SavedRoutesList;
