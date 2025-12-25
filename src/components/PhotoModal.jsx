import { useEffect } from "react";

/**
 * Photo Modal Component
 * Displays a high-resolution version of a photo in a full-screen overlay.
 * Features:
 * - Keyboard navigation (Left/Right arrows, Escape to close)
 * - Scroll locking for the background page
 * - Backdrop click to close
 * 
 * @param {object} photo - The photo object to display
 * @param {boolean} isOpen - Visibility state
 * @param {function} onClose - Handler to close the modal
 * @param {function} onNext - Handler for next photo
 * @param {function} onPrev - Handler for previous photo
 * @param {boolean} hasNext - Whether there is a next photo
 * @param {boolean} hasPrev - Whether there is a previous photo
 */
export default function PhotoModal({ photo, isOpen, onClose, onNext, onPrev, hasNext, hasPrev }) {
  useEffect(() => {
    // Handle keyboard events for navigation and closing
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when modal is open to prevent background scrolling
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup event listeners and restore scroll on unmount/close
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen || !photo) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 p-sm-4 safe-container" style={{ zIndex: 1050 }}>
      {/* Dark Backdrop with blur effect */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-90"
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      
      {/* Modal Content Container */}
      <div className="position-relative w-100 mx-auto animate-fade-in overflow-hidden rounded-4 shadow-lg bg-black bg-opacity-75 d-flex align-items-center justify-content-center" style={{ maxWidth: '1100px', height: '82vh', maxHeight: '90vh' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="position-absolute top-0 end-0 m-2 btn btn-dark rounded-circle d-flex align-items-center justify-content-center p-0 scale-hover border-0"
          style={{ width: '40px', height: '40px', zIndex: 10, background: 'rgba(0,0,0,0.5)' }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Navigation Buttons */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="position-absolute start-0 top-50 translate-middle-y m-2 btn btn-dark rounded-circle d-flex align-items-center justify-content-center p-0 scale-hover border-0"
            style={{ width: '48px', height: '48px', zIndex: 10, background: 'rgba(0,0,0,0.5)' }}
            aria-label="Previous photo"
          >
            ←
          </button>
        )}
        
        {hasNext && (
          <button
            onClick={onNext}
            className="position-absolute end-0 top-50 translate-middle-y m-2 btn btn-dark rounded-circle d-flex align-items-center justify-content-center p-0 scale-hover border-0"
            style={{ width: '48px', height: '48px', zIndex: 10, background: 'rgba(0,0,0,0.5)' }}
            aria-label="Next photo"
          >
            →
          </button>
        )}

        {/* Image */}
        <div className="position-relative w-100 h-100 overflow-hidden rounded-4 bg-black d-flex align-items-center justify-content-center">
          <img
            src={photo.urls.full || photo.urls.regular}
            alt={photo.alt_description || "Destination photo"}
            className="img-fluid rounded-4"
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            loading="lazy"
            sizes="1100px"
            srcSet={photo.urls?.small && photo.urls?.regular && photo.urls?.full
              ? `${photo.urls.small} 400w, ${photo.urls.regular} 1080w, ${photo.urls.full} 2000w`
              : undefined}
          />
          
          {/* Photo Info Overlay */}
          <div className="position-absolute bottom-0 start-0 end-0 p-3 p-sm-4 rounded-bottom-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
            <div className="text-white">
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                <div className="overflow-hidden">
                  <h3 className="h5 fw-semibold mb-1 text-truncate">
                    {photo.alt_description || "Beautiful destination"}
                  </h3>
                </div>
                
                <div className="d-flex gap-2 flex-shrink-0">
                  <a
                    href={photo.links.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card px-2 px-sm-3 py-1 py-sm-2 rounded-3 small fw-medium text-white hover-bg-opacity-25 transition-all d-flex align-items-center gap-1 btn border-0 text-decoration-none"
                  >
                    <span className="d-sm-none">📥</span>
                    <span className="d-none d-sm-inline">📥 Download</span>
                  </a>
                  <button
                    onClick={() => navigator.clipboard?.writeText(photo.urls.regular)}
                    className="glass-card px-2 px-sm-3 py-1 py-sm-2 rounded-3 small fw-medium text-white hover-bg-opacity-25 transition-all d-flex align-items-center gap-1 btn border-0"
                  >
                    <span className="d-sm-none">📋</span>
                    <span className="d-none d-sm-inline">📋 Copy Link</span>
                  </button>
                </div>
              </div>
              
              {photo.description && (
                <p className="text-white text-opacity-75 small mt-2 mb-0 text-truncate" style={{ maxWidth: '100%' }}>
                  {photo.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Stats */}
        <div className="position-absolute top-0 start-0 m-2 glass-card px-2 px-sm-3 py-1 py-sm-2 rounded-3">
          <div className="d-flex align-items-center gap-2 gap-sm-4 text-white small">
            <span className="d-flex align-items-center gap-1">
              💝 {photo.likes || 0}
            </span>
            <span className="d-none d-sm-flex align-items-center gap-1">
              📊 {photo.width} × {photo.height}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}