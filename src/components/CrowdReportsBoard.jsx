import React, { useState, useEffect } from "react";
import SuggestionBox from "./SuggestionBox";
import { RouteController } from "../controllers/RouteController";
import { CrowdController } from "../controllers/CrowdController";
import { CrowdReportBox } from "./CrowdReportBox";
import { motion } from "framer-motion";
import "./styles/CrowdReportsBoard.css";

export const CrowdReportsBoard = () => {
  const stops = RouteController.getAllStops();
  const [stopName, setStopName] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (stopName) {
      const foundRoutes = RouteController.getRoutesByStop(stopName);
      setRoutes(foundRoutes);
    }
  }, [stopName]);

  const loadReports = async () => {
    if (!selectedRoute) return;
    const res = await CrowdController.getReports(
      selectedRoute.route_id,
      stopName
    );
    setReports(res);
  };

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.status === filter);

  return (
    <div className="crb-container">
      <h2 className="crb-title">🚍 Commuter Reports</h2>

      <SuggestionBox
        suggestions={stops}
        onSelect={(val) => setStopName(val)}
        placeholder="Enter stop name"
      />

      {routes.length > 0 && (
        <select
          className="crb-select"
          onChange={(e) =>
            setSelectedRoute(
              routes.find((r) => r.route_id === e.target.value)
            )
          }
        >
          <option value="">-- Select Route --</option>
          {routes.map((r) => (
            <option key={r.route_id} value={r.route_id}>
              {r.from} → {r.to}
            </option>
          ))}
        </select>
      )}

      {selectedRoute && (
        <>
          <CrowdReportBox stopName={stopName} />

          <div className="crb-controls">
            <button onClick={loadReports} className="crb-btn">
              🔄 Refresh Reports
            </button>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="crb-filter"
            >
              <option value="all">All</option>
              <option value="on_bus">🚌 On Bus</option>
              <option value="departed">🚶 Departed</option>
              <option value="delayed">⏳ Delayed</option>
              <option value="full">❌ Full</option>
            </select>
          </div>

          <motion.ul
            className="crb-reports"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredReports.length > 0 ? (
              filteredReports.map((r, i) => (
                <motion.li
                  key={i}
                  className={`crb-report crb-${r.status}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <strong>{r.stop}</strong> → {r.routeId}
                  <span className="crb-status">{r.status}</span>
                  <span className="crb-time">
                    {new Date(r.timestamp).toLocaleTimeString()}
                  </span>
                  {r.location && (
                    <span className="crb-location">
                      📍 {r.location.lat.toFixed(3)},{r.location.lng.toFixed(3)}
                    </span>
                  )}
                </motion.li>
              ))
            ) : (
              <p className="crb-empty">No reports yet.</p>
            )}
          </motion.ul>
        </>
      )}
    </div>
  );
};
