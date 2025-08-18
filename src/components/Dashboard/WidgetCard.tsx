// src/components/Dashboard/WidgetCard.tsx

import React from 'react';
import styles from './WidgetCard.module.css';
import { GripVertical, Copy, Trash2, Download } from 'lucide-react';

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
        <div> 
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.cardActions}>
          <button className={styles.iconButton} aria-label="Move widget">
            <GripVertical size={16} />
          </button>
          <button className={styles.iconButton} aria-label="Copy widget">
            <Copy size={16} />
          </button>
          <button className={styles.iconButton} aria-label="Delete widget">
            <Trash2 size={16} />
          </button>
          <button className={styles.iconButton} aria-label="Download widget data">
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      {/* 🔽 리사이즈 핸들 아이콘 추가 */}
      <div className={styles.resizeHandle} />
    </div>
  );
};

export default WidgetCard;