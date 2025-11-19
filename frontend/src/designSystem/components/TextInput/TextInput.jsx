/**
 * TextInput Component
 * Text input with label, helper text, error states, and icons
 *
 * @component
 * @example
 * <TextInput
 *   label="Email"
 *   placeholder="Enter email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextInput.module.css';

const TextInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      disabled = false,
      required = false,
      error = null,
      success = false,
      loading = false,
      helperText,
      type = 'text',
      className = '',
      icon = null,
      errorIcon = null,
      successIcon = null,
      loadingIcon = null,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const inputId = restProps.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${inputId}-helper`;

    const inputClassName = `${styles.input} ${error ? styles.error : ''} ${
      success && !error ? styles.success : ''
    } ${className}`;

    const showError = error && !loading;
    const showSuccess = success && !error && !loading;

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={inputId} className={`${styles.label} ${required ? styles.required : ''}`}>
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={inputClassName}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            aria-label={ariaLabel || label}
            aria-describedby={ariaDescribedBy || (helperText || error ? helperId : undefined)}
            aria-invalid={showError}
            {...restProps}
          />

          {loading && loadingIcon && (
            <div className={`${styles.icon} ${styles.loadingIcon}`}>{loadingIcon}</div>
          )}
          {showError && errorIcon && <div className={`${styles.icon} ${styles.errorIcon}`}>{errorIcon}</div>}
          {showSuccess && successIcon && (
            <div className={`${styles.icon} ${styles.successIcon}`}>{successIcon}</div>
          )}
        </div>

        {(helperText || error) && (
          <div
            id={helperId}
            className={`${styles.helperText} ${error ? styles.error : ''} ${
              success ? styles.success : ''
            }`}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

TextInput.propTypes = {
  /** Label text */
  label: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Input value */
  value: PropTypes.string,
  /** Change handler */
  onChange: PropTypes.func,
  /** Blur handler */
  onBlur: PropTypes.func,
  /** Disabled state */
  disabled: PropTypes.bool,
  /** Required field */
  required: PropTypes.bool,
  /** Error message */
  error: PropTypes.string,
  /** Success state */
  success: PropTypes.bool,
  /** Loading state */
  loading: PropTypes.bool,
  /** Helper text below input */
  helperText: PropTypes.string,
  /** Input type */
  type: PropTypes.string,
  /** Additional CSS class */
  className: PropTypes.string,
  /** Icon element */
  icon: PropTypes.node,
  /** Error icon element */
  errorIcon: PropTypes.node,
  /** Success icon element */
  successIcon: PropTypes.node,
  /** Loading icon element */
  loadingIcon: PropTypes.node,
  /** Aria label */
  'aria-label': PropTypes.string,
  /** Aria described by */
  'aria-describedby': PropTypes.string,
};

export default TextInput;
