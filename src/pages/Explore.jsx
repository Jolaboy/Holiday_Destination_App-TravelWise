import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import SmartSearchBar from "../components/SmartSearchBar";
import SearchCorrection from "../components/SearchCorrection";
import NoResultsFound from "../components/NoResultsFound";
import PhotoModal from "../components/PhotoModal";
import PhotoCard from "../components/PhotoCard";
import { findBestMatch } from "../utils/destinationMatcher";
import { useState, useMemo, useRef } from "react";

/**
 * Explore Page Component
 * The main search results page.
 * Orchestrates:
 * - Search term processing and fuzzy correction
 * - Data fetching (Weather and Photos)
 * - Displaying results (Weather cards, Photo grid)
 * - Modal interactions for photo viewing
 */
export default function Explore() {
  const params = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const searchTerm = params.get("search");
  
  // State for photo modal
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoModalIndex, setPhotoModalIndex] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const photoRailRef = useRef(null);

  // Normalize the search term with fuzzy matching for more reliable fetches.
  // If confidence is high (>82%), we use the corrected term automatically.
  const effectiveSearchTerm = useMemo(() => {
    if (!searchTerm) return null;
    const matchResult = findBestMatch(searchTerm);
    if (matchResult.hasGoodMatch && matchResult.confidence >= 0.82) {
      return matchResult.destination;
    }
    return searchTerm;
  }, [searchTerm]);

  // API Keys from environment variables
  const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

  // Check if API keys are configured
  const missingKeys = [];
  if (!OPENWEATHER_KEY || OPENWEATHER_KEY === "your_openweathermap_api_key_here") {
    missingKeys.push("OpenWeatherMap API key");
  }
  if (!UNSPLASH_KEY || UNSPLASH_KEY === "your_unsplash_access_key_here") {
    missingKeys.push("Unsplash API key");
  }

  // Calculate spelling corrections when search term changes
  // This determines if we should show the "Did you mean...?" popup
  const correctionData = useMemo(() => {
    if (searchTerm && searchTerm.length > 2) {
      const matchResult = findBestMatch(searchTerm);
      
      // Return correction data if we have a good match that's different from the original
      if (matchResult.hasGoodMatch && 
          matchResult.destination !== searchTerm && 
          matchResult.confidence > 0.7 && 
          matchResult.confidence < 1.0) {
        return {
          original: searchTerm,
          corrected: matchResult.destination,
          confidence: matchResult.confidence
        };
      }
    }
    return null;
  }, [searchTerm]);

  // Derive showCorrection directly from correctionData
  const showCorrection = !!correctionData;

  // Navigate to a new search term, triggering fresh fetches.
  const handleNewSearch = (query) => {
    navigate(`/explore?search=${query}`);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  // Apply the suggested correction.
  const handleAcceptCorrection = () => {
    if (correctionData) {
      navigate(`/explore?search=${correctionData.corrected}`);
    }
  };

  const handleRejectCorrection = () => {
    // Keep the original query and force a rerender without correction UI.
    navigate(`/explore?search=${searchTerm}`);
  };

  // Photo modal handlers
  const handlePhotoClick = (photo, index) => {
    setSelectedPhoto(photo);
    setPhotoModalIndex(index);
    setIsPhotoModalOpen(true);
  };

  const handlePhotoModalClose = () => {
    setIsPhotoModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleNextPhoto = () => {
    if (photos?.results && photoModalIndex < photos.results.length - 1) {
      const nextIndex = photoModalIndex + 1;
      setPhotoModalIndex(nextIndex);
      setSelectedPhoto(photos.results[nextIndex]);
    }
  };

  const handlePrevPhoto = () => {
    if (photos?.results && photoModalIndex > 0) {
      const prevIndex = photoModalIndex - 1;
      setPhotoModalIndex(prevIndex);
      setSelectedPhoto(photos.results[prevIndex]);
    }
  };

  // Smoothly scroll the horizontal photo rail left or right.
  const handleScrollRail = (direction = 1) => {
    const rail = photoRailRef.current;
    if (!rail) return;
    const distance = rail.clientWidth * 0.8 * direction;
    rail.scrollBy({ left: distance, behavior: "smooth" });
  };

  const weatherUrl =
    effectiveSearchTerm && OPENWEATHER_KEY && OPENWEATHER_KEY !== "your_openweathermap_api_key_here"
      ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          effectiveSearchTerm
        )}&appid=${OPENWEATHER_KEY}&units=metric`
      : null;

  const photoUrl =
    effectiveSearchTerm && UNSPLASH_KEY && UNSPLASH_KEY !== "your_unsplash_access_key_here"
      ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          effectiveSearchTerm
        )}&client_id=${UNSPLASH_KEY}&per_page=12`
      : null;

  const {
    data: weather,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useFetch(weatherUrl, { ttl: 5 * 60 * 1000 }, [effectiveSearchTerm]);

  const {
    data: photos,
    loading: photoLoading,
    error: photoError,
    refetch: refetchPhotos,
  } = useFetch(photoUrl, { ttl: 5 * 60 * 1000 }, [effectiveSearchTerm]);

  const handleRefresh = () => {
    refetchWeather();
    refetchPhotos();
  };

  if (!searchTerm) {
    return (
      <div className="py-5 animate-fade-in container safe-container">
        <div className="glass-card p-4 p-sm-5 rounded-4 mx-auto text-center d-flex flex-column gap-4" style={{ maxWidth: '800px' }}>
          <div className="d-flex align-items-center justify-content-center gap-3 text-white text-opacity-90 small">
            <button onClick={handleBackHome} className="glass-card px-3 py-1 rounded-pill hover-bg-opacity-10 transition-colors btn btn-link text-decoration-none text-white border-0">🏠 Home</button>
            <span className="text-white text-opacity-50">→</span>
            <span className="glass-card px-3 py-1 rounded-pill bg-white bg-opacity-10">🌍 Explore</span>
          </div>

          <div>
            <div className="display-4 mb-4">🗺️</div>
            <h1 className="h2 fw-bold text-light mb-3">Ready to explore?</h1>
            <p className="text-white text-opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
              Search any destination to see weather, photos, and smart suggestions. Start typing below or pick a quick option.
            </p>
          </div>

          <div className="mx-auto w-100" style={{ maxWidth: '600px' }}>
            <SmartSearchBar onSearch={handleNewSearch} placeholder="Search a city or destination..." />
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {["Paris", "Tokyo", "New York", "London", "Dubai", "Sydney"].map((city) => (
              <button
                key={city}
                onClick={() => handleNewSearch(city)}
                className="glass-card px-4 py-2 rounded-pill text-white text-opacity-75 hover-text-white scale-hover small fw-semibold btn border-0"
              >
                🔍 {city}
              </button>
            ))}
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-3 small text-white text-opacity-75">
            <button onClick={handleBackHome} className="glass-card px-4 py-2 rounded-3 hover-bg-opacity-10 transition-colors btn text-white border-0">Start over</button>
            <button onClick={() => navigate('/favourites')} className="glass-card px-4 py-2 rounded-3 hover-bg-opacity-10 transition-colors btn text-white border-0">Go to favourites</button>
          </div>
        </div>
      </div>
    );
  }

  // Show API key configuration warning
  if (missingKeys.length > 0) {
    return (
      <div className="text-center py-5 animate-fade-in">
        <div className="glass-card p-5 rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="display-1 mb-4">⚙️</div>
          <h1 className="h2 fw-bold text-warning mb-4">Configuration Required</h1>
          <div className="bg-warning bg-opacity-10 border border-warning text-warning p-4 rounded-4">
            <p className="mb-3 fw-medium">The following API keys need to be configured:</p>
            <ul className="list-unstyled text-start d-flex flex-column gap-2">
              {missingKeys.map((key, index) => (
                <li key={index} className="d-flex align-items-center gap-2">
                  <span className="d-inline-block rounded-circle bg-warning" style={{ width: '8px', height: '8px' }}></span>
                  {key}
                </li>
              ))}
            </ul>
            <p className="mt-4 small bg-white bg-opacity-50 p-3 rounded-3 text-dark">
              💡 Please check the README.md file for setup instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have no results (both weather and photos failed or no data)
  const hasNoResults = (!weather && !weatherLoading && weatherError) && 
                      (!photos?.results?.length && !photoLoading);

  // Show NoResultsFound component if no data is available
  if (hasNoResults && !weatherError?.includes('HTTP 401') && !photoError?.includes('401')) {
    return <NoResultsFound searchTerm={searchTerm} onNewSearch={handleNewSearch} />;
  }

  return (
    <div className="animate-fade-in container py-4">
      {/* Navigation Breadcrumb & New Search */}
      <div className="glass-card p-4 rounded-4 mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          {/* Breadcrumb */}
          <div className="d-flex align-items-center gap-2 small text-white text-opacity-75">
            <button 
              onClick={handleBackHome}
              className="text-white text-decoration-none d-flex align-items-center gap-1 btn btn-link p-0 border-0"
            >
              🏠 Home
            </button>
            <span>→</span>
            <span className="text-white fw-medium">🌍 Explore</span>
            <span>→</span>
            <span className="text-white fw-bold">{searchTerm}</span>
          </div>
          
          {/* Quick Actions */}
          <div className="d-flex gap-2">
            <button
              onClick={handleBackHome}
              className="glass-card px-4 py-2 rounded-3 text-white text-opacity-90 hover-text-white hover-bg-opacity-10 transition-all d-flex align-items-center gap-2 small fw-medium btn border-0"
            >
              🏠 New Search
            </button>
            <button
              onClick={handleRefresh}
              className="glass-card px-4 py-2 rounded-3 text-white text-opacity-90 hover-text-white hover-bg-opacity-10 transition-all d-flex align-items-center gap-2 small fw-medium btn border-0"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
        
        {/* Inline Search Bar */}
        <div className="mt-4">
          <SmartSearchBar onSearch={handleNewSearch} placeholder="Search another destination..." />
        </div>
      </div>

      {/* Smart Correction Notification */}
      {showCorrection && correctionData && (
        <SearchCorrection
          originalQuery={correctionData.original}
          correctedQuery={correctionData.corrected}
          onAccept={handleAcceptCorrection}
          onReject={handleRejectCorrection}
        />
      )}

      {/* Destination Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2" style={{ background: 'linear-gradient(to right, #9333ea, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🌍 {searchTerm}
        </h1>
        <p className="text-white text-opacity-75">Discover weather and stunning visuals</p>
      </div>

      {/* Data status to confirm fetched destination */}
      <div className="glass-card p-4 rounded-4 mb-4 small text-white text-opacity-75 d-flex flex-wrap gap-3 align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span>📍</span>
          <span>Search query: <strong className="text-white">{searchTerm}</strong></span>
        </div>
        {effectiveSearchTerm && effectiveSearchTerm !== searchTerm && (
          <div className="d-flex align-items-center gap-2 text-white text-opacity-75">
            <span>✨</span>
            <span>Using corrected term: <strong className="text-white">{effectiveSearchTerm}</strong></span>
          </div>
        )}
        {weather?.name && (
          <div className="d-flex align-items-center gap-2">
            <span>✅</span>
            <span>Weather location: <strong className="text-white">{weather.name}</strong></span>
          </div>
        )}
        {photos?.results?.length >= 0 && (
          <div className="d-flex align-items-center gap-2">
            <span>📸</span>
            <span>Photos returned: <strong className="text-white">{photos.results?.length || 0}</strong></span>
          </div>
        )}
        {(weather?.name && weather.name.toLowerCase() !== searchTerm.toLowerCase()) && (
          <div className="d-flex align-items-center gap-2 text-warning">
            <span>⚠️</span>
            <span>Weather city differs from search term</span>
          </div>
        )}
      </div>

      {weatherError && (
        <div className="glass-card bg-danger bg-opacity-25 border border-danger text-white p-4 rounded-4 mb-4 animate-slide-up">
          <div className="d-flex align-items-center gap-2">
            <span>⚠️</span>
            <span>Weather data unavailable: {weatherError}</span>
          </div>
        </div>
      )}

      {weather && (
        <div className="glass-card p-4 rounded-4 mb-4 hover-lift animate-slide-up">
          <div className="d-flex align-items-center gap-2 mb-4">
            <span className="fs-4">🌤️</span>
            <h2 className="h4 fw-bold text-dark mb-0">Current Weather</h2>
          </div>
          
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col text-center">
              <div className="display-4 fw-bold text-primary mb-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-capitalize text-dark fw-medium">
                {weather.weather[0].description}
              </div>
            </div>
            
            <div className="col d-flex flex-column gap-3 justify-content-center">
              <div className="d-flex align-items-center gap-2">
                <span>💧</span>
                <span className="text-dark">Humidity: <strong>{weather.main.humidity}%</strong></span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span>🌪️</span>
                <span className="text-dark">Wind: <strong>{weather.wind.speed} m/s</strong></span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span>🌡️</span>
                <span className="text-dark">Feels like: <strong>{Math.round(weather.main.feels_like)}°C</strong></span>
              </div>
            </div>
            
            <div className="col">
              <div className="p-4 rounded-4 h-100 d-flex flex-column align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #dbeafe, #f3e8ff)' }}>
                <div className="display-1 mb-2">
                  {weather.weather[0].main === 'Clear' ? '☀️' : 
                   weather.weather[0].main === 'Clouds' ? '☁️' :
                   weather.weather[0].main === 'Rain' ? '🌧️' :
                   weather.weather[0].main === 'Snow' ? '❄️' : '🌤️'}
                </div>
                <div className="text-center text-dark fw-medium">
                  {weather.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {photoError && (
        <div className="glass-card bg-danger bg-opacity-25 border border-danger text-white p-4 rounded-4 mb-4 animate-slide-up">
          <div className="d-flex align-items-center gap-2">
            <span>📸</span>
            <span>Photos unavailable: {photoError}</span>
          </div>
        </div>
      )}

      {photos && photos.results && photos.results.length > 0 && (
        <div className="animate-slide-up">
          <div className="d-flex align-items-center gap-2 mb-4">
            <span className="fs-4">📸</span>
            <h2 className="h4 fw-bold text-white mb-0">Beautiful Photos</h2>
            <div className="ms-auto small text-white text-opacity-75">
              {photos.results.length} photos • Click to expand
            </div>
          </div>
          
          {/* Horizontal photo rail */}
          <div className="d-flex align-items-center gap-3 small text-white text-opacity-75 mb-3">
            <button
              type="button"
              onClick={() => handleScrollRail(-1)}
              className="glass-card px-3 py-1 rounded-pill hover-bg-opacity-10 transition-colors d-flex align-items-center gap-1 btn border-0 text-white"
              aria-label="Scroll photos left"
            >
              ←
            </button>
            <span className="glass-card px-3 py-1 rounded-pill">Scroll to browse</span>
            <button
              type="button"
              onClick={() => handleScrollRail(1)}
              className="glass-card px-3 py-1 rounded-pill hover-bg-opacity-10 transition-colors d-flex align-items-center gap-1 btn border-0 text-white"
              aria-label="Scroll photos right"
            >
              →
            </button>
          </div>

          <div
            ref={photoRailRef}
            className="d-flex gap-3 overflow-auto pb-3 pe-2 flex-nowrap"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {photos.results.slice(0, 15).map((photo, index) => (
              <div
                key={photo.id}
                className="flex-shrink-0"
                style={{ scrollSnapAlign: 'start', width: '240px' }}
              >
                <PhotoCard
                  photo={photo}
                  index={index}
                  onClick={handlePhotoClick}
                />
              </div>
            ))}
          </div>
          
          {/* Load more hint */}
          {photos.results.length > 15 && (
            <div className="text-center mt-4">
              <div className="glass-card px-4 py-2 rounded-pill d-inline-block">
                <span className="text-white text-opacity-75 small">
                  Showing 15 of {photos.results.length} photos
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photo Modal */}
      <PhotoModal
        photo={selectedPhoto}
        isOpen={isPhotoModalOpen}
        onClose={handlePhotoModalClose}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        hasNext={photos?.results && photoModalIndex < photos.results.length - 1}
        hasPrev={photoModalIndex > 0}
      />

      {!photos?.results?.length && !photoLoading && !photoError && (
        <div className="glass-card p-5 rounded-4 text-center animate-slide-up">
          <div className="display-4 mb-4">🔍</div>
          <p className="text-dark fw-medium">No photos found for {searchTerm}</p>
          <p className="text-secondary small mt-2">Try searching for a different destination</p>
        </div>
      )}
    </div>
  );
}