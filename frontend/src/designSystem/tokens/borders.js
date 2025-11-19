/**
 * Design System Border Tokens
 * Includes border radius and border color values
 */

export const borders = {
  // Border Radius
  radius: {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '12px',
    extraLarge: '16px',
    full: '9999px', // For pills
  },

  // Border Widths
  width: {
    hairline: '0.5px', // Very subtle dividers
    thin: '1px', // Standard borders
    medium: '2px', // Active states, focus
    thick: '3px', // Emphasis, important dividers
  },

  // Border Colors
  color: {
    primary: '#30363d', // Main border color
    secondary: '#21262d', // Secondary border
    subtle: '#0d1117', // Very subtle border
    light: '#d0d7de', // Light mode primary
    lightSecondary: '#eaeef2', // Light mode secondary
    lightSubtle: '#f0f2f5', // Light mode subtle
  },

  // Common border combinations
  border: {
    standard: '1px solid #30363d',
    subtle: '0.5px solid #21262d',
    focus: '2px solid #00d9ff',
    error: '2px solid #ef4444',
    success: '2px solid #10b981',
    warning: '2px solid #f59e0b',
    info: '2px solid #3b82f6',
  },
};

export default borders;
