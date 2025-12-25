import { useState } from "react";

// Note: This is a simpler version of the search bar. 
// See SmartSearchBar.jsx for the version with typo correction and suggestions.

/**
 * Simple Search Bar Component
 * Provides a basic input field for destination searching.
 * 
 * @param {function} onSearch - Callback function triggered on form submission
 */
export default function SmartSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSearch(q);
    setQuery(""); // Clear search after submission
  };

  return (
    <form onSubmit={handleSubmit} className="position-relative">
      <div className={`glass-card p-2 rounded-4 transition-all ${
        isFocused ? 'shadow-lg scale-hover' : 'scale-hover'
      }`}>
        <div className="d-flex align-items-center gap-3">
          <div className="ps-3 fs-4">
            🔍
          </div>
          <input
            type="text"
            className="bg-transparent text-white w-100 py-3 px-2 border-0 fs-5 fw-medium shadow-none"
            style={{ outline: 'none' }}
            placeholder="Where would you like to go?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search destination"
          />
          <button
            type="submit"
            className="text-white px-5 py-3 rounded-4 fw-semibold transition-all scale-hover border-0"
            style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)' }}
          >
            ✈️ Explore
          </button>
        </div>
      </div>
      
      {/* Quick suggestion buttons */}
      <div className="d-flex flex-wrap gap-2 mt-4 justify-content-center">
        {['Paris', 'Tokyo', 'New York', 'London'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onSearch(city)}
            className="glass-card px-4 py-2 rounded-pill text-white text-opacity-75 hover-text-white scale-hover transition-all small fw-medium btn border-0"
          >
            {city}
          </button>
        ))}
      </div>
    </form>
  );
}