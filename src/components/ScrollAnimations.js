/**
 * @fileoverview Scroll-based animation components and hooks for EventPal
 * 
 * This module provides scroll-triggered animations, floating effects, text animations,
 * and magnetic hover interactions. Built with Framer Motion for smooth performance
 * and React hooks for easy integration with components.
 * 
 * Features:
 * - Scroll-triggered parallax and fade animations
 * - Floating card animations with continuous motion
 * - Staggered text reveal animations
 * - Magnetic button hover effects
 * - Easy-to-use hooks and component wrappers
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * Custom hook for scroll-triggered animations and parallax effects
 * Handles parallax for hero sections and fade-in animations for scroll elements
 * 
 * @returns {Object} Framer Motion animation controls
 */
export const useScrollAnimation = () => {
  const controls = useAnimation();

  useEffect(() => {
    /**
     * Handles scroll events for parallax and fade-in animations
     * Optimized for performance with direct DOM manipulation
     */
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.5; // Parallax speed multiplier
      
      // Apply parallax effect to hero sections
      // Creates subtle background movement for depth
      const heroElements = document.querySelectorAll('.hero-section');
      heroElements.forEach(el => {
        if (el) {
          el.style.transform = `translateY(${rate}px)`;
        }
      });

      // Trigger fade-in animations when elements come into view
      const animateElements = document.querySelectorAll('.scroll-animate');
      animateElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150; // Trigger distance from bottom of viewport
        
        // Add animated class when element is visible
        if (elementTop < window.innerHeight - elementVisible) {
          el.classList.add('animated');
        }
      });
    };

    // Add scroll listener with cleanup
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array - run once on mount

  return controls;
};

/**
 * FloatingCard component with continuous floating animation
 * Creates a subtle up-and-down motion for cards and elements
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {number} props.delay - Animation start delay in seconds
 * @param {Object} props...props - Additional props passed to motion.div
 * @returns {JSX.Element} Animated floating container
 */
export const FloatingCard = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ 
      y: [20, 0, -5, 0], // Floating motion path
      opacity: 1 
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,        // Continuous animation
      repeatType: "reverse",   // Smooth back-and-forth motion
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * StaggeredText component for letter-by-letter text reveal
 * Animates each character individually for dramatic text entrances
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Text content to animate
 * @param {string} props.className - CSS class for styling
 * @param {number} props.delay - Base delay before animation starts
 * @returns {JSX.Element} Animated text with staggered letters
 */
export const StaggeredText = ({ text, className = "", delay = 0 }) => {
  // Split text into individual characters for animation
  const letters = text.split('');
  
  return (
    <motion.div className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.05, // Stagger each letter by 50ms
            ease: "easeOut"
          }}
          style={{ display: 'inline-block' }}
        >
          {/* Use non-breaking space for actual spaces */}
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

/**
 * MagneticButton component with magnetic hover effect
 * Creates a subtle pull effect where the button follows the cursor
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {number} props.strength - Magnetic effect strength (0-1, default: 0.3)
 * @param {Object} props...props - Additional props passed to motion.div
 * @returns {JSX.Element} Button with magnetic hover effect
 */
export const MagneticButton = ({ children, strength = 0.3, ...props }) => {
  /**
   * Handles mouse movement for magnetic effect
   * Calculates distance from center and applies transform
   * 
   * @param {MouseEvent} e - Mouse move event
   */
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate mouse position relative to element center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Apply transform based on distance and strength
    e.currentTarget.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  /**
   * Handles mouse leave to reset button position
   * 
   * @param {MouseEvent} e - Mouse leave event
   */
  const handleMouseLeave = (e) => {
    // Return to center position
    e.currentTarget.style.transform = 'translate(0px, 0px)';
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {
  useScrollAnimation,
  FloatingCard,
  StaggeredText,
  MagneticButton
};
