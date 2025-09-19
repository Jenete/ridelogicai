import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles/TimeSelector.css";

export default function TimeSelector({ onTimeChange }) {
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");

  const handleChange = (h, m) => {
    const formatted = `${h}:${m}`;
    onTimeChange && onTimeChange(formatted);
  };

  return (
    <motion.div
      className="rl-time-selector"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hour */}
      <div className="rl-time-box">
        <i className="fa fa-clock fa-icons"></i>
        <select
          value={hour}
          onChange={(e) => {
            setHour(e.target.value);
            handleChange(e.target.value, minute);
          }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const val = String(i).padStart(2, "0");
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>
      </div>

      <span className="rl-time-separator">:</span>

      {/* Minute */}
      <div className="rl-time-box">
        <select
          value={minute}
          onChange={(e) => {
            setMinute(e.target.value);
            handleChange(hour, e.target.value);
          }}
        >
          {Array.from({ length: 60 }, (_, i) => {
            const val = String(i).padStart(2, "0");
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>
      </div>
    </motion.div>
  );
}
