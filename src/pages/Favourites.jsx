import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Favourites Page Component
 * Manages the user's saved destinations and trip planning tools.
 * Features:
 * - List of saved places (persisted to localStorage)
 * - Recommended destinations based on categories
 * - Trip planning tools (Budget, Itinerary, Packing List)
 */
export default function Favourites() {
  const navigate = useNavigate();
  const savedRef = useRef(null);
  const plannerRef = useRef(null);
  const recommendationsRef = useRef(null);

  const [activeTool, setActiveTool] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast notifications
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Mock data for default favourites if storage is empty
  const defaultFavourites = [
    { name: 'Paris', emoji: '🗼', note: 'Sunset over the Seine', saved: '2 days ago' },
    { name: 'Tokyo', emoji: '🏯', note: 'Sakura season wish-list', saved: '1 week ago' },
    { name: 'New York', emoji: '🗽', note: 'Broadway + food crawl', saved: '2 weeks ago' },
  ];

  // Mock data for recommendations
  const recommendedDestinations = [
    { name: 'Lisbon', emoji: '⛵', note: 'Coastal views & custard tarts', type: 'Scenery' },
    { name: 'Seoul', emoji: '🛍️', note: 'Markets, cafes, neon nights', type: 'City' },
    { name: 'Cape Town', emoji: '⛰️', note: 'Table Mountain and vineyards', type: 'Scenery' },
    { name: 'Vancouver', emoji: '🌲', note: 'Mountains, sea, and sushi', type: 'Scenery' },
    { name: 'Mexico City', emoji: '🌮', note: 'Food stalls, murals, and mezcal', type: 'Food' },
    { name: 'Rome', emoji: '🍝', note: 'Pasta, piazzas, and sunset walks', type: 'Food' },
    { name: 'Barcelona', emoji: '🎨', note: 'Gaudí lines, tapas nights, seaside rides', type: 'City' },
    { name: 'Bali', emoji: '🏝️', note: 'Rice terraces, surf, and slow mornings', type: 'Scenery' },
  ];

  // Initialize favourites from localStorage or defaults
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem('travelwise:favourites');
      return stored ? JSON.parse(stored) : defaultFavourites;
    } catch {
      return defaultFavourites;
    }
  });

  // Persist favourites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('travelwise:favourites', JSON.stringify(favourites));
    } catch {
      // ignore storage failures
    }
  }, [favourites]);

  const handleExploreNew = () => {
    navigate('/explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanTrip = (name) => {
    navigate(`/explore?search=${encodeURIComponent(name)}`);
  };

  const handleToggleFavourite = (destination) => {
    setFavourites((prev) => {
      const exists = prev.find((item) => item.name === destination.name);
      if (exists) {
        setToast({ message: `Removed ${destination.name} from favourites`, type: 'info' });
        return prev.filter((item) => item.name !== destination.name);
      }
      setToast({ message: `Saved ${destination.name} to your hub!`, type: 'success' });
      return [...prev, { ...destination, saved: 'Just now' }];
    });
  };

  const handleClearFavourites = () => {
    if (window.confirm("Are you sure you want to clear your travel hub?")) {
      setFavourites([]);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const planningTools = [
    { title: 'Packing', icon: '👔', desc: 'Smart lists', detail: 'Generate weather-appropriate packing lists based on your destination\'s forecast.' },
    { title: 'Budget', icon: '💰', desc: 'Expense tracking', detail: 'Estimate daily costs for food, transport, and accommodation.' },
    { title: 'Lodging', icon: '🏠', desc: 'Top rated stays', detail: 'Find the best neighborhoods and rated hotels for your stay.' },
    { title: 'Foodie', icon: '🍱', desc: 'Local eats', detail: 'Discover must-try local dishes and top-rated restaurants.' },
  ];

  return (
    <div className="min-vh-100 bg-dark text-light pb-5">
      <div className="container pt-5">
        
        {/* --- HEADER HERO --- */}
        <header className="text-center py-5 mb-5 position-relative">
          <div className="mb-4">
            <h1 className="display-1 fw-bold text-white">
              Travel<span className="text-primary">Wise</span> Hub
            </h1>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Your personal atlas for future adventures. Map your dreams, organize your stays, and discover the world's finest.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 px-4 py-3 rounded-4 text-center">
              <span className="d-block h3 fw-bold text-white mb-0">{favourites.length}</span>
              <small className="text-uppercase fw-bold text-primary" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Destinations</small>
            </div>
            <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 px-4 py-3 rounded-4 text-center">
              <span className="d-block h3 fw-bold text-white mb-0">0</span>
              <small className="text-uppercase fw-bold text-info" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Itineraries</small>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="sticky-top py-3 d-flex justify-content-center" style={{ zIndex: 1020 }}>
             <div className="bg-dark bg-opacity-75 border border-secondary border-opacity-25 p-2 rounded-pill shadow d-flex gap-2">
                {[
                  { label: 'Saved', ref: savedRef, icon: '📍' },
                  { label: 'Planning', ref: plannerRef, icon: '🗺️' },
                  { label: 'Ideas', ref: recommendationsRef, icon: '✨' }
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => scrollToSection(item.ref)}
                    className="btn btn-sm btn-outline-light rounded-pill px-3 fw-bold border-0 d-flex align-items-center gap-2"
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
             </div>
          </nav>
        </header>

        {/* --- SAVED SECTION --- */}
        <section ref={savedRef} className="mb-5 pt-5">
          <div className="d-flex align-items-end justify-content-between border-bottom border-secondary border-opacity-25 pb-3 mb-4">
            <div>
              <h2 className="h2 fw-bold text-white">Bucket List</h2>
              <p className="text-secondary mb-0">Your curated collection of world wonders.</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                onClick={handleExploreNew}
                className="btn btn-primary fw-bold rounded-4 px-4"
              >
                Find more
              </button>
              {favourites.length > 0 && (
                <button onClick={handleClearFavourites} className="btn btn-link text-secondary text-decoration-none fw-bold">
                  Reset Hub
                </button>
              )}
            </div>
          </div>

          {favourites.length === 0 ? (
            <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded-5 p-5 text-center">
              <div className="display-1 mb-3">🎒</div>
              <h3 className="h3 fw-bold text-white">Your suitcase is empty</h3>
              <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '300px' }}>Browse the explore page to start pinning your favorite global destinations.</p>
              <button onClick={handleExploreNew} className="btn btn-link text-primary fw-bold text-decoration-none border-bottom border-primary">Go explore now →</button>
            </div>
          ) : (
            <div className="row g-4">
              {favourites.map((item) => (
                <div key={item.name} className="col-md-6 col-lg-4">
                  <div className="card bg-dark border-secondary border-opacity-25 h-100 rounded-4 overflow-hidden">
                    <div 
                      className="card-img-top bg-gradient p-5 d-flex align-items-center justify-content-center position-relative" 
                      style={{ height: '200px', background: 'linear-gradient(135deg, #6610f2, #6f42c1)', cursor: 'pointer' }}
                      onClick={() => setExpandedItem(item)}
                    >
                      <span className="display-1 user-select-none">{item.emoji}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleFavourite(item); }}
                        className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2 shadow-sm text-danger"
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ❤️
                      </button>
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h3 className="h4 fw-bold text-white mb-1">{item.name}</h3>
                          <p className="text-secondary small fst-italic mb-0">"{item.note || 'No notes added'}"</p>
                        </div>
                        <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-2">
                          {item.saved}
                        </span>
                      </div>
                      <div className="mt-auto row g-2">
                        <div className="col-6">
                          <button 
                            onClick={() => handlePlanTrip(item.name)}
                            className="btn btn-light w-100 fw-bold rounded-3"
                          >
                            Plan Trip
                          </button>
                        </div>
                        <div className="col-6">
                          <button 
                            onClick={() => handlePlanTrip(item.name)}
                            className="btn btn-outline-light w-100 fw-bold rounded-3"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- PLANNING HUB --- */}
        <section ref={plannerRef} className="mb-5 pt-5">
          <div className="bg-primary bg-gradient rounded-5 p-5 position-relative overflow-hidden shadow-lg">
            <div className="row align-items-center g-5 position-relative" style={{ zIndex: 1 }}>
              <div className="col-lg-6">
                <span className="text-white-50 fw-bold text-uppercase small letter-spacing-2">Strategy Suite</span>
                <h2 className="display-4 fw-bold text-white mb-3">Master your next 1,000 miles.</h2>
                <p className="text-white-50 lead mb-4">Use your saved gems to build instant packing lists, transit maps, and hotel shortlist comparisons.</p>
                <div className="d-flex flex-wrap gap-2">
                   {favourites.slice(0, 5).map(f => (
                     <button key={f.name} onClick={() => handlePlanTrip(f.name)} className="btn btn-sm btn-outline-light rounded-pill fw-bold border-0 bg-white bg-opacity-25">
                       📍 {f.name}
                     </button>
                   ))}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row g-3">
                  {planningTools.map((tool) => (
                    <div key={tool.title} className="col-6">
                      <div 
                        onClick={() => setActiveTool(tool)}
                        className="card bg-white bg-opacity-10 border-0 h-100 p-3 text-white cursor-pointer hover-overlay"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="h2 mb-2">{tool.icon}</div>
                          <div className="fw-bold">{tool.title}</div>
                          <div className="small text-white-50">{tool.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- RECOMMENDATIONS --- */}
        <section ref={recommendationsRef} className="mb-5 pt-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-white">Inspired by your Taste</h2>
            <p className="text-secondary">Trending spots from fellow globetrotters.</p>
          </div>

          <div className="row g-4">
            {recommendedDestinations.map((dest) => {
              const isSaved = favourites.some(f => f.name === dest.name);
              // Bootstrap colors
              const bgClass = 
                dest.type === 'City' ? 'bg-primary' :
                dest.type === 'Food' ? 'bg-danger' : 
                'bg-success';

              return (
                <div key={dest.name} className="col-sm-6 col-lg-3">
                  <div className="card bg-dark border-secondary border-opacity-25 h-100 rounded-4 p-3">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div className="mb-3">
                        <div 
                          className={`rounded-4 ${bgClass} bg-gradient d-flex align-items-center justify-content-center mb-3 shadow`} 
                          style={{ width: '64px', height: '64px', fontSize: '2rem', cursor: 'pointer' }}
                          onClick={() => setExpandedItem(dest)}
                        >
                          <span className="user-select-none">{dest.emoji}</span>
                        </div>
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h4 className="h5 fw-bold text-white mb-0">{dest.name}</h4>
                            <span className="badge bg-secondary bg-opacity-25 text-secondary text-uppercase" style={{ fontSize: '0.6rem' }}>{dest.type}</span>
                          </div>
                          <p className="small text-secondary mb-0">{dest.note}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleFavourite(dest)}
                        className={`btn w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 ${
                          isSaved 
                          ? 'btn-success text-white' 
                          : 'btn-light text-dark'
                        }`}
                      >
                        {isSaved ? '✅ Saved' : '❤️ Save'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- PLANNING MODAL --- */}
        {activeTool && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setActiveTool(null)}>
             <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content bg-dark text-light border-secondary rounded-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="modal-header border-0 position-relative p-4">
                    <div className="position-absolute top-0 start-0 w-100" style={{ height: '5px', background: 'linear-gradient(to right, #6610f2, #6f42c1)' }}></div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 rounded-3 p-3 d-flex align-items-center justify-content-center h2 mb-0 text-primary">
                        {activeTool.icon}
                      </div>
                      <div>
                        <h5 className="modal-title fw-bold">{activeTool.title} Planner</h5>
                        <p className="small text-secondary mb-0">{activeTool.detail}</p>
                      </div>
                    </div>
                    <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={() => setActiveTool(null)}></button>
                  </div>
                  
                  <div className="modal-body p-4 pt-0">
                    <div className="bg-secondary bg-opacity-10 rounded-3 p-3 border border-secondary border-opacity-25">
                      <h6 className="text-primary text-uppercase fw-bold small mb-3">Select Destination</h6>
                      {favourites.length > 0 ? (
                        <div className="d-grid gap-2">
                          {favourites.slice(0, 3).map(f => (
                            <button 
                              key={f.name}
                              onClick={() => {
                                setActiveTool(null);
                                handlePlanTrip(f.name);
                              }}
                              className="btn btn-outline-light border-0 text-start d-flex justify-content-between align-items-center p-2 rounded-3 hover-bg-secondary"
                            >
                              <span className="fw-medium">📍 {f.name}</span>
                              <span className="text-secondary small">Open →</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-secondary small mb-2">No saved destinations yet.</p>
                          <button onClick={handleExploreNew} className="btn btn-link btn-sm text-primary fw-bold text-decoration-none">Find a place first</button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="modal-footer border-0 p-4 pt-0">
                    <button 
                      onClick={() => setActiveTool(null)}
                      className="btn btn-light fw-bold rounded-3 px-4"
                    >
                      Done
                    </button>
                  </div>
               </div>
             </div>
          </div>
        )}

        {/* --- EXPANDED IMAGE MODAL --- */}
        {expandedItem && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setExpandedItem(null)}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-dark text-light border-secondary rounded-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="modal-body p-0 position-relative">
                    <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3" onClick={() => setExpandedItem(null)}></button>
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '500px', background: 'linear-gradient(135deg, #6610f2, #6f42c1)' }}>
                        <span className="display-1 user-select-none" style={{ fontSize: '8rem' }}>{expandedItem.emoji}</span>
                    </div>
                    <div className="p-4">
                        <h3 className="fw-bold">{expandedItem.name}</h3>
                        <p className="text-secondary">{expandedItem.note}</p>
                        <span className="badge bg-secondary bg-opacity-25 text-secondary text-uppercase">{expandedItem.type || 'Destination'}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TOAST NOTIFICATION --- */}
        {toast && (
          <div className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3" style={{ zIndex: 1090 }}>
            <div className="toast show align-items-center text-bg-light border-0 rounded-pill shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex px-3 py-2">
                <div className="toast-body fw-bold d-flex align-items-center gap-2">
                  <span>{toast.type === 'success' ? '✅' : 'ℹ️'}</span>
                  {toast.message}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
