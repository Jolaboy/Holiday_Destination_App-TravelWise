import { useState, useEffect, useCallback } from "react";

/**
 * Search Correction Component
 * Displays a "Did you mean...?" suggestion when a user's search term has a close match.
 * Auto-hides after a few seconds.
 * 
 * @param {string} originalQuery - The user's original search term
 * @param {string} correctedQuery - The suggested correction
 * @param {function} onAccept - Handler when user accepts the correction
 * @param {function} onReject - Handler when user dismisses the suggestion
 */
export default function SearchCorrection({ originalQuery, correctedQuery, onAccept, onReject }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Handle closing animation and state update
  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wait for animation to finish before unmounting/hiding
    setTimeout(() => {
      setIsVisible(false);
      onReject && onReject();
    }, 300);
  }, [onReject]);

  // Auto-hide timer
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 8000); // Auto-hide after 8 seconds

    return () => clearTimeout(timer);
  }, [handleClose]);

  const handleAccept = () => {
    onAccept();
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`position-fixed start-50 translate-middle-x z-3 w-100 p-3 transition-all ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`} style={{ top: '80px', maxWidth: '480px', transform: isClosing ? 'translate(-50%, -20px) scale(0.95)' : 'translate(-50%, 0) scale(1)' }}>
      <div className="glass-card p-4 rounded-4 border border-warning border-opacity-25 shadow-lg">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-4">🤔</div>
          <div className="flex-grow-1">
            <h4 className="text-white fw-semibold mb-1">
              Did you mean "{correctedQuery}"?
            </h4>
            <p className="text-white text-opacity-75 small mb-3">
              We found a close match for "<span className="text-warning">{originalQuery}</span>"
            </p>
            <div className="d-flex gap-2">
              <button
                onClick={handleAccept}
                className="btn btn-success px-4 py-2 rounded-3 small fw-medium transition-all scale-hover border-0"
              >
                ✓ Yes, search "{correctedQuery}"
              </button>
              <button
                onClick={handleClose}
                className="btn btn-light bg-opacity-10 text-white px-4 py-2 rounded-3 small fw-medium transition-all border-0"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                ✕ No, keep original
              </button>
            </div>
          </div>
        </div>
        
        {/* Auto-close progress bar */}
        <div className="mt-3 bg-white bg-opacity-25 rounded-pill overflow-hidden" style={{ height: '4px' }}>
          <div 
            className="h-100 rounded-pill"
            style={{ 
              width: isClosing ? '0%' : '100%',
              transition: isClosing ? 'width 0.3s ease-out' : 'width 8s linear',
              background: 'linear-gradient(to right, #facc15, #fb923c)'
            }}
          />
        </div>
      </div>
    </div>
  );
}