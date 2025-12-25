import { useState } from "react";
import { findBestMatch, getDestinationSuggestions } from "../utils/destinationMatcher";

/**
 * No Results Found Component
 * Displays a friendly message when a search yields no results.
 * Offers smart suggestions based on the failed search term.
 * 
 * @param {string} searchTerm - The failed search query
 * @param {function} onNewSearch - Handler to trigger a new search from suggestions
 */
export default function NoResultsFound({ searchTerm, onNewSearch }) {
  // Calculate suggestions once on mount
  const [suggestions] = useState(() => {
    // Get suggestions for the failed search
    const matchResult = findBestMatch(searchTerm, 0.3); // Lower threshold for suggestions
    const basicSuggestions = getDestinationSuggestions(searchTerm, 3);
    
    // Combine and deduplicate suggestions
    const allSuggestions = [
      ...matchResult.suggestions,
      ...basicSuggestions
    ].filter((item, index, self) => 
      index === self.findIndex(t => t.name === item.name)
    ).slice(0, 6);

    return allSuggestions;
  });

  const popularDestinations = [
    { name: "Paris", emoji: "🗼", description: "The City of Light" },
    { name: "Tokyo", emoji: "🏯", description: "Modern meets traditional" },
    { name: "New York", emoji: "🗽", description: "The Big Apple" },
    { name: "London", emoji: "🎡", description: "Historic and royal" },
    { name: "Dubai", emoji: "🏙️", description: "Luxury and innovation" },
    { name: "Sydney", emoji: "🏖️", description: "Harbor city beauty" }
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-4">
        <div className="glass-card p-5 rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="display-1 mb-4">🤷‍♀️</div>
          <h1 className="h2 fw-bold text-dark mb-4">
            No results found for "{searchTerm}"
          </h1>
          <p className="text-secondary mb-4">
            Don't worry! Let's help you find what you're looking for.
          </p>
        </div>
      </div>

      {/* Smart Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <div className="glass-card p-4 rounded-4">
            <h2 className="h3 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              💡 Did you mean one of these?
            </h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {suggestions.map((suggestion, index) => (
                <div className="col" key={suggestion.name}>
                  <button
                    onClick={() => onNewSearch(suggestion.name)}
                    className="glass-card p-4 rounded-4 hover-lift text-start w-100 transition-all scale-hover btn border-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-4">🌍</span>
                      <div>
                        <div className="fw-semibold text-dark">
                          {suggestion.name}
                        </div>
                        <div className="small text-secondary">
                          {suggestion.country}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Destinations */}
      <div className="mb-4">
        <div className="glass-card p-4 rounded-4">
          <h2 className="h3 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            🌟 Popular Destinations
          </h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {popularDestinations.map((destination, index) => (
              <div className="col" key={destination.name}>
                <button
                  onClick={() => onNewSearch(destination.name)}
                  className="glass-card p-4 rounded-4 hover-lift text-start w-100 transition-all scale-hover btn border-0"
                  style={{ animationDelay: `${index * 0.1}s`, background: 'linear-gradient(135deg, #fdf4ff, #fce7f3)' }}
                >
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="fs-4 scale-hover transition-transform">
                      {destination.emoji}
                    </span>
                    <div className="fw-semibold text-dark">
                      {destination.name}
                    </div>
                  </div>
                  <div className="small text-secondary">
                    {destination.description}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Tips */}
      <div className="glass-card p-4 rounded-4 text-center">
        <div className="display-4 mb-4">📝</div>
        <h3 className="h4 fw-bold text-dark mb-3">Search Tips</h3>
        <div className="row row-cols-1 row-cols-md-3 g-4 small text-secondary">
          <div className="col d-flex align-items-center gap-2 justify-content-center">
            <span>✓</span>
            <span>Try city names: "Paris", "Tokyo"</span>
          </div>
          <div className="col d-flex align-items-center gap-2 justify-content-center">
            <span>✓</span>
            <span>Don't worry about spelling</span>
          </div>
          <div className="col d-flex align-items-center gap-2 justify-content-center">
            <span>✓</span>
            <span>Use popular destinations</span>
          </div>
        </div>
      </div>
    </div>
  );
}