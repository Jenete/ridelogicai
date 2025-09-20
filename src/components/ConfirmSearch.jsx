import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBestTimes } from "../services/TranscribeAndChatService";
import "./styles/ConfirmSearch.css";
import BestTimesResult from "./BestTimesResult";
import SaveRouteButton from "./SaveRouteButton";

export default function ConfirmSearch({ from, to, time, routeIds }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setResult("");
    setError(null);

    try {
      const res = await getBestTimes({routeIds, time, to, from});
      setResult(res);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="rlc-confirm-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="rlc-title">Confirm Your Search</h3>
      <p className="rlai-bus-route">
                        <i className="fa fa-bus rlai-route-icon"></i>
                        <span className="rlai-route-label">
                          <strong>{from}</strong> → <strong>{to}</strong>
                        </span>
                        <span className="rlai-route-fare">
                          <p><i className="fa fa-clock fa-icons"></i> Time: <strong>{time}</strong></p>
                        </span>
                      </p>

      <div className="rlc-summary">
        <details>
          <summary>
            <div> <i className="fa fa-road fa-icons"></i><strong> Routes:</strong></div>
          </summary>
              <p>{routeIds.join(", ")}</p>
        </details>
      </div>

      <motion.button
        className="rlc-search-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        onClick={handleSearch}
      >
        {loading ? (
          <span className="rlc-spinner"></span>
        ) : (
          <>
            <i className="fa fa-search fa-icons"></i> AI Search
          </>
        )}
      </motion.button>
        <SaveRouteButton routeIds={routeIds} from={from} to={to} time={time}/>

      <AnimatePresence>
        {result && (
          <motion.div
            className="rlc-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h4>Result</h4>
            <BestTimesResult result={result}/>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="rlc-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ❌ {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
