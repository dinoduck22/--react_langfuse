// src/components/Dashboard/WidgetCard.tsx

import React from 'react';
import styles from './WidgetCard.module.css';
import { GripVertical, Copy, Trash2, Download } from 'lucide-react';

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onDelete?: () => void;
  onCopy?: () => void; // 🔽 onCopy prop 추가
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, subtitle, children, onDelete, onCopy }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.cardActions}>
          <button className={`${styles.iconButton} drag-handle`} aria-label="Move widget">
            <GripVertical size={16} />
          </button>
          {/* 🔽 onClick 이벤트 핸들러 연결 */}
          <button className={styles.iconButton} aria-label="Copy widget" onClick={onCopy}>
            <Copy size={16} />
          </button>
          <button className={styles.iconButton} aria-label="Delete widget" onClick={onDelete}>
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
      <div className={styles.resizeHandle} />
    </div>
  );
};

export default WidgetCard;