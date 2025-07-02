import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { events, user, isAuthenticated, toggleEventAttendance } = useApp();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundEvent = events.find(e => e.id === parseInt(id));
      if (foundEvent) {
        setEvent(foundEvent);
        setIsAttending(user && user.eventsAttending && user.eventsAttending.includes(foundEvent.id));
      }
      setLoading(false);
    }, 500);
  }, [id, events, user]);

  const handleAttendance = () => {
    if (!isAuthenticated) {
      alert('Please sign in to attend events.');
      return;
    }
    
    toggleEventAttendance(event.id);
    setIsAttending(!isAttending);
    setEvent(prev => ({
      ...prev,
      attendees: isAttending ? prev.attendees - 1 : prev.attendees + 1
    }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Event not found</h2>
            <p>The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events" className="btn btn-primary">
              Browse Other Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      {/* Hero Section */}
      <div className="event-hero">
        <div className="event-hero-image">
          <img 
            src={event.image || 'https://via.placeholder.com/1200x600/FF6B6B/ffffff?text=Event+Image'} 
            alt={event.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x600/FF6B6B/ffffff?text=Event+Image';
            }}
          />
          <div className="event-hero-overlay">
            <div className="container">
              <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/events">Events</Link>
                <span>/</span>
                <span>{event.title}</span>
              </div>
              
              <div className="event-hero-content">
                <div className="event-category-badge">{event.category}</div>
                <h1>{event.title}</h1>
                
                <div className="event-meta">
                  <div className="event-date-time">
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-clock"></i>
                      <span>{formatTime(event.time)}</span>
                    </div>
                  </div>
                  
                  <div className="event-location-price">
                    <div className="meta-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{event.location}</span>
                    </div>
                    <div className="event-price-large">
                      {event.price === 0 ? (
                        <span className="free-badge">Free Event</span>
                      ) : (
                        <span className="price-badge">${event.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="event-content">
          <div className="event-main">
            {/* Description */}
            <section className="event-section">
              <h2>About This Event</h2>
              <p className="event-description">{event.description}</p>
            </section>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <section className="event-section">
                <h3>Event Tags</h3>
                <div className="event-tags">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Organizer */}
            <section className="event-section">
              <h3>Organized by</h3>
              <div className="organizer-info">
                <div className="organizer-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="organizer-details">
                  <h4>{event.organizer}</h4>
                  <p>Event Organizer</p>
                </div>
              </div>
            </section>

            {/* Map */}
            <section className="event-section">
              <div className="map-header">
                <h3>Location</h3>
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className="btn btn-secondary btn-small"
                >
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
              
              <div className="location-info">
                <i className="fas fa-map-marker-alt"></i>
                <span>{event.location}</span>
              </div>

              {showMap && (
                <div className="map-placeholder">
                  <i className="fas fa-map"></i>
                  <p>Interactive map would be displayed here</p>
                  <small>Integration with Google Maps or similar service</small>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="event-sidebar">
            <div className="sidebar-card">
              <div className="attendance-info">
                <div className="attendee-count">
                  <i className="fas fa-users"></i>
                  <span>{event.attendees} people attending</span>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={handleAttendance}
                  className={`btn ${isAttending ? 'btn-secondary' : 'btn-primary'} btn-large`}
                >
                  <i className={`fas ${isAttending ? 'fa-check' : 'fa-plus'}`}></i>
                  {isAttending ? 'Attending' : 'Attend Event'}
                </button>

                <button 
                  onClick={handleShare}
                  className="btn btn-secondary btn-large"
                >
                  <i className="fas fa-share"></i>
                  Share Event
                </button>
              </div>

              <div className="event-details-quick">
                <div className="quick-detail">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(event.date)}</span>
                </div>
                <div className="quick-detail">
                  <span className="label">Time:</span>
                  <span className="value">{formatTime(event.time)}</span>
                </div>
                <div className="quick-detail">
                  <span className="label">Price:</span>
                  <span className="value">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </span>
                </div>
                <div className="quick-detail">
                  <span className="label">Category:</span>
                  <span className="value">{event.category}</span>
                </div>
              </div>
            </div>

            {/* Related Events */}
            <div className="sidebar-card">
              <h3>Similar Events</h3>
              <div className="related-events">
                {events
                  .filter(e => e.category === event.category && e.id !== event.id)
                  .slice(0, 3)
                  .map(relatedEvent => (
                    <Link 
                      key={relatedEvent.id} 
                      to={`/events/${relatedEvent.id}`}
                      className="related-event"
                    >
                      <img 
                        src={relatedEvent.image || 'https://via.placeholder.com/80x60/FF6B6B/ffffff?text=Event'} 
                        alt={relatedEvent.title}
                      />
                      <div className="related-event-info">
                        <h4>{relatedEvent.title}</h4>
                        <p>{formatDate(relatedEvent.date)}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
