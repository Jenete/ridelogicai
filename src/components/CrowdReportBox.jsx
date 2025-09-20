import React, { useState } from "react";
import { RouteController } from "../controllers/RouteController";
import { CrowdController } from "../controllers/CrowdController";
import { motion } from "framer-motion";
import "./styles/CrowdReportBox.css";

const statuses = [
  { key: "on_bus", label: "🚌 On Bus" },
  { key: "departed", label: "🚶 Departed" },
  { key: "delayed", label: "⏳ Delayed" },
  { key: "full", label: "❌ Full" },
];

export const CrowdReportBox = ({ stopName }) => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [message, setMessage] = useState("");

  const fetchRoutes = () => {
    const foundRoutes = RouteController.getRoutesByStop(stopName);
    setRoutes(foundRoutes);
  };

  const submitReport = async (status) => {
  if (!selectedRoute) {
    setMessage("⚠️ Please select a route first.");
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        const res = await CrowdController.submitReport(
          selectedRoute.route_id,
          stopName,
          status,
          "anon",
          { lat: latitude, lng: longitude, accuracy }
        );

        setMessage(res.success ? "✅ Report submitted with location" : "❌ Error submitting report");
      },
      async () => {
        const res = await CrowdController.submitReport(
          selectedRoute.route_id,
          stopName,
          status
        );
        setMessage(res.success ? "✅ Report submitted (no location)" : "❌ Error submitting report");
      }
    );
  } else {
    const res = await CrowdController.submitReport(
      selectedRoute.route_id,
      stopName,
      status
    );
    setMessage(res.success ? "✅ Report submitted" : "❌ Error submitting report");
  }
};



  return (
    <div className="cr-container">
      <button onClick={fetchRoutes} className="cr-fetch-btn">Find Routes</button>

      {routes.length > 0 && (
        <select
          className="cr-select"
          onChange={(e) => setSelectedRoute(routes.find(r => r.route_id === e.target.value))}
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
        <motion.div className="cr-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {statuses.map((s) => (
            <motion.button
              key={s.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className={`cr-btn cr-btn-${s.key}`}
              onClick={() => submitReport(s.key)}
            >
              {s.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {message && <p className="cr-message">{message}</p>}
    </div>
  );
};
