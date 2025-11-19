/**
 * Radio Component
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './Radio.module.css';

const Radio = React.forwardRef(
  ({ label, name, value, checked = false, onChange, disabled = false, className = '', ...restProps }, ref) => {
    const radioId = restProps.id || `radio-${String(Math.random()).substr(2, 9)}`;
    return (
      <div className={styles.container}>
        <input
          ref={ref}
          id={radioId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.radio} ${className}`}
          {...restProps}
        />
        {label && (
          <label htmlFor={radioId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

Radio.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Radio;
