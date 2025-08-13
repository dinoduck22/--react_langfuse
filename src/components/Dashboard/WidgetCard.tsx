import React from 'react';
import styles from './WidgetCard.module.css';

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  gridSpan?: number;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, subtitle, children, gridSpan = 1 }) => {
  const style = {
    gridColumn: `span ${gridSpan}`,
  };

  return (
    <div className={styles.card} style={style}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {/* children을 content div로 감싸서 높이를 100% 채우도록 합니다. */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default WidgetCard;