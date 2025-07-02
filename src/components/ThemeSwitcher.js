/**
 * @fileoverview Theme switcher component for light/dark mode toggle
 * 
 * The ThemeSwitcher provides a visual toggle button that allows users to switch
 * between light and dark themes. It features a sliding track design with animated
 * icons that change based on the current theme state.
 * 
 * Features:
 * - Toggle button with track and thumb design
 * - Dynamic icons (sun for light, moon for dark)
 * - Accessibility support with descriptive title
 * - Integrates with AppContext theme management
 * - CSS transitions for smooth visual feedback
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import './ThemeSwitcher.css';

/**
 * ThemeSwitcher component that renders a toggle button for theme switching
 * Uses a track and thumb design similar to iOS switches
 * 
 * @returns {JSX.Element} The theme switcher button
 */
const ThemeSwitcher = () => {
  // Get current theme and toggle function from app context
  const { theme, toggleTheme } = useApp();

  return (
    <button 
      className="theme-switcher"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Track container - provides the sliding background */}
      <div className="theme-switcher-track">
        {/* Thumb - the sliding indicator with icon */}
        <div className="theme-switcher-thumb">
          {/* Dynamic icon based on current theme */}
          <i className={`fas ${theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
        </div>
      </div>
    </button>
  );
};

export default ThemeSwitcher;
