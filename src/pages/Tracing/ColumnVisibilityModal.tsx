import React from 'react';
import styles from './ColumnVisibilityModal.module.css';
import { X } from 'lucide-react';
// 새로 만든 types.ts 파일에서 Column과 SessionData 타입을 가져옵니다.
import { Column, SessionData } from './types';

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  toggleColumnVisibility: (key: keyof SessionData) => void;
}

const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({ isOpen, onClose, columns, toggleColumnVisibility }) => {
  if (!isOpen) {
    return null;
  }

  const visibleColumnCount = columns.filter(c => c.visible).length;
  const totalColumnCount = columns.length;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Column Visibility</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.actionButton}>Select All Columns {visibleColumnCount}/{totalColumnCount}</button>
          <button className={styles.actionButton}>Restore Defaults</button>
        </div>
        <div className={styles.columnList}>
          {columns.map((col) => (
            <label key={col.key} className={styles.columnItem}>
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => toggleColumnVisibility(col.key)}
                disabled={col.key === 'id'} // ID 컬럼은 비활성화
              />
              {col.header}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnVisibilityModal;