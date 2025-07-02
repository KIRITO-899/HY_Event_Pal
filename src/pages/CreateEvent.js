import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useButtonAnimation } from '../hooks/useAnimations';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedComponents';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent, isAuthenticated } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: '',
    image: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation refs
  const cancelButtonRef = useButtonAnimation('default');
  const createButtonRef = useButtonAnimation('primary');

  const categories = [
    'Music',
    'Sports',
    'Technology',
    'Food & Drink',
    'Arts & Culture',
    'Business',
    'Education',
    'Health & Wellness',
    'Community',
    'Entertainment'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.price && (isNaN(formData.price) || formData.price < 0)) {
      newErrors.price = 'Price must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated) {
      alert('Please sign in to create an event.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new event object
      const eventData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: formData.image || `https://via.placeholder.com/400x240/FF6B6B/ffffff?text=Event+Image`
      };

      // Add event using context
      const newEvent = addEvent(eventData);
      
      console.log('New event created:', newEvent);
      
      // Show success message
      alert('Event created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        price: '',
        image: '',
        tags: ''
      });
      
      // Redirect to the new event details page
      navigate(`/events/${newEvent.id}`);
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FadeIn className="create-event-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Event</h1>
          <p>Share your event with the community and bring people together</p>
        </div>

        <StaggerContainer>
          <form onSubmit={handleSubmit} className="create-event-form">
            <div className="form-grid">
            {/* Basic Information */}
            <StaggerItem>
              <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="title">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a catchy title for your event"
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event in detail. What can attendees expect?"
                  rows={6}
                  className={errors.description ? 'error' : ''}
                />
                <div className="character-count">
                  {formData.description.length} characters
                </div>
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>
            </StaggerItem>

            {/* Date & Time */}
            <StaggerItem>
              <div className="form-section">
              <h2>Date & Time</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.date ? 'error' : ''}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={errors.time ? 'error' : ''}
                  />
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>
              </div>
            </div>
            </StaggerItem>

            {/* Location */}
            <StaggerItem>
              <div className="form-section">
                <h2>Location</h2>
                
                <div className="form-group">
                  <label htmlFor="location">
                    Venue Address *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter full address or venue name"
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>
              </div>
            </StaggerItem>

            {/* Additional Details */}
            <StaggerItem>
              <div className="form-section">
              <h2>Additional Details</h2>
              
              <div className="form-group">
                <label htmlFor="price">
                  Ticket Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={errors.price ? 'error' : ''}
                />
                <small>Leave empty or enter 0 for free events</small>
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="image">
                  Event Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                <small>Add a link to an image that represents your event</small>
              </div>

              <div className="form-group">
                <label htmlFor="tags">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="outdoor, family-friendly, music (separate with commas)"
                />
                <small>Add tags to help people discover your event</small>
              </div>
            </div>
            </StaggerItem>
          </div>

          {/* Preview Section */}
          {formData.title && formData.description && (
            <StaggerItem>
              <div className="form-section">
                <h2>Preview</h2>
                <div className="event-preview">
                  <div className="preview-header">
                    <div className="preview-category">{formData.category || 'Category'}</div>
                    <h3>{formData.title}</h3>
                    <p>{formData.description}</p>
                  </div>
                  <div className="preview-details">
                    <div className="preview-detail">
                      <i className="fas fa-calendar"></i>
                      <span>{formData.date || 'Date not set'}</span>
                    </div>
                    <div className="preview-detail">
                      <i className="fas fa-clock"></i>
                      <span>{formData.time || 'Time not set'}</span>
                    </div>
                    <div className="preview-detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{formData.location || 'Location not set'}</span>
                    </div>
                    <div className="preview-detail">
                      <i className="fas fa-dollar-sign"></i>
                      <span>{formData.price ? `$${formData.price}` : 'Free'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          )}

          {/* Submit Button */}
          <StaggerItem>
            <div className="form-actions">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => navigate('/events')}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                ref={createButtonRef}
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-small"></div>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Create Event
                  </>
                )}
              </button>
            </div>
          </StaggerItem>
        </form>
        </StaggerContainer>
      </div>
    </FadeIn>
  );
};

export default CreateEvent;
