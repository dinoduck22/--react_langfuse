import React from "react";
import { X } from "lucide-react";
import styles from "./NewLlmConnectionModal.module.css";

// Props 타입 정의
interface NewLlmConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewLlmConnectionModal: React.FC<NewLlmConnectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleCreateConnection = () => {
    // 실제 생성 로직은 여기에 추가합니다.
    alert("Connection created! (Placeholder)");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>New LLM Connection</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label htmlFor="provider-name">Provider name</label>
            <p>Name to identify the key within Langfuse.</p>
            <input id="provider-name" type="text" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="llm-adapter">LLM adapter</label>
            <p>Schema that is accepted at that provider endpoint.</p>
            <select id="llm-adapter" defaultValue="openai">
                <option value="openai">openai</option>
                <option value="anthropic">anthropic</option>
                <option value="azure">azure</option>
              {/* 다른 옵션들을 여기에 추가할 수 있습니다 */}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="api-key">API Key</label>
            <p>Your API keys are stored encrypted on our servers.</p>
            <input id="api-key" type="password" />
          </div>
          <a href="#" className={styles.advancedLink}>
            Show advanced settings
          </a>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.createButton}
            onClick={handleCreateConnection}
          >
            Create connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewLlmConnectionModal;