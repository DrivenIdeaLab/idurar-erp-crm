/**
 * Design System Spacing Scale
 * Base unit: 8px
 * Used for padding, margin, gaps, etc.
 */

export const spacing = {
  // Core spacing scale (in pixels)
  xs: '4px', // 0.5 unit
  sm: '8px', // 1 unit (base)
  md: '12px', // 1.5 units
  lg: '16px', // 2 units
  xl: '24px', // 3 units
  xxl: '32px', // 4 units
  '3xl': '48px', // 6 units
  '4xl': '64px', // 8 units

  // Component padding standards
  component: {
    button: {
      vertical: '8px',
      horizontal: '16px',
    },
    input: {
      vertical: '8px',
      horizontal: '12px',
    },
    card: '24px',
    modal: '32px',
    panel: '24px',
    listItem: {
      vertical: '12px',
      horizontal: '16px',
    },
  },

  // Gap/Space between elements
  gap: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },

  // Margin standards
  margin: {
    heading2text: '8px', // Space between heading and description
    sectionGap: '32px', // Space between major sections
    cardGap: '16px', // Space between cards in grid
    listItemGap: '8px', // Space between list items
    betweenFeatures: '48px', // Space between features
  },

  // Padding standards
  padding: {
    section: '24px',
    card: '24px',
    modal: '32px',
    layout: '24px',
    mobile: '12px',
    tablet: '16px',
  },

  // Responsive padding
  responsive: {
    xs: {
      // Extra small (mobile)
      section: '12px',
      card: '16px',
    },
    sm: {
      // Small (mobile landscape)
      section: '16px',
      card: '16px',
    },
    md: {
      // Medium (tablet)
      section: '20px',
      card: '20px',
    },
    lg: {
      // Large (desktop)
      section: '24px',
      card: '24px',
    },
  },

  // Touch target sizing
  touch: {
    minimum: '48px', // WCAG minimum touch target size
    comfortable: '56px',
    large: '64px',
  },
};

export default spacing;
