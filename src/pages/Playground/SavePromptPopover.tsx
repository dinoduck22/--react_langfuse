// src/pages/Playground/SavePromptPopover.tsx

import React, { useState, useEffect } from 'react';
import styles from './SavePromptPopover.module.css';
import { Search, Check } from 'lucide-react';
import { fetchPrompts } from '../Prompts/promptsApi'; // API 함수 import
import { DisplayPrompt } from '../Prompts/promptTypes'; // 타입 import

interface SavePromptPopoverProps {
  onSaveAsNew: () => void;
}

const SavePromptPopover: React.FC<SavePromptPopoverProps> = ({ onSaveAsNew }) => {
  const [prompts, setPrompts] = useState<DisplayPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPrompts = await fetchPrompts();
        setPrompts(fetchedPrompts);
      } catch (err) {
        setError("Failed to load prompts.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPrompts();
  }, []);


  const handlePromptClick = (id: string) => {
    setSelectedPromptId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className={styles.popover}>
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
        {isLoading ? (
          <li>Loading...</li>
        ) : error ? (
          <li>{error}</li>
        ) : (
          prompts.map(prompt => (
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
          ))
        )}
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