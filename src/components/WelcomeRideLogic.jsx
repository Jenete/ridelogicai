import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react"; 
import RideLogicAi from "./RideLogicAi"; 
import "./styles/WelcomeRideLogic.css";

export default function WelcomeRideLogic() {
  const navigate = useNavigate();
  const targetPath = "/search"; 
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="rlw-wrap">
      <header className="rlw-hero">
        <motion.h1
          className="rlw-title"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Introducing <span className="rlw-brand">RideLogic</span>
        </motion.h1>

        <motion.p
          className="rlw-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          Your AI powered transport assistant for routes, timetables, and fares at your fingertips.
        </motion.p>

        {/* Input-looking button */}
        <motion.button
          type="button"
          className="rlw-searchlike"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(targetPath)}
        >
          <i className="fa fa-search rlw-ico"></i>
          <span className="rlw-placeholder">Where to? (Tap to plan a trip)</span>
        </motion.button>
      </header>

      <section className="rlw-panels">
        <motion.div
          className="rlw-card rlw-card--left"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
        >
          <h3 className="rlw-card-title"><i className="fa fa-bus"></i> Fast route search</h3>
          <p className="rlw-card-text">
            Type your start and destination—get clean, humanized results powered by real timetables.
          </p>
        </motion.div>

        <motion.div
          className="rlw-card rlw-card--right"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.35 }}
        >
          <h3 className="rlw-card-title"><i className="fa fa-qrcode"></i> Scan to plan</h3>
          <p className="rlw-card-text">
            Use the QR code to open the planner on your phone.
          </p>

          <div className="rlw-qr">
            <QRCodeCanvas
              value={"https://jenete.github.io/ridelogicai/"}
              size={144}
              includeMargin={false}
              level="M"
            />
            <span className="rlw-qr-caption">
              {"https://jenete.github.io/ridelogicai/"}
            </span>
          </div>
        </motion.div>
      </section>

      <footer className="rlw-footer">
        <span>© {new Date().getFullYear()} RideLogic • Built for Cape Town commuters</span>
      </footer>

      {/* Floating AI Chat Button */}
      <motion.button
        className="rlw-ai-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setAiOpen(true)}
      >
        <i className="fa fa-robot"></i>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            className="rlw-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rlw-modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <button className="rlw-modal-close" onClick={() => setAiOpen(false)}>
                ✖
              </button>
              <RideLogicAi />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
