import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Favourites from "./pages/Favourites";

/**
 * Main Application Component
 * Sets up the routing and main layout structure of the application.
 * Includes the Navbar and a container for the page content.
 */
export default function App() {
  return (
    // BrowserRouter enables client-side routing
    <BrowserRouter>
      <div className="min-vh-100 overflow-hidden">
        {/* Navigation bar appears on all pages */}
        <Navbar />
        {/* Main content area with padding and container constraints */}
        <main className="container py-5 safe-container">
          {/* Define routes for the application */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/favourites" element={<Favourites />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}