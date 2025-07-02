/**
 * @fileoverview Home page component - the main landing page of EventPal
 * 
 * The Home component serves as the primary entry point for users, featuring a hero section
 * with search functionality, featured/recent events display, category browsing, and 
 * call-to-action sections. It adapts its content based on whether events exist.
 * 
 * Features:
 * - Hero section with animated search bar
 * - Dynamic stats counter showing event count  
 * - Featured events grid with staggered animations
 * - Category browsing cards
 * - Parallax effects for visual depth
 * - Empty state for first-time users
 * - Responsive design with mobile optimizations
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { FadeIn, StaggerContainer, StaggerItem, CounterAnimation, ParallaxElement } from '../components/AnimatedComponents';
import './Home.css';

/**
 * Home component - main landing page for EventPal
 * 
 * @returns {JSX.Element} The home page with hero, events, and navigation sections
 */
const Home = () => {
  // Get events from app context
  const { events } = useApp();
  
  // Local state for featured events display and loading
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Effect to load and set featured events
   * Simulates API loading delay for realistic UX
   */
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      // Show up to 6 most recent events
      setFeaturedEvents(events.slice(0, 6));
      setLoading(false);
    }, 1000);
  }, [events]); // Re-run when events change

  /**
   * Handles search form submission from SearchBar component
   * Redirects to events page with search parameters
   * 
   * @param {Object} searchParams - Search parameters object
   * @param {string} searchParams.searchTerm - Text search term
   * @param {string} searchParams.category - Selected category filter
   * @param {string} searchParams.location - Location filter
   */
  const handleSearch = (searchParams) => {
    // Build URL parameters for events page
    const params = new URLSearchParams();
    if (searchParams.searchTerm) params.append('search', searchParams.searchTerm);
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.location) params.append('location', searchParams.location);
    
    // Navigate to events page with search parameters
    window.location.href = `/events?${params.toString()}`;
  };

  // Extract unique categories from existing events, or use defaults
  const categories = events.length > 0 ? [...new Set(events.map(event => event.category))] : ['Music', 'Sports', 'Technology', 'Food & Drink', 'Arts & Culture', 'Business'];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <FadeIn delay={0.2}>
              <h1 className="hero-title">
                Create & Discover
                <br />
                Amazing Events
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="hero-subtitle">
                Build your community by creating and discovering local events, workshops, and experiences
              </p>
            </FadeIn>
            
            <FadeIn delay={0.6}>
              <div className="hero-search">
                <SearchBar 
                  onSearch={handleSearch}
                  categories={categories}
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="hero-stats">
              <div className="stat">
                <div className="stat-number"><CounterAnimation end={events.length} />+</div>
                <div className="stat-label">Events Created</div>
              </div>
              <div className="stat">
                <div className="stat-number">∞</div>
                <div className="stat-label">Possibilities</div>
              </div>
              <div className="stat">
                <div className="stat-number">🎉</div>
                <div className="stat-label">Your Community</div>
              </div>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>{events.length > 0 ? 'Recent Events' : 'Get Started'}</h2>
            <p>{events.length > 0 ? 'Check out the latest events created by the community' : 'Create your first event and start building your community'}</p>
            {events.length > 0 ? (
              <Link to="/events" className="btn btn-secondary">
                View All Events
                <i className="fas fa-arrow-right"></i>
              </Link>
            ) : (
              <Link to="/create-event" className="btn btn-primary">
                Create Your First Event
                <i className="fas fa-plus"></i>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : events.length > 0 ? (
            <StaggerContainer className="events-grid grid grid-cols-3">
              {featuredEvents.map((event, index) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-calendar-plus"></i>
              </div>
              <h3>No Events Yet</h3>
              <p>Be the first to create an event and start building your community!</p>
              <Link to="/create-event" className="btn btn-primary btn-large">
                <i className="fas fa-plus"></i>
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <ParallaxElement speed={0.3}>
        <section className="categories-section">
          <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Find events that match your interests</p>
          </div>

          <div className="categories-grid">
            {[
              { name: 'Music', icon: 'fa-music', count: '2,500+' },
              { name: 'Sports', icon: 'fa-futbol', count: '1,800+' },
              { name: 'Technology', icon: 'fa-laptop', count: '1,200+' },
              { name: 'Food & Drink', icon: 'fa-utensils', count: '900+' },
              { name: 'Arts & Culture', icon: 'fa-palette', count: '750+' },
              { name: 'Business', icon: 'fa-briefcase', count: '650+' }
            ].map((category, index) => (
              <Link
                key={index}
                to={`/events?category=${category.name}`}
                className="category-card"
              >
                <div className="category-icon">
                  <i className={`fas ${category.icon}`}></i>
                </div>
                <h3>{category.name}</h3>
                <p>{category.count} events</p>
              </Link>
            ))}
          </div>
          </div>
        </section>
      </ParallaxElement>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Your Own Event?</h2>
            <p>Share your passion with the community and bring people together</p>
            <Link to="/create-event" className="btn btn-primary btn-large">
              <i className="fas fa-plus"></i>
              Create Your Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
