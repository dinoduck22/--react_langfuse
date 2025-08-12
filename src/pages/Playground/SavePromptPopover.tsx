import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import styles from './SavePromptPopover.module.css';
import { Search, Check } from 'lucide-react';

const DUMMY_PROMPTS = [
  { id: 'prompt-1', name: 'my-prompt-hy' },
  { id: 'prompt-2', name: 'summarize-text-v2' },
];

interface SavePromptPopoverProps {
  onSaveAsNew: () => void; // 부모로부터 받을 함수 prop 타입 추가
}

const SavePromptPopover: React.FC<SavePromptPopoverProps> = ({ onSaveAsNew }) => {
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  const handlePromptClick = (id: string) => {
    setSelectedPromptId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className={styles.popover}>
      {/* "Save as new prompt" 버튼에 onSaveAsNew 함수 연결 */}
      <button className={styles.primaryButton} onClick={onSaveAsNew}>
        Save as new prompt
      </button>

      <div className={styles.divider}>
        <hr />
        <span>or</span>
        <hr />
      </div>

      <div className={styles.searchBox}>
        <Search size={16} />
        <input type="text" placeholder="Search chat prompts..." />
      </div>

      <ul className={styles.promptList}>
        {DUMMY_PROMPTS.map(prompt => (
          <li
            key={prompt.id}
            className={styles.promptItem}
            onClick={() => handlePromptClick(prompt.id)}
          >
            {selectedPromptId === prompt.id ? (
              <Check size={16} className={styles.checkIcon} />
            ) : (
              <div className={styles.checkIconPlaceholder} />
            )}
            {prompt.name}
          </li>
        ))}
      </ul>

      <button
        className={styles.secondaryButton}
        disabled={!selectedPromptId}
      >
        Save as new prompt version
      </button>
    </div>
  );
};

export default SavePromptPopover;