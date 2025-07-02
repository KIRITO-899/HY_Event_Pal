/**
 * @fileoverview Authentication modal component for user login and registration
 * 
 * The AuthModal provides a comprehensive authentication interface with tabbed
 * login and registration forms. It includes form validation, loading states,
 * error handling, and smooth animations for enhanced user experience.
 * 
 * Features:
 * - Tabbed interface for login/registration switching
 * - Real-time form validation with error display
 * - Loading states with visual feedback
 * - Animated form interactions using custom hooks
 * - Overlay click-to-close functionality
 * - Integration with AppContext for authentication
 * - Responsive design with accessibility support
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useButtonAnimation } from '../hooks/useAnimations';
import './AuthModal.css';

/**
 * AuthModal component for user authentication
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is currently open
 * @param {Function} props.onClose - Callback function to close the modal
 * @returns {JSX.Element|null} The authentication modal or null if not open
 */
const AuthModal = ({ isOpen, onClose }) => {
  // App context for authentication functions
  const { login, register } = useApp();
  
  // Form state management
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login/register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});       // Form validation errors
  const [isLoading, setIsLoading] = useState(false); // Submission loading state

  // Animation refs for interactive elements
  const signInTabRef = useButtonAnimation('tab');
  const signUpTabRef = useButtonAnimation('tab');
  const submitButtonRef = useButtonAnimation('primary');

  /**
   * Handles input field changes and clears related errors
   * 
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data with new value
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validates form data based on current mode (login/register)
   * 
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation (only for registration)
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission for login or registration
   * Includes validation, loading states, and error handling
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isLogin) {
        // Login existing user with email and password
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register new user with full details
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      // Close modal on successful authentication
      onClose();
      
      // Reset form state for next use
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
      
    } catch (error) {
      // Display authentication errors to user
      setErrors({ general: error.message || 'Authentication failed. Please try again.' });
    } finally {
      // Always clear loading state
      setIsLoading(false);
    }
  };

  /**
   * Handles clicks on the modal overlay to close the modal
   * Only closes if clicking directly on overlay, not modal content
   * 
   * @param {Event} e - Click event
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Welcome Back!' : 'Join EventPal'}</h2>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="auth-tabs">
          <button 
            ref={signInTabRef}
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setErrors({});
            }}
          >
            Sign In
          </button>
          <button 
            ref={signUpTabRef}
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setErrors({});
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button ref={submitButtonRef} type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner-small"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="auth-switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>


      </div>
    </div>
  );
};

export default AuthModal;
