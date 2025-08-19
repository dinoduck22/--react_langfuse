// src/pages/Tracing/ColumnVisibilityModal.tsx
import React, { useState } from 'react';
import styles from './ColumnVisibilityModal.module.css';
import { X, ChevronRight, Info } from 'lucide-react';
import { Column, SessionData } from './types';
import { columnOrderInModal, scoreColumnKeys } from './sessionColumns';

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  toggleColumnVisibility: (key: keyof SessionData) => void;
  setAllColumnsVisible: (visible: boolean) => void;
}

const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({ isOpen, onClose, columns, toggleColumnVisibility, setAllColumnsVisible }) => {
  const [isScoresOpen, setIsScoresOpen] = useState(false);

  if (!isOpen) {
    return null;
  }

  const totalColumnCount = 26;
  const visibleColumnCount = columns.filter(c => c.visible).length;
  const allColumnsVisible = columns.every(c => c.visible);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllColumnsVisible(e.target.checked);
  };

  const toggleScoresOpen = () => {
    setIsScoresOpen(!isScoresOpen);
  };

  const columnsByKey = new Map(columns.map(c => [c.key, c]));

  const visibleScoreCount = scoreColumnKeys.filter(key => {
    const col = columnsByKey.get(key);
    return col && col.visible;
  }).length;

  const allScoresVisible = scoreColumnKeys.every(key => {
    const col = columnsByKey.get(key);
    return col && col.visible;
  });

  const toggleSelectAllScores = () => {
    const shouldBeVisible = !allScoresVisible;
    scoreColumnKeys.forEach(key => {
      const col = columnsByKey.get(key);
      if (col && col.visible !== shouldBeVisible) {
        toggleColumnVisibility(key);
      }
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Column Visibility</h3>
          <div className={styles.headerActions}>
            <button className={styles.actionButton}>Restore Defaults</button>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className={styles.selectAllRow}>
          <label className={styles.columnItem}>
            <input
              type="checkbox"
              checked={allColumnsVisible}
              onChange={handleSelectAllChange}
            />
            {/* 텍스트와 카운트를 span으로 묶습니다. */}
            <span className={styles.selectAllLabel}>
              Select All Columns
              <span className={styles.columnCount}>{visibleColumnCount}/{totalColumnCount}</span>
            </span>
          </label>
        </div>

        <div className={styles.columnList}>
          {/* Scores 항목 */}
          <div className={`${styles.columnItem} ${styles.groupItem} ${isScoresOpen ? styles.groupItemOpen : ''}`} onClick={toggleScoresOpen}>
            <span className={styles.groupIcon}>❖</span>
            <span className={styles.groupLabel}>
              Scores
              <span className={styles.groupCount}>({visibleScoreCount}/10)</span>
            </span>
            <button type="button" className={styles.groupAction} onClick={(e) => { e.stopPropagation(); toggleSelectAllScores(); }}>
              {allScoresVisible ? 'Deselect All' : 'Select All'}
              <ChevronRight size={16} className={`${styles.chevron} ${isScoresOpen ? styles.chevronOpen : ''}`} />
            </button>
          </div>
          {isScoresOpen && (
            <div className={styles.scoresDropdown}>
              {scoreColumnKeys.map(key => {
                const col = columnsByKey.get(key);
                if (!col) return null;
                return (
                  <label key={key} className={`${styles.columnItem} ${styles.dropdownItem}`}>
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumnVisibility(key)}
                    />
                    {/* 컬럼 헤더를 span으로 묶습니다. */}
                    <span>{col.header}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* 나머지 컬럼들 */}
          {columnOrderInModal.map(key => {
            const col = columnsByKey.get(key);
            if (!col) return null;

            return (
              <label key={col.key} className={styles.columnItem}>
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumnVisibility(col.key)}
                />
                {/* 컬럼 헤더와 아이콘을 span으로 묶습니다. */}
                <span>
                  {col.header}
                  {col.header === 'Traces' && <Info size={14} className={styles.infoIcon} />}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColumnVisibilityModal;