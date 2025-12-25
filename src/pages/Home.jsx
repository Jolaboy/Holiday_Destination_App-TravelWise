import SmartSearchBar from "../components/SmartSearchBar";
import { useNavigate } from "react-router-dom";

/**
 * Home Page Component
 * The landing page of the application.
 * Features:
 * - Hero section with animated text
 * - Central search bar
 * - Grid of popular destinations for quick access
 * - Feature highlights
 */
export default function Home() {
  const navigate = useNavigate();

  // Navigate to the explore page with the search query
  const handleSearch = (query) => {
    navigate(`/explore?search=${query}`);
  };

  // Pre-defined popular destinations with styling data
  const popularDestinations = [
    { name: "Paris", emoji: "🗼", gradient: "linear-gradient(135deg, #f472b6, #f87171)" },
    { name: "Tokyo", emoji: "🏯", gradient: "linear-gradient(135deg, #c084fc, #f472b6)" },
    { name: "New York", emoji: "🗽", gradient: "linear-gradient(135deg, #60a5fa, #818cf8)" },
    { name: "London", emoji: "🎡", gradient: "linear-gradient(135deg, #4ade80, #60a5fa)" },
    { name: "Dubai", emoji: "🕌", gradient: "linear-gradient(135deg, #facc15, #fb923c)" },
    { name: "Sydney", emoji: "🏖️", gradient: "linear-gradient(135deg, #22d3ee, #60a5fa)" }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column overflow-hidden">
      {/* Hero Section - Main entry point */}
      <div className="text-center py-5 animate-fade-in px-3">
        <div className="animate-float">
          <h1 className="display-3 fw-bold mb-4" style={{ background: 'linear-gradient(to right, #ffffff, #e9d5ff, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.2' }}>
            Discover Amazing
            <br />
            <span style={{ background: 'linear-gradient(to right, #fde047, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Destinations
            </span>
          </h1>
        </div>
        
        <p className="lead text-white text-opacity-75 mb-5 mx-auto animate-slide-up px-3" style={{ maxWidth: '600px' }}>
          ✨ Explore the world with real-time weather, stunning photos, and local insights ✨
        </p>

        {/* Search Bar Container */}
        <div className="mx-auto animate-slide-up px-3" style={{ maxWidth: '500px' }}>
          <SmartSearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Popular Destinations Grid */}
      <div className="flex-grow-1 px-3">
        <div className="glass-card rounded-4 p-4 p-sm-5 animate-slide-up container">
          <h2 className="h2 fw-bold text-center mb-4 mb-sm-5 text-dark">
            🌟 Popular Destinations
          </h2>
          
          <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-6 g-3 g-sm-4">
            {popularDestinations.map((dest, index) => (
              <div className="col" key={dest.name}>
                <button
                  onClick={() => handleSearch(dest.name)}
                  className="glass-card hover-lift p-3 p-sm-4 rounded-4 text-center w-100 border-0 scale-hover group"
                  style={{ background: dest.gradient, animationDelay: `${index * 0.1}s`, transition: 'all 0.3s' }}
                >
                  <div className="display-6 mb-2 scale-hover">
                    {dest.emoji}
                  </div>
                  <div className="fw-semibold text-white text-truncate">
                    {dest.name}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5 px-3">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="glass-card p-4 rounded-4 text-center hover-lift h-100">
                <div className="display-4 mb-3">🌤️</div>
                <h3 className="h4 fw-bold text-dark mb-2">Real-time Weather</h3>
                <p className="text-secondary">Get current weather conditions for any destination worldwide</p>
              </div>
            </div>
            
            <div className="col">
              <div className="glass-card p-4 rounded-4 text-center hover-lift h-100">
                <div className="display-4 mb-3">📸</div>
                <h3 className="h4 fw-bold text-dark mb-2">Stunning Photos</h3>
                <p className="text-secondary">Browse beautiful high-quality photos from around the globe</p>
              </div>
            </div>
            
            <div className="col">
              <div className="glass-card p-4 rounded-4 text-center hover-lift h-100">
                <div className="display-4 mb-3">💖</div>
                <h3 className="h4 fw-bold text-dark mb-2">Save Favorites</h3>
                <p className="text-secondary">Keep track of your dream destinations and plan future trips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}