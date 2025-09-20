import React from "react";

// Regex to match http/https links
const urlRegex = /(https?:\/\/[^\s]+)/g;

function LinkHighlighter({ text }) {
  if (!text) return null;

  // Split text into parts: links vs non-links
  const parts = text.split(urlRegex);

  return (
    <span>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default LinkHighlighter;
