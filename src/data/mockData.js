/**
 * Mock data file for the EventPal application
 * Contains default data structures for events and users
 * Used for development and initial app state
 */

/**
 * Mock events array - initially empty
 * Users will create their own events through the application
 * @type {Array} Empty array to be populated with user-created events
 */
export const mockEvents = [];

/**
 * Default demo user object
 * Provides a template for user data structure
 * Will be populated with real user data on login/registration
 * @type {Object} User object with default properties
 */
export const mockUser = {
  id: 1, // Unique user identifier
  name: "Demo User", // Display name
  email: "demo@eventpal.com", // User email address
  avatar: "https://ui-avatars.com/api/?name=Demo+User&background=667eea&color=fff&size=150", // Generated avatar URL
  eventsAttending: [], // Array of event IDs the user is attending
  eventsCreated: [] // Array of event IDs the user has created
};
