import React from "react";
import './styles/BestTimesResult.css'

function BestTimesResult({ result }) {
  if (!result) return null;
  let results = null;

  try {
    results = JSON.parse(result);
  } catch (error) {
    console.error(error, result);
  }

  const speak = (text, lang = "en-US") => {
      const synth = window.speechSynthesis;

      // Cancel any ongoing speech first
      if (synth.speaking || synth.pending) {
        synth.cancel();
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;

      synth.speak(utter);
    };


  return (
    <div className="best-times-container">
      <div className="best-time-row">
        <strong> Best Time:</strong> {results.best_time?.join(", ") || "N/A"}
      </div>

      {/* English */}
      <div className="translation-card">
        <h6 onClick={() => speak(results.english_version, "en-US")}>
          English{" "}
          <i
            className="fa fa-volume-up"
            aria-hidden="true"
            style={{ cursor: "pointer", marginLeft: "8px" }}
          ></i>
        </h6>
        <p>{results.english_version}</p>
      </div>

      {/* Xhosa */}
      <div className="translation-card">
        <h6 onClick={() => speak(results.xhosa_version, "xh-ZA")}>
          Xhosa{" "}
          <i
            className="fa fa-volume-up"
            aria-hidden="true"
            
            style={{ cursor: "pointer", marginLeft: "8px" }}
          ></i>
        </h6>
        <p>{results.xhosa_version}</p>
      </div>

      {/* Afrikaans */}
      <div className="translation-card">
        <h6 onClick={() => speak(results.afrikaans_version, "af-ZA")}>
          Afrikaans{" "}
          <i
            className="fa fa-volume-up"
            aria-hidden="true"
            
            style={{ cursor: "pointer", marginLeft: "8px" }}
          ></i>
        </h6>
        <p>{results.afrikaans_version}</p>
      </div>
    </div>
  );
}

export default BestTimesResult;
