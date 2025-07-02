/**
 * @fileoverview Comprehensive animation components library for EventPal
 * 
 * This module provides a rich collection of reusable animation components built with
 * Framer Motion and GSAP. It includes entrance animations, hover effects, scroll-triggered
 * animations, and specialized components for common UI patterns.
 * 
 * Key Features:
 * - Entrance animations (fade, slide, scale, bounce)
 * - Hover and interaction effects (scale, magnetic)
 * - Page transitions and modal animations
 * - Continuous animations (floating, pulse, rotate)
 * - Scroll-triggered animations with GSAP ScrollTrigger
 * - Text animations (typewriter, stagger)
 * - Container animations for coordinated effects
 * 
 * Performance Considerations:
 * - Uses GPU-accelerated transforms
 * - Optimized for 60fps animations
 * - Proper cleanup to prevent memory leaks
 * - Conditional rendering for reduced overhead
 * 
 * @author EventPal Team
 * @version 1.0.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins for scroll-triggered animations
gsap.registerPlugin(ScrollTrigger);

/**
 * FadeIn animation component with upward movement
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Elements to animate
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 * @returns {JSX.Element} Animated container with fade and slide up effect
 */
export const FadeIn = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * SlideInLeft animation component
 * 
 * @param {Object} props - Component props  
 * @param {React.ReactNode} props.children - Elements to animate
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 * @returns {JSX.Element} Animated container with slide from left effect
 */
export const SlideInLeft = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * SlideInRight animation component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Elements to animate  
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 * @returns {JSX.Element} Animated container with slide from right effect
 */
export const SlideInRight = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

// Scale in animation
export const ScaleIn = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger children animation
export const StaggerContainer = ({ children, staggerDelay = 0.1, ...props }) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: {},
      show: {
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger child item
export const StaggerItem = ({ children, ...props }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6 }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Hover animation wrapper
export const HoverScale = ({ children, scale = 1.05, ...props }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Page transition wrapper
export const PageTransition = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Floating animation
export const FloatingElement = ({ children, duration = 3, ...props }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Pulse animation
export const PulseElement = ({ children, scale = [1, 1.05, 1], duration = 2, ...props }) => (
  <motion.div
    animate={{
      scale: scale,
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Rotate animation
export const RotateElement = ({ children, rotation = 360, duration = 2, ...props }) => (
  <motion.div
    animate={{
      rotate: rotation,
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "linear"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Modal animation
export const ModalAnimation = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}
    {...props}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// Bounce animation
export const BounceElement = ({ children, ...props }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
    }}
    transition={{
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide up animation (for mobile menus)
export const SlideUp = ({ children, ...props }) => (
  <motion.div
    initial={{ y: "100%" }}
    animate={{ y: 0 }}
    exit={{ y: "100%" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    {...props}
  >
    {children}
  </motion.div>
);

// Typewriter effect
export const TypewriterText = ({ text, delay = 0, ...props }) => (
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: "auto" }}
    transition={{ 
      duration: text.length * 0.05,
      delay,
      ease: "linear"
    }}
    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
    {...props}
  >
    {text}
  </motion.div>
);

// Gradient animation with new colors
export const GradientShift = ({ children, ...props }) => (
  <motion.div
    animate={{
      background: [
        "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
        "linear-gradient(45deg, #4ECDC4, #45B7D1)",
        "linear-gradient(45deg, #45B7D1, #FF6B6B)"
      ]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// GSAP Scroll Animation Hook
export const useGSAPScrollAnimation = (selector, animation) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.from(element, {
        ...animation,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    }, element);

    return () => ctx.revert();
  }, [animation]);

  return ref;
};

// GSAP Parallax Component
export const ParallaxElement = ({ children, speed = 0.5, ...props }) => {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, element);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};

// GSAP Counter Animation
export const CounterAnimation = ({ end, duration = 2, ...props }) => {
  const ref = useRef();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to({ value: 0 }, {
        value: end,
        duration,
        ease: "power2.out",
        onUpdate: function() {
          setCount(Math.round(this.targets()[0].value));
        },
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }, element);

    return () => ctx.revert();
  }, [end, duration]);

  return (
    <span ref={ref} {...props}>
      {count}
    </span>
  );
};

export default {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  HoverScale,
  PageTransition,
  FloatingElement,
  PulseElement,
  RotateElement,
  ModalAnimation,
  BounceElement,
  SlideUp,
  TypewriterText,
  GradientShift
};
