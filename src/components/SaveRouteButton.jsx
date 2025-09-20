import React, { useState, useEffect } from "react";
import { handleSave, handleUnsave, handleGetSavedRoutes } from "../utils/routes";

function SaveRouteButton({ routeIds, from, to, time }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if already saved when component mounts
    const saved = handleGetSavedRoutes();
    const exists = saved.some(
      (r) =>
        r.routeIds === routeIds &&
        r.from === from &&
        r.to === to &&
        r.time === time
    );
    setIsSaved(exists);
  }, [routeIds, from, to, time]);

  const toggleSave = () => {
    if (isSaved) {
      handleUnsave(from, to);
      setIsSaved(false);
    } else {
      handleSave(routeIds, from, to, time);
      setIsSaved(true);
    }
  };

  return (
    <div>
        <button
      onClick={toggleSave}
      style={{
        cursor: "pointer",
        color: isSaved ? "gold" : "black",
        fontSize: "16px",
      }}
    >
      <i className={`fa ${isSaved ? "fa-star" : "fa-star"}`} aria-hidden="true"></i>{" "}
      {isSaved ? "Added to favourites" : "Save to favourites"}
    </button>
    </div>
  );
}

export default SaveRouteButton;
