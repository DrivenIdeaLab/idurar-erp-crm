/**
 * Button Component Types
 * Defines all possible props and their types
 */

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extraLarge',
};

export const buttonPropTypes = {
  /**
   * Visual variant of the button
   * @type {string}
   */
  variant: Object.values(BUTTON_VARIANTS),

  /**
   * Size of the button
   * @type {string}
   */
  size: Object.values(BUTTON_SIZES),

  /**
   * Whether button is disabled
   * @type {boolean}
   */
  disabled: 'boolean',

  /**
   * Button text content
   * @type {React.ReactNode}
   */
  children: 'ReactNode',

  /**
   * Optional icon element
   * @type {React.ReactNode}
   */
  icon: 'ReactNode',

  /**
   * Icon position (left or right)
   * @type {string}
   */
  iconPosition: ['left', 'right'],

  /**
   * Click handler
   * @type {function}
   */
  onClick: 'function',

  /**
   * Additional CSS class
   * @type {string}
   */
  className: 'string',

  /**
   * HTML type attribute
   * @type {string}
   */
  type: ['button', 'submit', 'reset'],

  /**
   * Aria label for accessibility
   * @type {string}
   */
  'aria-label': 'string',

  /**
   * Loading state
   * @type {boolean}
   */
  loading: 'boolean',

  /**
   * Full width button
   * @type {boolean}
   */
  fullWidth: 'boolean',
};
