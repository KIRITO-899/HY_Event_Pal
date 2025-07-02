/**
 * @fileoverview EventCard component for displaying event information
 * 
 * The EventCard is a comprehensive component that displays event details in a card format.
 * It includes event metadata, actions for event owners, and interactive animations.
 * The component supports different display modes and user permissions.
 * 
 * Features:
 * - Event information display with date, time, location, price
 * - Conditional action buttons for event owners
 * - Animated delete functionality with confirmation
 * - Responsive image handling with fallbacks
 * - Integration with useCardAnimation hook for hover effects
 * - User permission checking for edit/delete actions
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCardAnimation } from '../hooks/useAnimations';
import { gsap } from 'gsap';
import './EventCard.css';

/**
 * EventCard component for displaying event information and actions
 * 
 * @param {Object} props - Component props
 * @param {Object} props.event - Event data object containing all event information
 * @param {boolean} props.showActions - Whether to show action buttons for owners
 * @param {boolean} props.showDelete - Whether to show delete button specifically
 * @returns {JSX.Element} The event card component
 */
const EventCard = ({ event, showActions = false, showDelete = false }) => {
  // App context for user data and event management
  const { deleteEvent, user, isAuthenticated } = useApp();
  
  // Refs for animation targets
  const deleteButtonRef = useRef(null);
  const eventActionsRef = useRef(null);
  
  // Custom hook for card hover animations
  const cardRef = useCardAnimation();

  /**
   * Formats event date into month and day components
   * 
   * @param {string} dateString - ISO date string
   * @returns {Object} Object with month (short name) and day (number)
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  };

  /**
   * Formats event time into readable 12-hour format
   * 
   * @param {string} timeString - Time string in HH:MM format
   * @returns {string} Formatted time with AM/PM
   */
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  /**
   * Handles event deletion with confirmation and animations
   * Includes click feedback, confirmation dialog, and animated removal
   * 
   * @param {Event} e - Click event
   */
  const handleDeleteEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Immediate click feedback animation
    gsap.to(deleteButtonRef.current, {
      scale: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    });
    
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      // Deletion confirmation animation - spinning button
      gsap.to(deleteButtonRef.current, {
        rotation: 360,
        scale: 1.5,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Animate entire card removal with scale and fade
      gsap.to(eventActionsRef.current?.closest('.event-card'), {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.in(1.7)",
        onComplete: () => {
          try {
            // Call delete function from context
            deleteEvent(event.id);
            // Show success feedback
            alert('Event deleted successfully!');
          } catch (error) {
            // Handle deletion errors
            alert('Failed to delete event. Please try again.');
          }
        }
      });
    }
  };

  // Check if current user owns this event for permission-based actions
  const isOwner = isAuthenticated && user && (
    event.organizer === user.name || 
    event.organizerEmail === user.email ||
    (user.eventsCreated && user.eventsCreated.includes(event.id))
  );
  
  // Extract formatted date components
  const { month, day } = formatDate(event.date);

  /**
   * GSAP animations for delete button interactions
   * Sets up entrance, hover, and continuous pulse animations
   */
  useEffect(() => {
    const deleteBtn = deleteButtonRef.current;
    if (!deleteBtn || !showDelete || !isOwner) return;

    // Entrance animation - dramatic spin-in effect
    gsap.fromTo(deleteBtn, 
      {
        scale: 0,
        rotation: -180,
        opacity: 0
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(1.7)"
      }
    );

    // Continuous pulse animation to draw attention
    const pulseAnimation = gsap.to(deleteBtn, {
      scale: 1.1,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });

    /**
     * Mouse enter handler for delete button
     * Pauses pulse and adds hover effects
     */
    const handleMouseEnter = () => {
      pulseAnimation.pause();
      
      // Scale up and rotate for emphasis
      gsap.to(deleteBtn, {
        scale: 1.3,
        rotation: 15,
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Shake animation for danger indication
      gsap.to(deleteBtn, {
        x: "+=2",
        yoyo: true,
        repeat: 5,
        duration: 0.1,
        ease: "power2.inOut"
      });
    };

    /**
     * Mouse leave handler for delete button
     * Returns to default state and resumes pulse
     */
    const handleMouseLeave = () => {
      gsap.to(deleteBtn, {
        scale: 1,
        rotation: 0,
        x: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          pulseAnimation.resume();
        }
      });
    };

    // Add event listeners for hover effects
    deleteBtn.addEventListener('mouseenter', handleMouseEnter);
    deleteBtn.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function to prevent memory leaks
    return () => {
      deleteBtn.removeEventListener('mouseenter', handleMouseEnter);
      deleteBtn.removeEventListener('mouseleave', handleMouseLeave);
      pulseAnimation.kill();
    };
  }, [showDelete, isOwner]); // Re-run when visibility or ownership changes

  return (
    <div ref={cardRef} className="event-card">
      {/* Date Badge */}
      <div className="event-date-badge">
        <span className="month">{month}</span>
        <span className="day">{day}</span>
      </div>

      {/* Event Image */}
      <div className="event-image">
        <img 
          src={event.image || 'https://via.placeholder.com/400x240/FF6B6B/ffffff?text=Event+Image'} 
          alt={event.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x240/FF6B6B/ffffff?text=Event+Image';
          }}
        />
        <div className="event-category-badge">{event.category}</div>
        
        {/* Action buttons for owned events */}
        {(showActions && isOwner) || (showDelete && isOwner) ? (
          <div ref={eventActionsRef} className={`event-actions ${showDelete ? 'always-visible' : ''}`}>
            <button 
              ref={deleteButtonRef}
              onClick={handleDeleteEvent}
              className="action-btn delete-btn"
              title="Delete Event"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ) : null}

      </div>
      
      {/* Event Content */}
      <div className="event-content">
        <div className="event-meta">
          <span className="event-time">
            <i className="fas fa-clock"></i>
            {formatTime(event.time)}
          </span>
          <span className="event-price">
            {event.price === 0 ? (
              <span className="price-free">Free</span>
            ) : (
              <span className="price-paid">${event.price}</span>
            )}
          </span>
        </div>

        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{event.location}</span>
        </div>

        <p className="event-description">{event.description}</p>

        <div className="event-stats">
          <div className="attendees-count">
            <i className="fas fa-users"></i>
            <span>{event.attendees} attending</span>
          </div>
        </div>

        <Link to={`/events/${event.id}`} className="event-link">
          <span>View Details</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
