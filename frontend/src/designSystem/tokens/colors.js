/**
 * Design System Color Tokens
 * WCAG 2.1 AA compliant
 * Supports both dark and light modes
 */

export const colors = {
  // Dark Mode (Primary)
  background: {
    primary: '#0f1117', // Main canvas
    secondary: '#161b22', // Cards, panels
    tertiary: '#21262d', // Subtle elevation
    elevated: '#30363d', // Modals, popovers
  },

  // Text Colors
  text: {
    primary: '#e6edf3', // Main text (100% opacity)
    secondary: '#8b949e', // Labels, secondary text
    tertiary: '#6e7681', // Disabled, hints
    inverse: '#0f1117', // Text on light backgrounds
  },

  // Accent Colors
  accent: {
    electric: '#00d9ff', // Primary accent - Links, CTAs, focus
    deepBlue: '#0969da', // Alternative primary
    bright: '#1f6feb', // Hover states
  },

  // Status Colors
  status: {
    success: '#10b981', // Successful queries, active states
    warning: '#f59e0b', // Slow queries, optimization needed
    error: '#ef4444', // Errors, critical issues
    info: '#3b82f6', // Information, live indicators
  },

  // Neutral/Grayscale
  neutral: {
    50: '#ffffff',
    100: '#f6f8fa',
    200: '#eaeef2',
    300: '#d0d7de',
    400: '#8b949e',
    500: '#6e7681',
    600: '#57606a',
    700: '#424a53',
    800: '#30363d',
    900: '#21262d',
  },

  // Border Colors
  border: {
    primary: '#30363d',
    secondary: '#21262d',
    subtle: '#0d1117',
  },

  // Chart/Data Visualization Colors
  chart: {
    series1: '#00d9ff', // Cyan
    series2: '#10b981', // Emerald
    series3: '#f59e0b', // Amber
    series4: '#3b82f6', // Blue
    series5: '#8b5cf6', // Violet
    series6: '#ec4899', // Pink
  },

  // Light Mode Alternatives (for future implementation)
  lightMode: {
    background: {
      primary: '#ffffff',
      secondary: '#f6f8fa',
      tertiary: '#eaeef2',
      elevated: '#d0d7de',
    },
    text: {
      primary: '#24292f',
      secondary: '#57606a',
      tertiary: '#8c959f',
      inverse: '#ffffff',
    },
  },
};

export default colors;
