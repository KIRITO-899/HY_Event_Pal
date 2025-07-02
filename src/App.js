// React core imports
import React, { useEffect } from 'react';
// React Router for navigation and routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context provider for global state management
import { AppProvider } from './context/AppContext';

// Component imports
import Header from './components/Header';
import CursorFollower from './components/CursorFollower';

// Page components
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';

// Utility imports
import { initAllAnimations } from './utils/animations';

// Style imports
import './App.css';
import './themes.css';
import './styles/animations.css';

/**
 * Main App component that serves as the root of the EventPal application
 * Sets up routing, global state management, and initializes animations
 * @returns {JSX.Element} The main application component
 */
function App() {
  // Initialize animations after component mounts
  useEffect(() => {
    // Initialize animations after DOM is loaded
    // Small delay ensures all components are rendered before animations start
    const timer = setTimeout(() => {
      initAllAnimations();
    }, 100);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    // Global state provider wraps the entire app
    <AppProvider>
      {/* Router provides navigation capabilities */}
      <Router>
        <div className="App">
          {/* Custom cursor follower for enhanced UX */}
          <CursorFollower />
          
          {/* Global header with navigation */}
          <Header />
          
          {/* Main content area */}
          <main>
            {/* Route definitions for all pages */}
            <Routes>
              {/* Home page route */}
              <Route path="/" element={<Home />} />
              
              {/* Events listing page */}
              <Route path="/events" element={<Events />} />
              
              {/* Individual event details page with dynamic ID parameter */}
              <Route path="/events/:id" element={<EventDetails />} />
              
              {/* Event creation page */}
              <Route path="/create-event" element={<CreateEvent />} />
              
              {/* User profile page */}
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
