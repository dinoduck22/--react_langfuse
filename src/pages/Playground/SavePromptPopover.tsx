import { useState } from 'react';
import styles from './SavePromptPopover.module.css';
import { Search, Check } from 'lucide-react';

// 컴포넌트 내부에 임시 데이터 추가
const DUMMY_PROMPTS = [
  { id: 'prompt-1', name: 'my-prompt-hy' },
  { id: 'prompt-2', name: 'summarize-text-v2' },
];

const SavePromptPopover = () => {
  // 선택된 프롬프트의 ID를 저장할 state
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  // 프롬프트 아이템 클릭 핸들러
  const handlePromptClick = (id: string) => {
    // 이미 선택된 아이템을 다시 클릭하면 선택 해제, 아니면 선택
    setSelectedPromptId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className={styles.popover}>
      <button className={styles.primaryButton}>Save as new prompt</button>

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
            {/* 선택된 경우에만 Check 아이콘 표시 */}
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
        // selectedPromptId가 없으면 disabled 처리
        disabled={!selectedPromptId}
      >
        Save as new prompt version
      </button>
    </div>
  );
};

export default SavePromptPopover;