/**
 * @fileoverview Header component for the EventPal application
 * 
 * The Header component serves as the main navigation bar for the application,
 * providing access to all major sections and user authentication features.
 * It includes responsive design, animated elements, and conditional rendering
 * based on authentication state.
 * 
 * Features:
 * - Responsive navigation with mobile menu
 * - User authentication state handling
 * - Theme switching integration
 * - Animated logo and buttons
 * - Active route highlighting
 * - User avatar with fallback
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useButtonAnimation, useEntranceAnimation } from '../hooks/useAnimations';
import ThemeSwitcher from './ThemeSwitcher';
import AuthModal from './AuthModal';
import './Header.css';

const Header = () => {
  // State for mobile menu toggle and authentication modal
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // React Router hook for current location
  const location = useLocation();
  
  // App context for user data and authentication
  const { user, isAuthenticated, logout } = useApp();
  
  // Animation refs for smooth entrance and interaction effects
  const logoRef = useEntranceAnimation('bounceIn', 0.2); // Logo bounces in on load
  const signInButtonRef = useButtonAnimation('default');  // Standard button animations
  const createEventButtonRef = useButtonAnimation('primary'); // Enhanced primary button
  const logoutButtonRef = useButtonAnimation('default');

  /**
   * Utility function to check if current path matches given path
   * Used for highlighting active navigation links
   * 
   * @param {string} path - The path to check against current location
   * @returns {boolean} True if path matches current location
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Handles user logout with cleanup
   * Closes mobile menu and calls logout from context
   */
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close mobile menu after logout
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link ref={logoRef} to="/" className="logo">
            <i className="fas fa-calendar-alt"></i>
            <span>EventPal</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className={`nav-link ${isActive('/events') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Discover Events
            </Link>
            <Link 
              to="/create-event" 
              className={`nav-link ${isActive('/create-event') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Create Event
            </Link>
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}
          </nav>

          <div className="header-actions">
            <ThemeSwitcher />
            
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-avatar">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=FF6B6B&color=fff&size=40`;
                    }}
                  />
                </div>
                <span className="user-name">{user?.name}</span>
                <button ref={logoutButtonRef} onClick={handleLogout} className="btn btn-secondary btn-small">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            ) : (
              <button 
                ref={signInButtonRef}
                onClick={() => setIsAuthModalOpen(true)}
                className="btn btn-secondary"
              >
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </button>
            )}
            
            <Link ref={createEventButtonRef} to="/create-event" className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Create Event
            </Link>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;
