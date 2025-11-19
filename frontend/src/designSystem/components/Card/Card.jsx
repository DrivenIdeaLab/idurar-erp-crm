/**
 * Card Component
 * Container for content with elevation and styling
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({
  children,
  header,
  footer,
  className = '',
  elevation = 'depth1',
  interactive = false,
  onClick,
  ...restProps
}) => {
  const cardClass = `${styles.card} ${styles[`elevation-${elevation}`]} ${interactive ? styles.interactive : ''} ${className}`;

  return (
    <div
      className={cardClass}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...restProps}
    >
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  elevation: PropTypes.oneOf(['depth0', 'depth1', 'depth2', 'depth3', 'depth4']),
  interactive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Card;
