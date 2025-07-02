/**
 * @fileoverview Animation utility functions for consistent GSAP animations across the EventPal application
 * 
 * This module provides a comprehensive set of animation utilities using GSAP (GreenSock Animation Platform).
 * It includes interactive button animations, card hover effects, entrance animations, and special effects
 * like ripple animations. All animations are optimized for performance and accessibility.
 * 
 * Key Features:
 * - Interactive button animations with hover, click states
 * - Card animations with smooth transforms and shadows  
 * - Tab button animations with active state handling
 * - Entrance animations (fade, slide, bounce)
 * - Ripple effect for tactile feedback
 * - Auto-initialization system for DOM elements
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import { gsap } from 'gsap';

/**
 * Collection of animation utility functions for consistent animations across the app
 * Each function returns a cleanup function to properly remove event listeners
 */
export const AnimationUtils = {
  /**
   * Initializes standard button animations with hover, press, and release effects
   * 
   * @param {HTMLElement} element - The button element to animate
   * @returns {Function|undefined} Cleanup function to remove event listeners, or undefined if no element
   * 
   * Animation Effects:
   * - Hover: Scale up (1.05x), lift (-2px), enhanced shadow
   * - Press: Scale down (0.95x) for tactile feedback
   * - Release: Scale back up with bounce effect
   */
  initButton: (element) => {
    if (!element) return;

    // Set initial transform state to ensure consistent starting point
    gsap.set(element, {
      scale: 1,
      rotation: 0,
      transformOrigin: "center"
    });

    // Hover enter: Lift and scale button with enhanced shadow
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        y: -2,
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Hover leave: Return to default state
    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Mouse down: Quick scale down for press feedback
    const handleMouseDown = () => {
      gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    // Mouse up: Bounce back to hover state with elastic effect
    const handleMouseUp = () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.2,
        ease: "back.out(1.7)"
      });
    };

    // Attach event listeners for interactive states
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);

    // Return cleanup function to prevent memory leaks
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
    };
  },

  /**
   * Initializes primary button animations with enhanced effects and continuous pulse
   * 
   * @param {HTMLElement} element - The primary button element to animate
   * @returns {Function|undefined} Cleanup function to remove listeners and kill animations
   * 
   * Special Features:
   * - Continuous pulse animation with expanding shadow ring
   * - Enhanced hover effects with rotation and larger scale
   * - Pause/resume pulse during interaction
   * - Brand color (#FF6B6B) integration
   */
  initPrimaryButton: (element) => {
    if (!element) return;

    // Initialize transform properties for consistent starting state
    gsap.set(element, {
      scale: 1,
      rotation: 0,
      transformOrigin: "center"
    });

    // Continuous pulse animation - creates expanding shadow ring effect
    const pulseAnimation = gsap.to(element, {
      boxShadow: "0 0 0 10px rgba(255, 107, 107, 0)",
      duration: 1.5,
      repeat: -1,
      ease: "power2.out"
    });

    // Hover enter: Pause pulse, apply enhanced transforms with brand color shadow
    const handleMouseEnter = () => {
      pulseAnimation.pause();
      gsap.to(element, {
        scale: 1.08,
        y: -3,
        rotation: 1,
        boxShadow: "0 10px 30px rgba(255, 107, 107, 0.3)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Hover leave: Return to default state and resume pulse animation
    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => pulseAnimation.resume()
      });
    };

    // Click: Quick scale animation with yoyo effect for tactile feedback
    const handleClick = () => {
      gsap.to(element, {
        scale: 0.92,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('click', handleClick);
      pulseAnimation.kill();
    };
  },

  /**
   * Initializes card hover animations with subtle lift and shadow effects
   * 
   * @param {HTMLElement} element - The card element to animate
   * @returns {Function|undefined} Cleanup function to remove event listeners
   * 
   * Animation Effects:
   * - Subtle scale increase (1.02x) for gentle emphasis
   * - Lift effect (-5px) with enhanced shadow depth
   * - Smooth transitions for premium feel
   */
  initCard: (element) => {
    if (!element) return;

    // Set initial state for consistent card positioning
    gsap.set(element, {
      scale: 1,
      y: 0,
      transformOrigin: "center"
    });

    // Hover enter: Subtle lift with enhanced shadow for depth
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.02,
        y: -5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        duration: 0.4,
        ease: "power2.out"
      });
    };

    // Hover leave: Return to resting state with reduced shadow
    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        duration: 0.4,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  },

  // Tab animations
  initTab: (element, isActive = false) => {
    if (!element) return;

    gsap.set(element, {
      scale: 1,
      y: 0,
      transformOrigin: "center"
    });

    const handleMouseEnter = () => {
      if (!isActive) {
        gsap.to(element, {
          scale: 1.05,
          y: -2,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      if (!isActive) {
        gsap.to(element, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleClick = () => {
      gsap.to(element, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('click', handleClick);
    };
  },

  /**
   * Fade in animation from bottom with scale effect
   * 
   * @param {HTMLElement} element - Element to animate
   * @param {number} delay - Animation delay in seconds (default: 0)
   * 
   * Creates a smooth entrance effect with opacity, vertical movement, and scale
   */
  fadeInUp: (element, delay = 0) => {
    if (!element) return;
    
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay,
        ease: "power2.out"
      }
    );
  },

  /**
   * Slide in animation from left with elastic bounce
   * 
   * @param {HTMLElement} element - Element to animate
   * @param {number} delay - Animation delay in seconds (default: 0)
   * 
   * Creates a dynamic entrance with horizontal movement and elastic bounce
   */
  slideInLeft: (element, delay = 0) => {
    if (!element) return;
    
    gsap.fromTo(element,
      {
        opacity: 0,
        x: -50,
        scale: 0.9
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        delay,
        ease: "back.out(1.7)"
      }
    );
  },

  /**
   * Bounce in animation with scale effect
   * 
   * @param {HTMLElement} element - Element to animate  
   * @param {number} delay - Animation delay in seconds (default: 0)
   * 
   * Creates a playful entrance with scale from zero and elastic bounce
   */
  bounceIn: (element, delay = 0) => {
    if (!element) return;
    
    gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "back.out(1.7)"
      }
    );
  },

  /**
   * Adds ripple effect animation on click for tactile feedback
   * 
   * @param {HTMLElement} element - Element to add ripple effect to
   * @returns {Function|undefined} Cleanup function to remove event listener
   * 
   * Features:
   * - Creates expanding circle from click position
   * - Automatically calculates ripple size based on element dimensions
   * - Handles cleanup of created ripple elements
   * - Sets required CSS properties (position: relative, overflow: hidden)
   */
  addRippleEffect: (element) => {
    if (!element) return;

    const handleClick = (e) => {
      // Get element boundaries for positioning calculations
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement('div');
      
      // Calculate ripple size to cover entire element
      const size = Math.max(rect.width, rect.height);
      
      // Position ripple center at click coordinates
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      // Apply ripple styles programmatically for better performance
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      // Animate ripple expansion and fade out
      gsap.fromTo(ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            ripple.remove(); // Clean up DOM element
          }
        }
      );
    };

    // Set required CSS properties for ripple effect
    element.addEventListener('click', handleClick);
    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }
};

// Auto-initialize animations based on classes
export const initAllAnimations = () => {
  // Initialize buttons
  document.querySelectorAll('.btn').forEach((btn, index) => {
    if (btn.classList.contains('btn-primary')) {
      AnimationUtils.initPrimaryButton(btn);
      AnimationUtils.addRippleEffect(btn);
    } else {
      AnimationUtils.initButton(btn);
    }
    
    // Stagger entrance animations
    AnimationUtils.fadeInUp(btn, index * 0.1);
  });

  // Initialize cards
  document.querySelectorAll('.event-card, .category-card, .action-card').forEach((card, index) => {
    AnimationUtils.initCard(card);
    AnimationUtils.fadeInUp(card, index * 0.1);
  });

  // Initialize tabs
  document.querySelectorAll('.tab-btn, .auth-tab').forEach((tab, index) => {
    const isActive = tab.classList.contains('active');
    AnimationUtils.initTab(tab, isActive);
    AnimationUtils.slideInLeft(tab, index * 0.1);
  });

  // Initialize nav links
  document.querySelectorAll('.nav-link').forEach((link, index) => {
    AnimationUtils.initButton(link);
    AnimationUtils.slideInLeft(link, index * 0.1);
  });
};

export default AnimationUtils;
