/**
 * Design System Tokens - Main Export
 * Aggregates all design tokens for easy access
 */

export { default as colors } from './colors';
export { default as typography } from './typography';
export { default as spacing } from './spacing';
export { default as shadows } from './shadows';
export { default as borders } from './borders';
export { default as animations } from './animations';
export { default as breakpoints } from './breakpoints';

// Combined export for convenience
import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import shadows from './shadows';
import borders from './borders';
import animations from './animations';
import breakpoints from './breakpoints';

export const tokens = {
  colors,
  typography,
  spacing,
  shadows,
  borders,
  animations,
  breakpoints,
};
