/**
 * Modal Component
 * Dialog box with overlay
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const Modal = ({
  open = false,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  className = '',
  closeButton = true,
  ...restProps
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [open]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="presentation">
      <div className={`${styles.modal} ${styles[`size-${size}`]} ${className}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" {...restProps}>
        {closeButton && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        )}

        {title && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
          </div>
        )}

        <div className={styles.content}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  closeButton: PropTypes.bool,
};

export default Modal;
