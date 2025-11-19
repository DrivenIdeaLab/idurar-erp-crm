/**
 * Toast Component
 * Notification alerts
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Toast.module.css';

const Toast = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  closeable = true,
  position = 'top-right',
  ...restProps
}) => {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[`type-${type}`]} ${styles[`position-${position}`]}`} role="alert" {...restProps}>
      <div className={styles.content}>{message}</div>
      {closeable && (
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close notification">
          ×
        </button>
      )}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
  closeable: PropTypes.bool,
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
};

export default Toast;
