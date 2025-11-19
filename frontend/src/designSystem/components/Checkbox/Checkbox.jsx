/**
 * Checkbox Component
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './Checkbox.module.css';

const Checkbox = React.forwardRef(
  (
    {
      label,
      checked = false,
      onChange,
      disabled = false,
      indeterminate = false,
      className = '',
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const checkboxId = restProps.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={styles.container}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.checkbox} ${className}`}
          aria-label={ariaLabel || label}
          data-indeterminate={indeterminate}
          {...restProps}
        />
        {label && (
          <label htmlFor={checkboxId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  className: PropTypes.string,
  'aria-label': PropTypes.string,
};

export default Checkbox;
