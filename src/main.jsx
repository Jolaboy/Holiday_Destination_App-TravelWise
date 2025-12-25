
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// Import Bootstrap CSS for global styling
import "bootstrap/dist/css/bootstrap.min.css";
// Import custom global styles
import "./index.css";

// Initialize the React application
// This finds the root element in the HTML and renders the App component into it
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);