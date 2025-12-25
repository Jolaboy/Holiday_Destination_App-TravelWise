import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

/**
 * Navigation Bar Component
 * Displays the application logo and navigation links.
 * Handles active state highlighting for the current route.
 */
export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Helper to check if a path matches the current location
  const isActive = (path) => location.pathname === path;
  
  // Navigation configuration
  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Explore', icon: '🌍' },
    { path: '/favourites', label: 'Favourites', icon: '💖' }
  ];
  
  return (
    <nav className="glass-navbar text-white shadow-lg sticky-top border-bottom border-white border-opacity-10 overflow-hidden">
      <div className="container py-3 safe-container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo - Links to Home */}
          <Link 
            to="/" 
            className="text-decoration-none scale-hover"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="h3 fw-bold" style={{ background: 'linear-gradient(to right, #ffffff, #e9d5ff, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ✈️ TravelWise
            </span>
          </Link>

          {/* Desktop Navigation Menu */}
          <div className="d-none d-md-flex gap-2 align-items-center">
            {navigationItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`position-relative px-4 py-2 rounded-pill fw-bold text-decoration-none d-flex align-items-center gap-2 scale-hover transition-all ${
                  isActive(item.path) 
                    ? 'bg-white bg-opacity-25 text-white shadow-sm border border-white border-opacity-25' 
                    : 'text-white text-opacity-75 hover-text-white'
                }`}
              >
                <span className="fs-5">{item.icon}</span>
                <span>{item.label}</span>
                {/* Active indicator dot */}
                {isActive(item.path) && (
                  <div className="position-absolute bottom-0 start-50 translate-middle-x bg-white rounded-circle" style={{ width: '4px', height: '4px', marginBottom: '4px' }}></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="d-md-none btn btn-link text-white p-2 text-decoration-none"
            aria-label="Toggle menu"
          >
            <div style={{ width: '24px', height: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <span className={`bg-white w-100 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} style={{ height: '2px', transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
              <span className={`bg-white w-100 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} style={{ height: '2px', opacity: isMobileMenuOpen ? 0 : 1 }}></span>
              <span className={`bg-white w-100 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} style={{ height: '2px', transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`d-md-none overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'mt-3' : ''}`} style={{ maxHeight: isMobileMenuOpen ? '300px' : '0', opacity: isMobileMenuOpen ? 1 : 0 }}>
          <div className="glass-card rounded-4 p-3 mx-2 d-flex flex-column gap-2">
            {navigationItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`d-block w-100 px-3 py-2 rounded-3 fw-bold text-decoration-none d-flex align-items-center gap-3 transition-all ${
                  isActive(item.path) 
                    ? 'bg-white bg-opacity-25 text-white shadow-sm' 
                    : 'text-white text-opacity-75 hover-text-white'
                }`}
              >
                <span className="fs-4">{item.icon}</span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="ms-auto small">•</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}