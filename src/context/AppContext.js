import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import { mockUser } from '../data/mockData'; // No longer needed

// Initial state
const initialState = {
  events: [],
  user: null,
  theme: 'light',
  isAuthenticated: false,
  loading: false,
  searchFilters: {
    searchTerm: '',
    category: '',
    location: ''
  }
};

// Action types
export const ActionTypes = {
  SET_EVENTS: 'SET_EVENTS',
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  SET_USER: 'SET_USER',
  SET_THEME: 'SET_THEME',
  SET_AUTHENTICATION: 'SET_AUTHENTICATION',
  SET_LOADING: 'SET_LOADING',
  SET_SEARCH_FILTERS: 'SET_SEARCH_FILTERS',
  TOGGLE_EVENT_ATTENDANCE: 'TOGGLE_EVENT_ATTENDANCE',
  REGISTER_USER: 'REGISTER_USER'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_EVENTS:
      return {
        ...state,
        events: action.payload
      };
      
    case ActionTypes.ADD_EVENT:
      const newEvents = [...state.events, action.payload];
      localStorage.setItem('eventpal_events', JSON.stringify(newEvents));
      return {
        ...state,
        events: newEvents
      };
      
    case ActionTypes.UPDATE_EVENT:
      const updatedEvents = state.events.map(event =>
        event.id === action.payload.id ? action.payload : event
      );
      localStorage.setItem('eventpal_events', JSON.stringify(updatedEvents));
      return {
        ...state,
        events: updatedEvents
      };
      
    case ActionTypes.DELETE_EVENT:
      const filteredEvents = state.events.filter(event => event.id !== action.payload);
      localStorage.setItem('eventpal_events', JSON.stringify(filteredEvents));
      return {
        ...state,
        events: filteredEvents
      };
      
    case ActionTypes.SET_USER:
      if (action.payload) {
        localStorage.setItem('eventpal_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('eventpal_user');
      }
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };
      
    case ActionTypes.SET_THEME:
      localStorage.setItem('eventpal_theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
      return {
        ...state,
        theme: action.payload
      };
      
    case ActionTypes.SET_AUTHENTICATION:
      return {
        ...state,
        isAuthenticated: action.payload
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ActionTypes.SET_SEARCH_FILTERS:
      return {
        ...state,
        searchFilters: { ...state.searchFilters, ...action.payload }
      };
      
    case ActionTypes.TOGGLE_EVENT_ATTENDANCE:
      const eventId = action.payload;
      const updatedUser = {
        ...state.user,
        eventsAttending: state.user.eventsAttending.includes(eventId)
          ? state.user.eventsAttending.filter(id => id !== eventId)
          : [...state.user.eventsAttending, eventId]
      };
      localStorage.setItem('eventpal_user', JSON.stringify(updatedUser));
      
      const eventsWithUpdatedAttendance = state.events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: state.user.eventsAttending.includes(eventId)
              ? event.attendees - 1
              : event.attendees + 1
          };
        }
        return event;
      });
      localStorage.setItem('eventpal_events', JSON.stringify(eventsWithUpdatedAttendance));
      
      return {
        ...state,
        user: updatedUser,
        events: eventsWithUpdatedAttendance
      };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on app start
  useEffect(() => {
    const loadData = () => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      // Load theme
      const savedTheme = localStorage.getItem('eventpal_theme') || 'light';
      dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme });
      
      // Load user
      const savedUser = localStorage.getItem('eventpal_user');
      if (savedUser) {
        dispatch({ type: ActionTypes.SET_USER, payload: JSON.parse(savedUser) });
      }
      
      // Load events
      const savedEvents = localStorage.getItem('eventpal_events');
      if (savedEvents) {
        dispatch({ type: ActionTypes.SET_EVENTS, payload: JSON.parse(savedEvents) });
      } else {
        // Initialize with empty events array
        dispatch({ type: ActionTypes.SET_EVENTS, payload: [] });
        localStorage.setItem('eventpal_events', JSON.stringify([]));
      }
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    };

    loadData();
  }, []);

  // Action creators
  const actions = {
    addEvent: (event) => {
      if (!state.user) {
        throw new Error('You must be signed in to create events.');
      }
      
      const newEvent = {
        ...event,
        id: Date.now(), // This will be a number for routing
        attendees: 0,
        organizer: state.user.name,
        organizerEmail: state.user.email,
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: ActionTypes.ADD_EVENT, payload: newEvent });
      
      // Update user's created events list
      const updatedUser = {
        ...state.user,
        eventsCreated: [...(state.user.eventsCreated || []), newEvent.id]
      };
      dispatch({ type: ActionTypes.SET_USER, payload: updatedUser });
      
      return newEvent;
    },
    
    updateEvent: (event) => {
      dispatch({ type: ActionTypes.UPDATE_EVENT, payload: event });
    },
    
    deleteEvent: (eventId) => {
      // Only allow deleting if user is the owner
      const event = state.events.find(e => e.id === eventId);
      if (!event || !state.user) {
        throw new Error('You do not have permission to delete this event.');
      }
      
      if (event.organizerEmail !== state.user.email && event.organizer !== state.user.name) {
        throw new Error('You can only delete events that you created.');
      }
      
      dispatch({ type: ActionTypes.DELETE_EVENT, payload: eventId });
      
      // Update user's created events list
      if (state.user.eventsCreated) {
        const updatedUser = {
          ...state.user,
          eventsCreated: state.user.eventsCreated.filter(id => id !== eventId)
        };
        dispatch({ type: ActionTypes.SET_USER, payload: updatedUser });
      }
    },
    
    setUser: (user) => {
      dispatch({ type: ActionTypes.SET_USER, payload: user });
    },
    
    register: (userData) => {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('eventpal_users') || '[]');
      const emailExists = existingUsers.find(u => u.email === userData.email);
      
      if (emailExists) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=FF6B6B&color=fff&size=150`,
        eventsAttending: [],
        eventsCreated: [],
        createdAt: new Date().toISOString()
      };
      
      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('eventpal_users', JSON.stringify(existingUsers));
      
      // Set as current user
      const userForSession = { ...newUser };
      delete userForSession.password; // Don't store password in session
      dispatch({ type: ActionTypes.SET_USER, payload: userForSession });
      
      return userForSession;
    },

    login: (credentials) => {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('eventpal_users') || '[]');
      const user = existingUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      
      // Set as current user (without password)
      const userForSession = { ...user };
      delete userForSession.password;
      dispatch({ type: ActionTypes.SET_USER, payload: userForSession });
      
      return userForSession;
    },
    
    logout: () => {
      dispatch({ type: ActionTypes.SET_USER, payload: null });
    },
    
    toggleTheme: () => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      dispatch({ type: ActionTypes.SET_THEME, payload: newTheme });
    },
    
    setTheme: (theme) => {
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    },
    
    setSearchFilters: (filters) => {
      dispatch({ type: ActionTypes.SET_SEARCH_FILTERS, payload: filters });
    },
    
    toggleEventAttendance: (eventId) => {
      if (state.user) {
        dispatch({ type: ActionTypes.TOGGLE_EVENT_ATTENDANCE, payload: eventId });
      }
    },
    
    getFilteredEvents: () => {
      const { searchTerm, category, location } = state.searchFilters;
      let filtered = state.events;

      if (searchTerm) {
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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

      return filtered;
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
