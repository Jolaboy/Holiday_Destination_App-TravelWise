/**
 * Loader Component
 * Displays a full-screen loading animation with a spinning globe and bouncing plane.
 * Used during data fetching or page transitions.
 */
export default function Loader() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 animate-fade-in">
      <div className="glass-card p-5 rounded-4 text-center">
        <div className="position-relative d-inline-block">
          {/* Spinning globe animation */}
          <div className="display-1 animate-spin" style={{ animation: 'spin 3s linear infinite' }}>
            🌍
          </div>
          
          {/* Floating plane animation */}
          <div className="position-absolute top-0 end-0 fs-4 animate-bounce" style={{ marginTop: '-10px', marginRight: '-10px' }}>
            ✈️
          </div>
        </div>
        
        <h3 className="h4 fw-bold text-dark mt-4 mb-2">
          Exploring the world...
        </h3>
        
        <p className="text-secondary animate-pulse">
          Fetching amazing destinations for you
        </p>
        
        {/* Animated loading dots */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          <div className="rounded-circle bg-primary animate-bounce" style={{ width: '8px', height: '8px', animationDelay: '0s' }}></div>
          <div className="rounded-circle bg-danger animate-bounce" style={{ width: '8px', height: '8px', animationDelay: '0.1s' }}></div>
          <div className="rounded-circle bg-info animate-bounce" style={{ width: '8px', height: '8px', animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}