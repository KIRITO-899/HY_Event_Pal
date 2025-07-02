/**
 * @fileoverview Custom React hooks for managing animations in the EventPal application
 * 
 * This module provides reusable React hooks that integrate with GSAP animations from
 * the AnimationUtils module. These hooks handle the lifecycle of animations, cleanup,
 * and provide ref objects that can be attached to React components for automatic animation.
 * 
 * Features:
 * - Button animations with different types (default, primary, tab)
 * - Card hover animations with entrance effects
 * - Entrance animations (fade, slide, bounce) with customizable delays
 * - Automatic cleanup to prevent memory leaks
 * - Type-based animation selection
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import { useEffect, useRef } from 'react';
import { AnimationUtils } from '../utils/animations';

/**
 * Custom hook for button animations with different interaction types
 * 
 * @param {string} type - Animation type: 'default', 'primary', or 'tab'
 * @returns {React.RefObject} Ref object to attach to button elements
 * 
 * Animation Types:
 * - 'default': Standard hover/click animations
 * - 'primary': Enhanced animations with pulse effect and ripple
 * - 'tab': Tab-specific animations with active state handling
 * 
 * Usage:
 * const buttonRef = useButtonAnimation('primary');
 * <button ref={buttonRef}>Click me</button>
 */
export const useButtonAnimation = (type = 'default') => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let cleanup;
    
    // Apply different animation types based on button purpose
    switch (type) {
      case 'primary':
        // Primary buttons get enhanced animations with continuous pulse
        cleanup = AnimationUtils.initPrimaryButton(element);
        // Add tactile ripple effect for better user feedback
        AnimationUtils.addRippleEffect(element);
        break;
      case 'tab':
        // Tab buttons need special handling for active states
        cleanup = AnimationUtils.initTab(element);
        break;
      default:
        // Standard button animations for most use cases
        cleanup = AnimationUtils.initButton(element);
        break;
    }

    // Return cleanup function to prevent memory leaks
    return cleanup;
  }, [type]); // Re-run effect when animation type changes

  return ref;
};

/**
 * Custom hook for card animations with hover effects and entrance
 * 
 * @returns {React.RefObject} Ref object to attach to card elements
 * 
 * Features:
 * - Hover animations: lift effect with enhanced shadows
 * - Entrance animation: fade up with slight delay for smooth loading
 * - Automatic cleanup on component unmount
 * 
 * Usage:
 * const cardRef = useCardAnimation();
 * <div ref={cardRef} className="card">Card content</div>
 */
export const useCardAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initialize hover animations for card
    const cleanup = AnimationUtils.initCard(element);
    
    // Add entrance animation with small delay for staggered loading effect
    AnimationUtils.fadeInUp(element, 0.1);

    return cleanup;
  }, []); // Empty dependency array - only run once on mount

  return ref;
};

/**
 * Custom hook for entrance animations with multiple animation types
 * 
 * @param {string} type - Animation type: 'fadeInUp', 'slideInLeft', 'bounceIn'
 * @param {number} delay - Animation delay in seconds (default: 0)
 * @returns {React.RefObject} Ref object to attach to elements
 * 
 * Animation Types:
 * - 'fadeInUp': Fade in from bottom with scale effect
 * - 'slideInLeft': Slide in from left with elastic bounce
 * - 'bounceIn': Scale from zero with elastic bounce
 * 
 * Usage:
 * const titleRef = useEntranceAnimation('bounceIn', 0.5);
 * <h1 ref={titleRef}>Welcome!</h1>
 */
export const useEntranceAnimation = (type = 'fadeInUp', delay = 0) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Apply entrance animation based on specified type
    switch (type) {
      case 'fadeInUp':
        // Smooth fade from bottom - good for content sections
        AnimationUtils.fadeInUp(element, delay);
        break;
      case 'slideInLeft':
        // Dynamic slide from left - good for navigation items
        AnimationUtils.slideInLeft(element, delay);
        break;
      case 'bounceIn':
        // Playful bounce effect - good for logos and highlights
        AnimationUtils.bounceIn(element, delay);
        break;
      default:
        // Default to fadeInUp for consistency
        AnimationUtils.fadeInUp(element, delay);
    }
  }, [type, delay]); // Re-run when type or delay changes

  return ref;
};

// Export hooks as default object for convenient importing
const animationHooks = {
  useButtonAnimation,
  useCardAnimation,
  useEntranceAnimation
};

export default animationHooks;
