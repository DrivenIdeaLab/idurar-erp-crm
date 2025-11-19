/**
 * Design System Responsive Breakpoints
 * Mobile-first approach
 */

export const breakpoints = {
  // Breakpoint values
  xs: 0, // Extra small - Mobile portrait
  sm: 641, // Small - Mobile landscape
  md: 769, // Medium - Tablet
  lg: 1025, // Large - Desktop
  xl: 1281, // Extra Large - Large desktop
  '2xl': 1537, // 2x Large - Ultra-wide

  // Media query helpers
  media: {
    xs: '@media (min-width: 0px)',
    sm: '@media (min-width: 641px)',
    md: '@media (min-width: 769px)',
    lg: '@media (min-width: 1025px)',
    xl: '@media (min-width: 1281px)',
    '2xl': '@media (min-width: 1537px)',
    // Maximum width queries
    'max-xs': '@media (max-width: 640px)',
    'max-sm': '@media (max-width: 768px)',
    'max-md': '@media (max-width: 1024px)',
    'max-lg': '@media (max-width: 1280px)',
    'max-xl': '@media (max-width: 1536px)',
  },

  // Device type mappings
  devices: {
    mobile: { min: 0, max: 640, label: 'Mobile Portrait' },
    mobileLandscape: { min: 641, max: 768, label: 'Mobile Landscape' },
    tablet: { min: 769, max: 1024, label: 'Tablet' },
    desktop: { min: 1025, max: 1280, label: 'Desktop' },
    largeDesktop: { min: 1281, max: 1536, label: 'Large Desktop' },
    ultraWide: { min: 1537, label: 'Ultra-wide' },
  },

  // Container queries (for future use)
  container: {
    xs: '360px',
    sm: '384px',
    md: '448px',
    lg: '512px',
    xl: '576px',
    '2xl': '672px',
  },

  // Responsive behavior guidelines
  behavior: {
    xs: {
      layout: 'Single column, full width',
      sidebar: 'Hidden, overlay on toggle',
      topNav: 'Compact, 48px height',
      grid: '1 column',
      padding: '12px',
      fontSize: 'Base (14px)',
    },
    sm: {
      layout: 'Single column',
      sidebar: 'Hidden or minimized',
      topNav: 'Compact, 48px height',
      grid: '1-2 columns',
      padding: '12px',
      fontSize: 'Base (14px)',
    },
    md: {
      layout: '2 column with sidebar',
      sidebar: 'Visible, minimized (64px)',
      topNav: 'Standard, 56px height',
      grid: '2 columns',
      padding: '16px',
      fontSize: 'Base (16px)',
    },
    lg: {
      layout: 'Full multi-column',
      sidebar: 'Visible, expanded (240px)',
      topNav: 'Standard, 56px height',
      grid: '3-4 columns',
      padding: '24px',
      fontSize: 'Base (16px)',
    },
    xl: {
      layout: 'Full layout optimized',
      sidebar: 'Visible, expanded (240px)',
      topNav: 'Standard, 56px height',
      grid: '4-6 columns',
      padding: '24px',
      fontSize: 'Base (16px)',
    },
    '2xl': {
      layout: 'Maximum information density',
      sidebar: 'Visible, expanded (240px)',
      topNav: 'Standard, 56px height',
      grid: '6+ columns',
      padding: '32px',
      fontSize: 'Base (16px)',
    },
  },

  // Touch target sizing by breakpoint
  touchTargets: {
    xs: '48px', // Minimum for mobile
    sm: '48px',
    md: '48px',
    lg: '40px', // Desktop can be slightly smaller
    xl: '40px',
  },
};

export default breakpoints;
