/**
 * @fileoverview SearchBar component for event discovery and filtering
 * 
 * The SearchBar provides a comprehensive search interface for events, featuring
 * a main search input with expandable filters. Users can search by keywords,
 * filter by category and location, and manage their search criteria.
 * 
 * Features:
 * - Text-based event search with real-time input
 * - Expandable filter panel with category and location options
 * - Form submission handling with validation
 * - Clear all filters functionality
 * - Responsive design with collapsible filters
 * - Integration with parent components via callbacks
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import './SearchBar.css';

/**
 * SearchBar component for event search and filtering
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback function called when search is submitted
 * @param {Function} props.onFilterChange - Callback function called when filters change
 * @param {Array<string>} props.categories - Array of available event categories
 * @returns {JSX.Element} The search bar with filters
 */
const SearchBar = ({ onSearch, onFilterChange, categories = [] }) => {
  // Search and filter state management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Handles search form submission
   * Prevents default form submission and calls parent onSearch callback
   * 
   * @param {Event} e - Form submission event
   */
  const handleSearch = (e) => {
    e.preventDefault();
    // Pass all search criteria to parent component
    onSearch({
      searchTerm,
      category: selectedCategory,
      location: selectedLocation
    });
  };

  /**
   * Handles filter changes and notifies parent component
   * Called when category or location filters are modified
   * 
   * @param {Object} filters - Updated filter values
   */
  const handleFilterChange = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  return (
    <div className="search-container">
      {/* Main search form with text input and filter toggle */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-bar">
          {/* Search icon */}
          <i className="fas fa-search search-icon"></i>
          
          {/* Main search input field */}
          <input
            type="text"
            placeholder="Search events by name, description, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          {/* Submit button */}
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Toggle button for expandable filters */}
        <button
          type="button"
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="filters-panel"
        >
          <i className="fas fa-filter"></i>
          Filters
          <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}></i>
        </button>
      </form>

      {/* Expandable filters panel */}
      {showFilters && (
        <div id="filters-panel" className="filters-panel">
          <div className="filters-grid">
            {/* Category filter dropdown */}
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  // Immediately notify parent of filter change
                  handleFilterChange({ category: e.target.value, location: selectedLocation });
                }}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location filter input */}
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                placeholder="Enter city or venue"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  // Immediately notify parent of filter change
                  handleFilterChange({ category: selectedCategory, location: e.target.value });
                }}
                className="filter-input"
              />
            </div>

            {/* Filter action buttons */}
            <div className="filter-actions">
              <button
                type="button"
                onClick={() => {
                  // Clear all search and filter states
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                  // Notify parent to clear search results
                  onSearch({ searchTerm: '', category: '', location: '' });
                }}
                className="btn btn-secondary"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
