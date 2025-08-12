import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './NewToolModal.module.css';

interface NewToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: (tool: any) => void; // 실제 저장 로직을 위한 prop (주석 처리)
}

const NewToolModal: React.FC<NewToolModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState(
    '{\n  "type": "object",\n  "properties": {},\n  "required": [],\n  "additionalProperties": false\n}'
  );

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    // 실제 저장 로직은 여기에 구현합니다.
    console.log({ name, description, parameters: JSON.parse(parameters) });
    alert('Tool saved! (See console for details)');
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Create LLM Tool</h2>
            <p className={styles.modalSubtitle}>Define a tool for LLM function calling</p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label htmlFor="tool-name">Name</label>
            <input
              id="tool-name"
              type="text"
              placeholder="e.g., get_weather"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tool-description">Description</label>
            <p className={styles.descriptionText}>
              This description will be sent to the LLM to help it understand the tool's purpose and functionality.
            </p>
            <textarea
              id="tool-description"
              rows={3}
              placeholder="Describe the tool's purpose and usage"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tool-parameters">Parameters (JSON Schema)</label>
            <p className={styles.descriptionText}>
              Define the structure of your tool parameters using JSON Schema format.
            </p>
            <div className={styles.codeEditorWrapper}>
              <textarea
                id="tool-parameters"
                className={styles.codeEditor}
                rows={8}
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                spellCheck="false"
              />
              <button className={styles.prettifyButton}>Prettify</button>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <span className={styles.footerNote}>
            Note: Changes to tools are reflected to all new traces of this project.
          </span>
          <div className={styles.footerActions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewToolModal;