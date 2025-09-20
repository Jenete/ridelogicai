import React, { useState } from "react";
import "./styles/SuggestionBox.css";

function SuggestionBox({ suggestions, onSelect, placeholder='Type to search...' }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setFiltered([]);
      return;
    }

    // filter case-insensitive
    const matches = suggestions.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(matches);
  };

  const handleClick = (item) => {
    setQuery(item);
    setFiltered([]);
    if (onSelect) onSelect(item);
  };

  return (
    <div className="sb-container">
      <input
        type="text"
        className="sb-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      {filtered.length > 0 && (
        <ul className="sb-list">
          {filtered.map((item, i) => (
            <li
              key={i}
              className="sb-item"
              onClick={() => handleClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SuggestionBox;
