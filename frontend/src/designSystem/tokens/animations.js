/**
 * Design System Animation & Transition Tokens
 * Includes timing, easing, and duration values
 */

export const animations = {
  // Timing durations
  duration: {
    instant: '0ms',
    fast: '100ms',
    standard: '200ms',
    slow: '300ms',
    extraSlow: '500ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy
  },

  // Standard transitions
  transition: {
    fast: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    standard: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fastEaseOut: 'all 100ms cubic-bezier(0, 0, 0.2, 1)',
    standardEaseOut: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
    slowEaseOut: 'all 300ms cubic-bezier(0, 0, 0.2, 1)',
  },

  // Animation keyframes
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    slideUp: `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    slideDown: `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    scaleIn: `
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
    spin: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    shimmer: `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    `,
  },

  // Animation definitions (ready to use)
  animation: {
    fadeIn: 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slideUp: 'slideUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    slideDown: 'slideDown 300ms cubic-bezier(0, 0, 0.2, 1)',
    scaleIn: 'scaleIn 200ms cubic-bezier(0, 0, 0.2, 1)',
    spin: 'spin 1s linear infinite',
    pulse: 'pulse 2s ease-in-out infinite',
    shimmer: 'shimmer 2s infinite',
  },

  // Motion principles
  principles: {
    entrance: 'slideUp with easeOutBack (300ms)',
    exit: 'slideUp with easeIn (200ms)',
    stateChange: 'all transitions with easeInOut (200ms)',
    loading: 'spin with linear (1s)',
  },
};

export default animations;
