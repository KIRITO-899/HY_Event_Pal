import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useButtonAnimation } from '../hooks/useAnimations';
import EventCard from '../components/EventCard';
import './Profile.css';

const Profile = () => {
  const { user: contextUser, events, isAuthenticated, setUser } = useApp();
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('attending');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });

  // Animation refs
  const attendingTabRef = useButtonAnimation('tab');
  const createdTabRef = useButtonAnimation('tab');
  const editButtonRef = useButtonAnimation('default');
  const saveButtonRef = useButtonAnimation('primary');
  const cancelButtonRef = useButtonAnimation('default');

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated || !contextUser) {
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setEditForm({
        name: contextUser.name,
        email: contextUser.email
      });
      
      // Filter events user is attending
      const attending = events.filter(event => 
        contextUser.eventsAttending && contextUser.eventsAttending.includes(event.id)
      );
      setAttendingEvents(attending);
      
      // Filter events user created (check organizer email for better accuracy)
      const created = events.filter(event => 
      event.organizerEmail === contextUser.email || 
      event.organizer === contextUser.name ||
        (contextUser.eventsCreated && contextUser.eventsCreated.includes(event.id))
              );
      setCreatedEvents(created);
      
      setLoading(false);
    }, 500);
  }, [contextUser, events, isAuthenticated]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Update user through context
    const updatedUser = {
      ...contextUser,
      name: editForm.name,
      email: editForm.email
    };
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !contextUser) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-user-slash"></i>
            </div>
            <h3>Sign In Required</h3>
            <p>Please sign in to view your profile and manage your events.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-hero">
            <div className="profile-avatar">
              <img 
                src={contextUser.avatar} 
                alt={contextUser.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x150/FF6B6B/ffffff?text=' + contextUser.name.charAt(0);
                }}
              />
            </div>
            
            <div className="profile-info">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="edit-input"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="edit-input"
                    required
                  />
                  <div className="edit-actions">
                    <button ref={saveButtonRef} type="submit" className="btn btn-primary btn-small">
                      <i className="fas fa-check"></i>
                      Save
                    </button>
                    <button 
                      ref={cancelButtonRef}
                      type="button" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          name: contextUser.name,
                          email: contextUser.email
                        });
                      }}
                      className="btn btn-secondary btn-small"
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1>{contextUser.name}</h1>
                  <p>{contextUser.email}</p>
                  <button 
                    ref={editButtonRef}
                    onClick={() => setIsEditing(true)}
                    className="btn btn-secondary btn-small"
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-number">{attendingEvents.length}</div>
              <div className="stat-label">Events Attending</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{createdEvents.length}</div>
              <div className="stat-label">Events Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {attendingEvents.reduce((total, event) => total + event.attendees, 0)}
              </div>
              <div className="stat-label">Total Connections</div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Tabs Navigation */}
          <div className="tabs-nav">
            <button 
              ref={attendingTabRef}
              className={`tab-btn ${activeTab === 'attending' ? 'active' : ''}`}
              onClick={() => setActiveTab('attending')}
            >
              <i className="fas fa-calendar-check"></i>
              Attending ({attendingEvents.length})
            </button>
            <button 
              ref={createdTabRef}
              className={`tab-btn ${activeTab === 'created' ? 'active' : ''}`}
              onClick={() => setActiveTab('created')}
            >
              <i className="fas fa-plus-circle"></i>
              Created ({createdEvents.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'attending' && (
              <div className="events-section">
                <div className="section-header">
                  <h2>Events You're Attending</h2>
                  <p>Stay up to date with your upcoming events</p>
                </div>
                
                {attendingEvents.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="fas fa-calendar-times"></i>
                    </div>
                    <h3>No Events Yet</h3>
                    <p>You haven't joined any events yet. Discover amazing events in your area!</p>
                    <Link to="/events" className="btn btn-primary">
                      <i className="fas fa-search"></i>
                      Discover Events
                    </Link>
                  </div>
                ) : (
                  <div className="events-grid grid grid-cols-3">
                    {attendingEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'created' && (
              <div className="events-section">
                <div className="section-header">
                  <h2>Events You've Created</h2>
                  <p>Manage and track your event creations</p>
                  <Link to="/create-event" className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    Create New Event
                  </Link>
                </div>
                
                {createdEvents.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="fas fa-plus-circle"></i>
                    </div>
                    <h3>No Events Created</h3>
                    <p>You haven't created any events yet. Share your passion with the community!</p>
                    <Link to="/create-event" className="btn btn-primary">
                      <i className="fas fa-plus"></i>
                      Create Your First Event
                    </Link>
                  </div>
                ) : (
                  <div className="events-grid grid grid-cols-3">
                    {createdEvents.map(event => (
                      <EventCard key={event.id} event={event} showActions={true} showDelete={true} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/create-event" className="action-card">
              <div className="action-icon">
                <i className="fas fa-plus"></i>
              </div>
              <h4>Create Event</h4>
              <p>Share your event with the community</p>
            </Link>
            
            <Link to="/events" className="action-card">
              <div className="action-icon">
                <i className="fas fa-search"></i>
              </div>
              <h4>Discover Events</h4>
              <p>Find amazing events near you</p>
            </Link>
            
            <button className="action-card" onClick={() => navigator.share?.({
              title: 'EventPal Profile',
              text: `Check out ${contextUser.name}'s profile on EventPal!`,
              url: window.location.href
            })}>
              <div className="action-icon">
                <i className="fas fa-share"></i>
              </div>
              <h4>Share Profile</h4>
              <p>Let others know about your events</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
