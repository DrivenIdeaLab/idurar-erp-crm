/**
 * Design System Typography Tokens
 * Type Scale: 8px base unit
 * Supports multiple variants and sizes
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    mono: '"Courier New", Courier, monospace',
    system: 'system-ui, -apple-system, sans-serif',
  },

  // Type Scale - Large Display
  displayLarge: {
    fontSize: '48px',
    lineHeight: '56px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    name: 'displayLarge',
  },

  displayMedium: {
    fontSize: '40px',
    lineHeight: '48px',
    fontWeight: 700,
    letterSpacing: '-0.25px',
    name: 'displayMedium',
  },

  // Headings
  headingLarge: {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 700,
    letterSpacing: '0px',
    name: 'headingLarge',
  },

  headingMedium: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 600,
    letterSpacing: '0px',
    name: 'headingMedium',
  },

  headingSmall: {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 600,
    letterSpacing: '0px',
    name: 'headingSmall',
  },

  // Body Text
  bodyLarge: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '0px',
    name: 'bodyLarge',
  },

  bodyMedium: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    letterSpacing: '0px',
    name: 'bodyMedium',
  },

  bodySmall: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0px',
    name: 'bodySmall',
  },

  // Code/Monospace
  codeLarge: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    letterSpacing: '0px',
    fontFamily: '"Courier New", Courier, monospace',
    name: 'codeLarge',
  },

  codeSmall: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0px',
    fontFamily: '"Courier New", Courier, monospace',
    name: 'codeSmall',
  },

  // Label/Tags
  labelMedium: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    name: 'labelMedium',
  },

  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Font Sizes (for utility usage)
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px',
  },

  // Line Height
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.5px',
    normal: '0px',
    wide: '0.5px',
  },
};

export default typography;
