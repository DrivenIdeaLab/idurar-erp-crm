/**
 * Button Component
 * Reusable button with multiple variants and sizes
 *
 * @component
 * @example
 * // Primary button
 * <Button variant="primary" size="medium">Click me</Button>
 *
 * // With icon
 * <Button icon={<SaveIcon />}>Save</Button>
 *
 * // Loading state
 * <Button loading>Processing...</Button>
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';
import { BUTTON_VARIANTS, BUTTON_SIZES } from './Button.types';

const Button = React.forwardRef(
  (
    {
      variant = BUTTON_VARIANTS.PRIMARY,
      size = BUTTON_SIZES.MEDIUM,
      disabled = false,
      loading = false,
      fullWidth = false,
      icon = null,
      iconPosition = 'left',
      children,
      className = '',
      type = 'button',
      onClick,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const buttonClass = `${styles.button} ${styles[`variant-${variant}`]} ${styles[`size-${size}`]} ${
      fullWidth ? styles.fullWidth : ''
    } ${loading ? styles.loading : ''} ${className}`;

    const handleClick = (event) => {
      if (loading || disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClass}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-disabled={disabled || loading}
        {...restProps}
      >
        {icon && iconPosition === 'left' && <span className={styles.iconLeft}>{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className={styles.iconRight}>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  /** Visual variant of the button */
  variant: PropTypes.oneOf(Object.values(BUTTON_VARIANTS)),
  /** Size of the button */
  size: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
  /** Whether button is disabled */
  disabled: PropTypes.bool,
  /** Whether button is in loading state */
  loading: PropTypes.bool,
  /** Button text or content */
  children: PropTypes.node,
  /** Optional icon element */
  icon: PropTypes.node,
  /** Position of icon relative to text */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** Click event handler */
  onClick: PropTypes.func,
  /** Additional CSS class */
  className: PropTypes.string,
  /** HTML type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Aria label for accessibility */
  'aria-label': PropTypes.string,
  /** Full width button */
  fullWidth: PropTypes.bool,
};

export default Button;
