# EventPal 🎉

> **A modern React-based platform for discovering, creating, and managing community events**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.13.0-green.svg)](https://greensock.com/gsap/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.18.0-purple.svg)](https://www.framer.com/motion/)

**EventPal** is a feature-rich community event management platform built with professional animations, secure authentication, and a focus on exceptional user experience. Create, discover, and attend events with ease.

---

## ✨ Key Features

### 🔐 **Authentication & Security**

- Secure user registration and login system
- Email validation with duplicate account prevention
- Session management with localStorage persistence
- Ownership-based event access control

### 📅 **Event Management**

- **Create Events**: Full-featured event creation with categories, pricing, and details
- **Discover Events**: Advanced search with real-time filtering and sorting
- **Attend Events**: Track attendance and manage your event participation
- **Ownership Control**: Users can only edit/delete their own events

### 👤 **User Profiles**

- Personal dashboard with event statistics
- Track created events and attendance history
- Profile editing with instant updates
- Quick action shortcuts for event management

### 🎨 **Premium UI/UX**

- **Professional Animations**: GSAP-powered smooth interactions
- **Custom Cursor**: Desktop cursor that responds to interactive elements
- **Modern Design**: Coral/teal gradient theme with consistent styling
- **Fully Responsive**: Optimized for desktop, tablet, and mobile
- **Micro-interactions**: Hover effects, loading states, and smooth transitions

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd eventpal

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000 in your browser
```

### Available Scripts

- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

---

## 🛠️ Tech Stack

| Technology        | Version | Purpose                   |
| ----------------- | ------- | ------------------------- |
| **React**         | 18.2.0  | Frontend framework        |
| **React Router**  | 6.8.1   | Navigation and routing    |
| **GSAP**          | 3.13.0  | Professional animations   |
| **Framer Motion** | 10.18.0 | Component animations      |
| **Font Awesome**  | Latest  | Icon library              |
| **CSS3**          | -       | Custom styling and themes |

---

## 📱 Application Structure

### Core Pages

- **🏠 Home** (`/`) - Landing page with featured events and statistics
- **📅 Events** (`/events`) - Event discovery with search and filters
- **📋 Event Details** (`/events/:id`) - Comprehensive event information
- **➕ Create Event** (`/create-event`) - Event creation form
- **👤 Profile** (`/profile`) - User dashboard and event management

### Key Components

- **AppProvider** - Global state management with Context API
- **Header** - Responsive navigation with authentication
- **EventCard** - Reusable event display component
- **SearchBar** - Advanced search with real-time filtering
- **AuthModal** - User authentication system
- **CursorFollower** - Professional custom cursor animation

---

## 🎯 Features in Detail

### Advanced Search & Filtering

- **Real-time Search**: Instant results as you type
- **Category Filters**: Filter by event categories
- **Location Search**: Find events by location
- **Sort Options**: Date, popularity, price, or alphabetical
- **URL Parameters**: Shareable search results

### Professional Animations

- **GSAP Integration**: Smooth cursor following and hover effects
- **Scroll Animations**: Parallax effects and scroll triggers
- **Counter Animations**: Animated statistics display
- **Loading States**: Elegant spinners and skeleton screens
- **Micro-interactions**: Button hovers and form feedback

### Responsive Design

- **Mobile-First**: Progressive enhancement approach
- **Flexible Grids**: Adaptive layouts for all screen sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Cross-Browser**: Compatible with modern browsers

---

## 🔒 Security & Data

### Authentication Security

- Email format validation
- Password requirements (minimum 6 characters)
- No duplicate accounts per email
- Secure session management

### Data Protection

- User ownership validation for events
- Authentication gates for sensitive actions
- Input sanitization and validation
- Graceful error handling with boundaries

### Data Persistence

- **localStorage** for user sessions and events
- **No backend required** - fully client-side
- **Reliable data** - automatic persistence across sessions

---

## 🎨 Design System

### Color Palette

- **Primary**: Coral (#FF6B6B)
- **Secondary**: Teal (#4ECDC4)
- **Accent**: Sky Blue (#45B7D1)
- **Success**: Mint Green (#96CEB4)

### Typography & Spacing

- Clean, readable font hierarchy
- Consistent spacing system
- Modern card designs with shadows
- Accessible color contrasts

---

## 📖 Usage Guide

### For Event Organizers

1. **Sign Up** - Create your account
2. **Create Event** - Fill out the detailed event form
3. **Manage Events** - Edit or delete from your profile
4. **Track Attendance** - Monitor who's attending your events

### For Event Attendees

1. **Browse Events** - Explore available events
2. **Search & Filter** - Find events that interest you
3. **View Details** - Get comprehensive event information
4. **Attend Events** - Track your event participation

---

## 🚧 Development Status

### ✅ Completed Features

- ✅ Complete authentication system
- ✅ Event CRUD operations
- ✅ Advanced search and filtering
- ✅ Professional animations
- ✅ Responsive design
- ✅ User profile management
- ✅ Data persistence

### 🔄 Future Enhancements

- 📧 Email notifications
- 🗺️ Interactive maps integration
- 📸 Image upload functionality
- 💳 Payment processing
- 📱 PWA capabilities
- 🌐 Multi-language support

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add comments for complex functionality
- Test your changes across different screen sizes
- Ensure animations are smooth and performant

## 🙏 Acknowledgments

- **GSAP** - For professional animation capabilities
- **React Community** - For excellent documentation and support
- **Framer Motion** - For smooth React animations
- **Font Awesome** - For comprehensive icon library
- **Create React App** - For quick project setup

---

<div align="center">

**EventPal** - _Bringing communities together through amazing events!_ 🎉

Built with ❤️ using React, GSAP, and modern web technologies

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>
