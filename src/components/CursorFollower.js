/**
 * @fileoverview Custom cursor follower component for enhanced user experience
 * 
 * The CursorFollower component replaces the default cursor with a custom animated cursor
 * that follows mouse movement and provides interactive feedback. It features a dual-layer
 * design with a main cursor ring and a smaller inner dot for precise targeting.
 * 
 * Features:
 * - Smooth GSAP-powered cursor following animation
 * - Interactive hover states for clickable elements
 * - Responsive scaling and color changes
 * - Automatic mobile/touch device detection
 * - Dynamic element detection for hover effects
 * - Optimized for dark mode with mix-blend-mode
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CursorFollower.css';

/**
 * CursorFollower component that creates a custom animated cursor
 * Automatically detects touch devices and disables on mobile
 * 
 * @returns {JSX.Element|null} The cursor follower elements or null on mobile
 */
const CursorFollower = () => {
  // Refs for the main cursor ring and inner dot
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  // Track hover state to maintain correct scale during mouse up events
  const isHovering = useRef(false);

  useEffect(() => {
    // Don't show on mobile/touch devices - prevents cursor conflicts
    if ('ontouchstart' in window) {
      return;
    }

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    // Set initial position with center origin for smooth transforms
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });

    /**
     * Updates cursor position following mouse movement
     * Uses different timing for ring and dot to create layered effect
     * 
     * @param {MouseEvent} e - Mouse move event
     */
    const updateCursor = (e) => {
      // Animate main cursor with smooth follow - slightly delayed for fluid feel
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });

      // Animate dot with faster follow - creates layered cursor effect
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: "power2.out"
      });
    };

    /**
     * Handles mouse enter on interactive elements
     * Scales up cursor and changes color to brand primary
     */
    const handleMouseEnter = () => {
      isHovering.current = true;
      
      // Scale up main cursor ring and change to brand color
      gsap.to(cursor, {
        scale: 1.5,
        backgroundColor: '#FF6B6B',
        duration: 0.3,
        ease: "power2.out"
      });

      // Scale down dot to maintain visual balance
      gsap.to(cursorDot, {
        scale: 0.5,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    /**
     * Handles mouse leave from interactive elements
     * Returns cursor to default state
     */
    const handleMouseLeave = () => {
      isHovering.current = false;
      
      // Return to default size and subtle brand color
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        duration: 0.3,
        ease: "power2.out"
      });

      // Return dot to normal size
      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    /**
     * Handles mouse down for click feedback
     * Scales down both elements for tactile response
     */
    const handleMouseDown = () => {
      gsap.to([cursor, cursorDot], {
        scale: 0.8,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    /**
     * Handles mouse up after click
     * Returns to appropriate state based on hover status
     */
    const handleMouseUp = () => {
      // Return to hover state if hovering, normal state otherwise
      gsap.to(cursor, {
        scale: isHovering.current ? 1.5 : 1,
        duration: 0.2,
        ease: "power2.out"
      });

      gsap.to(cursorDot, {
        scale: isHovering.current ? 0.5 : 1,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    // Add global event listeners for cursor movement and click states
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Define selectors for elements that should trigger hover effects
    const interactiveSelectors = 'button, .btn, a, .event-card, .category-card, .action-card';
    
    /**
     * Sets up hover event listeners for interactive elements
     * Returns cleanup function to remove listeners
     * 
     * @returns {Function} Cleanup function
     */
    const setupHoverListeners = () => {
      const elements = document.querySelectorAll(interactiveSelectors);
      
      elements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
      });

      // Return cleanup function to prevent memory leaks
      return () => {
        elements.forEach(element => {
          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    // Setup initial hover listeners for existing elements
    const cleanupHover = setupHoverListeners();

    // Observe DOM changes to handle dynamically added elements
    // This ensures new interactive elements get hover effects
    const observer = new MutationObserver(() => {
      cleanupHover();
      // Small delay to ensure DOM is ready before re-scanning
      setTimeout(setupHoverListeners, 100);
    });

    // Watch for changes in entire document body
    observer.observe(document.body, {
      childList: true,    // Watch for added/removed nodes
      subtree: true       // Watch entire subtree
    });

    // Cleanup function called when component unmounts
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cleanupHover();
      observer.disconnect();
    };
  }, []); // Empty dependency array - run once on mount

  // Don't render cursor on mobile/touch devices
  if ('ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Main cursor ring - larger outer element with border */}
      <div 
        ref={cursorRef}
        className="cursor-follower"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          backgroundColor: 'rgba(255, 107, 107, 0.1)', // Subtle brand color fill
          border: '2px solid #FF6B6B',                  // Brand color border
          borderRadius: '50%',
          pointerEvents: 'none',                        // Don't block mouse events
          zIndex: 9999,                                 // Above most content
          mixBlendMode: 'difference'                    // Blend for visibility on any background
        }}
      />
      {/* Inner cursor dot - precise targeting indicator */}
      <div 
        ref={cursorDotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: '#FF6B6B',                   // Solid brand color
          borderRadius: '50%',
          pointerEvents: 'none',                        // Don't block mouse events
          zIndex: 10000                                 // Above cursor ring
        }}
      />
    </>
  );
};

export default CursorFollower;
