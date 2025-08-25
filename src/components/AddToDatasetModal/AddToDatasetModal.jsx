import React from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
// '.moduel.css'가 아닌 '.module.css'인지 확인해주세요.
import styles from './AddToDatasetModal.module.css';
import CodeBlock from '../CodeBlock/CodeBlock';

const AddToDatasetModal = ({ isOpen, onClose, input, output, metadata }) => {
  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    console.log('Adding to dataset...');
    // 실제 저장 로직을 여기에 추가할 수 있습니다.
    onClose();
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add to datasets</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label htmlFor="datasets-select">Datasets</label>
            <div className={styles.selectWrapper}>
              <select id="datasets-select" className={styles.select}>
                <option>Select datasets</option>
                {/* 필요시 데이터셋 옵션을 추가합니다. */}
              </select>
              <ChevronDown size={16} className={styles.selectArrow} />
            </div>
          </div>

          <div className={styles.ioGrid}>
            <div className={styles.ioColumn}>
              <label>Input</label>
              <CodeBlock code={input} />
            </div>
            <div className={styles.ioColumn}>
              <label>Expected output</label>
              <CodeBlock code={output} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Metadata</label>
            <CodeBlock code={metadata} />
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleSave} className={styles.saveButton}>
            Add to dataset
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddToDatasetModal;