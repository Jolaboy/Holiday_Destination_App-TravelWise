import { useState } from "react";

/**
 * Photo Card Component
 * Displays a single photo with advanced features:
 * - Lazy loading with skeleton placeholder
 * - Error handling with fallback UI
 * - Hover effects and animations
 * - Click handler for modal view
 * 
 * @param {object} photo - The photo object from Unsplash API
 * @param {number} index - Index for staggered animation delay
 * @param {function} onClick - Handler for opening the photo modal
 */
export default function PhotoCard({ photo, index, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Render error state if image fails to load
  if (hasError) {
    return (
      <div className="glass-card rounded-4 overflow-hidden hover-lift cursor-pointer ratio ratio-1x1 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center p-4">
          <div className="display-4 mb-2">📷</div>
          <p className="text-secondary small">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="glass-card rounded-4 overflow-hidden hover-lift cursor-pointer ratio ratio-1x1 position-relative animate-slide-up photo-card-container"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onClick(photo, index)}
    >
      {/* Loading skeleton shown while image loads */}
      {!isLoaded && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-opacity-25 animate-pulse" />
      )}
      
      {/* Actual Image */}
      <img
        src={photo.urls.small}
        alt={photo.alt_description || "Destination photo"}
        className={`w-100 h-100 object-fit-cover transition-all ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {/* Hover overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center transition-all photo-card-overlay" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="transition-opacity scale-hover">
          <div className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', backdropFilter: 'blur(4px)' }}>
            <span className="text-white fs-4">🔍</span>
          </div>
        </div>
      </div>
      
      {/* Photo info overlay */}
      <div className="position-absolute bottom-0 start-0 end-0 p-2 p-sm-3 transition-all photo-card-info" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
        <div className="text-white">
          <p className="small fw-medium text-truncate mb-1">
            {photo.alt_description || "Beautiful view"}
          </p>
          <p className="small text-white text-opacity-75 d-flex align-items-center justify-content-between mb-0">
            <span className="text-truncate">📸 {photo.user.name}</span>
            <span className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
              💝 {photo.likes || 0}
            </span>
          </p>
        </div>
      </div>
      
      {/* Click hint */}
      <div className="position-absolute top-0 end-0 m-1 m-sm-2 transition-opacity photo-card-hint">
        <div className="glass-card px-1 px-sm-2 py-1 rounded-3">
          <span className="text-white small">Click to expand</span>
        </div>
      </div>
    </div>
  );
}