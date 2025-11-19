/**
 * Design System Shadow Tokens
 * Elevation-based shadow system
 * Follows Material Design principles
 */

export const shadows = {
  // Depth levels for elevation
  depth0: {
    boxShadow: 'none',
    name: 'depth0',
  },

  // Subtle elevation - UI elements
  depth1: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    name: 'depth1',
  },

  // Medium elevation - Cards, panels, dropdowns
  depth2: {
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    name: 'depth2',
  },

  // High elevation - Modals, popovers, overlays
  depth3: {
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    name: 'depth3',
  },

  // Maximum elevation - Full-screen modals, critical alerts
  depth4: {
    boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    name: 'depth4',
  },

  // Focus state shadow (accessibility)
  focus: {
    boxShadow: '0 0 0 3px rgba(0, 217, 255, 0.25)',
    name: 'focus',
  },

  // Inset shadow (for pressed states)
  inset: {
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25)',
    name: 'inset',
  },

  // Light mode shadows (for future implementation)
  lightMode: {
    depth1: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.16)',
    depth2: '0 3px 6px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.18)',
    depth3: '0 10px 20px rgba(0, 0, 0, 0.14), 0 6px 6px rgba(0, 0, 0, 0.18)',
    depth4: '0 15px 25px rgba(0, 0, 0, 0.12), 0 5px 10px rgba(0, 0, 0, 0.04)',
  },
};

export default shadows;
