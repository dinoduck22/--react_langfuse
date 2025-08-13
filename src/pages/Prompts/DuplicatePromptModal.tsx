import React, { useState } from 'react';
import styles from './DuplicatePromptModal.module.css';
import { X } from 'lucide-react';

interface DuplicatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string, copyAll: boolean) => void;
  currentName: string;
  currentVersion: number;
}

const DuplicatePromptModal: React.FC<DuplicatePromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentName,
  currentVersion,
}) => {
  const [newName, setNewName] = useState(`${currentName}-copy`);
  const [copyAll, setCopyAll] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onSubmit(newName.trim(), copyAll);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <h2 className={styles.title}>Duplicate prompt</h2>
            <button type="button" onClick={onClose} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label htmlFor="new-prompt-name">Name</label>
              <input
                id="new-prompt-name"
                type="text"
                className={styles.input}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.formGroup}>
              <label>Settings</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="copy-option"
                    checked={!copyAll}
                    onChange={() => setCopyAll(false)}
                  />
                  <span>Copy only version {currentVersion}</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="copy-option"
                    checked={copyAll}
                    onChange={() => setCopyAll(true)}
                  />
                  <span>Copy all prompt versions and labels</span>
                </label>
              </div>
            </div>
          </div>
          {/* footer 수정: Cancel 버튼 제거 */}
          <div className={styles.footer}>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DuplicatePromptModal;