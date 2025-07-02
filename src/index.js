// React core imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// Global styles
import './index.css';

// Main App component
import App from './App';

/**
 * Application entry point
 * Creates the React root and renders the main App component
 * Wrapped in StrictMode for development checks and warnings
 */

// Create the React root element from the DOM element with id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in StrictMode
// StrictMode helps identify potential problems in the application during development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
