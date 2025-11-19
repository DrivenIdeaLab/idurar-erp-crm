/**
 * Badge Component
 * Status indicators, tags, count badges
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './Badge.module.css';

const Badge = ({ children, variant = 'info', size = 'medium', outline = false, closeable = false, onClose, className = '', ...restProps }) => {
  const badgeClass = `${styles.badge} ${styles[`variant-${variant}`]} ${styles[`size-${size}`]} ${
    outline ? styles.outline : ''
  } ${className}`;

  return (
    <span className={badgeClass} {...restProps}>
      {children}
      {closeable && (
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close badge">
          ×
        </button>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'neutral']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  outline: PropTypes.bool,
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Badge;
