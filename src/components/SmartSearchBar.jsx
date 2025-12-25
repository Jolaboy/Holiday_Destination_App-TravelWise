import { useState, useEffect, useRef } from "react";
import { getDestinationSuggestions, findBestMatch } from "../utils/destinationMatcher";

/**
 * Smart Search Bar Component
 * Advanced search input with:
 * - Debounced typeahead suggestions
 * - Fuzzy matching for typo correction
 * - Keyboard navigation support
 * 
 * @param {function} onSearch - Callback function triggered on valid search
 * @param {string} placeholder - Input placeholder text
 */
export default function SmartSearchBar({ onSearch, placeholder = "Where would you like to go?" }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Effect: Debounce user input and fetch suggestions
  // Waits 150ms after last keystroke before calculating suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        const newSuggestions = getDestinationSuggestions(query.trim(), 5);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 150); // Debounce for better performance

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle form submission
  // Uses fuzzy matching to correct typos automatically if confidence is high
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = query.trim();
    if (!searchQuery) return;

    // Use smart matching to find the best destination
    const matchResult = findBestMatch(searchQuery);
    
    if (matchResult.hasGoodMatch && matchResult.confidence > 0.8) {
      // High confidence match - use the corrected destination automatically
      onSearch(matchResult.destination);
      setQuery("");
      setShowSuggestions(false);
    } else if (matchResult.suggestions.length > 0) {
      // Ambiguous match - show suggestions for user confirmation
      setShowSuggestions(true);
    } else {
      // No good match found - search as is
      onSearch(searchQuery);
      setQuery("");
      setShowSuggestions(false);
    }
  };

  // Clicking a suggestion immediately triggers a search and resets local state.
  const handleSuggestionClick = (suggestionName) => {
    onSearch(suggestionName);
    setQuery("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Keyboard navigation for the suggestion list (up/down/enter/escape).
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex].name);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Delay hiding suggestions so click events on the dropdown can register.
  const handleBlur = () => {
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
      }
    }, 150);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="position-relative w-100 mx-auto" style={{ maxWidth: '600px' }}>
      <form onSubmit={handleSubmit}>
        <div className={`glass-card p-2 rounded-4 transition-all ${
          isFocused ? 'shadow-lg scale-hover' : 'scale-hover'
        }`}>
          <div className="d-flex align-items-center gap-3">
            <div className="ps-3 fs-4">
              🔍
            </div>
            <input
              ref={inputRef}
              type="text"
              className="bg-transparent text-white w-100 py-3 px-2 border-0 fs-5 fw-medium shadow-none"
              style={{ outline: 'none' }}
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              aria-label="Search destination"
              autoComplete="off"
            />
            <button
              type="submit"
              className="text-white px-4 px-sm-5 py-3 rounded-4 fw-semibold transition-all scale-hover flex-shrink-0 border-0"
              style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)' }}
            >
              <span className="d-none d-sm-inline">✈️ Explore</span>
              <span className="d-sm-none">✈️</span>
            </button>
          </div>
        </div>

        {/* Smart Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="position-absolute top-100 start-0 end-0 mt-2 glass-card rounded-4 p-2 z-3 animate-slide-up overflow-hidden"
            style={{ maxHeight: '320px' }}
          >
            <div className="small text-white text-opacity-75 px-4 py-2 border-bottom border-white border-opacity-10">
              💡 Did you mean?
            </div>
            <div className="overflow-auto" style={{ maxHeight: '250px' }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.name}-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.name)}
                  className={`w-100 text-start px-4 py-3 rounded-3 transition-all d-flex align-items-center justify-content-between btn border-0 ${
                    index === selectedSuggestionIndex
                      ? 'bg-white bg-opacity-25 text-white'
                      : 'hover-bg-opacity-10 text-white text-opacity-90 hover-text-white'
                  }`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className="fs-5">🌍</span>
                    <div>
                      <div className="fw-medium">{suggestion.name}</div>
                      <div className="small text-white text-opacity-50">{suggestion.country}</div>
                    </div>
                  </div>
                  <div className={`small px-2 py-1 rounded-pill transition-opacity ${
                    index === selectedSuggestionIndex ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <span className="text-white text-opacity-50">↵</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Quick suggestions pills */}
      {!showSuggestions && !isFocused && (
        <div className="d-flex flex-wrap gap-2 mt-4 justify-content-center px-2">
          {['Paris', 'Tokyo', 'New York', 'London'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleSuggestionClick(city)}
              className="glass-card px-4 py-2 rounded-pill text-white text-opacity-75 hover-text-white scale-hover transition-all small fw-medium btn border-0"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}