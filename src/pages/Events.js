import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { StaggerContainer, StaggerItem } from '../components/AnimatedComponents';
import './Events.css';

const Events = () => {
  const { events: allEvents } = useApp();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFilteredEvents(allEvents);
      setLoading(false);
    }, 1000);
  }, [allEvents]);

  useEffect(() => {
    // Apply initial filters from URL params
    const searchTerm = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';

    if (searchTerm || category || location) {
      handleSearch({ searchTerm, category, location });
    }
  }, [searchParams, allEvents]);

  const handleSearch = ({ searchTerm = '', category = '', location = '' }) => {
    let filtered = allEvents;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (category) {
      filtered = filtered.filter(event =>
        event.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (location) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
    const sorted = [...filteredEvents].sort((a, b) => {
      switch (criteria) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return b.attendees - a.attendees;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    setFilteredEvents(sorted);
  };

  const categories = [...new Set(allEvents.map(event => event.category))];

  if (loading) {
    return (
      <div className="events-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="container">
          <h1>Discover Events</h1>
          <p>Find amazing events happening in your area</p>
        </div>
      </div>

      <div className="container">
        <div className="search-section">
          <SearchBar 
            onSearch={handleSearch}
            categories={categories}
          />
        </div>

        <div className="events-controls">
          <div className="results-info">
            <span>{filteredEvents.length} events found</span>
          </div>
          
          <div className="sort-controls">
            <label htmlFor="sort">Sort by:</label>
            <select 
              id="sort"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date</option>
              <option value="popularity">Popularity</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h3>No events found</h3>
            <p>Try adjusting your search criteria or browse all events</p>
            <button 
              onClick={() => {
                setFilteredEvents(allEvents);
                window.history.pushState({}, '', '/events');
              }}
              className="btn btn-primary"
            >
              Show All Events
            </button>
          </div>
        ) : (
          <StaggerContainer className="events-grid grid grid-cols-3">
            {filteredEvents.map((event, index) => (
              <StaggerItem key={event.id}>
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {filteredEvents.length > 0 && (
          <div className="load-more">
            <button className="btn btn-secondary">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
