import React, { useState, useMemo, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PromptsNew.module.css';
import { Book } from 'lucide-react';

const chatPlaceholder = `[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": "Hello {{name}}!"
  }
]`;

// 줄 번호가 있는 텍스트 에디터를 위한 재사용 컴포넌트
const LineNumberedTextarea: React.FC<{
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  minHeight?: number;
}> = ({ id, value, onChange, placeholder, minHeight = 150 }) => {
  const lineNumbers = useMemo(() => {
    const lines = value.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  }, [value]);

  return (
    <div className={styles.configEditor} style={{ minHeight: `${minHeight}px` }}>
      <div className={styles.lineNumbers}>
        {lineNumbers.map(num => <div key={num}>{num}</div>)}
      </div>
      <textarea
        id={id}
        className={styles.configTextarea}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        spellCheck="false"
      />
    </div>
  );
};

const PromptsNew: React.FC = () => {
  const navigate = useNavigate();
  const [promptName, setPromptName] = useState('');
  const [promptType, setPromptType] = useState<'Chat' | 'Text'>('Text');
  const [promptContent, setPromptContent] = useState('');
  const [promptCommit, setPromptCommit] = useState('');
  const [config, setConfig] = useState('{\n  \n}');

  const handleSave = () => {
    console.log({
      name: promptName,
      type: promptType,
      content: promptContent,
      config,
    });
    alert('새 프롬프트가 저장되었습니다. (콘솔 로그 확인)');
    navigate('/prompts');
  };

  return (
    <div className={styles.container}>
      {/* 1. 헤더 (Breadcrumbs) */}
      <div className={styles.header}>
        <Book size={16} />
        <Link to="/prompts" className={styles.breadcrumbLink}>Prompts</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>New prompt</span>
      </div>

      {/* 2. 메인 폼 */}
      <div className={styles.form}>
        {/* Name과 Type을 한 줄에 배치하기 위한 Row */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="prompt-name" className={styles.label}>Name</label>
            <p className={styles.subLabel}>
              Unique identifier for this prompt.
            </p>
            <input
              id="prompt-name"
              type="text"
              className={styles.input}
              placeholder="e.g. summarize-short-text"
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Type</label>
            <p className={styles.subLabel}>'Chat' for OpenAI chat models.</p>
            <div className={styles.typeSelector}>
              <button
                className={`${styles.typeButton} ${promptType === 'Text' ? styles.active : ''}`}
                onClick={() => setPromptType('Text')}
              >
                Text
              </button>
              
              <button
                className={`${styles.typeButton} ${promptType === 'Chat' ? styles.active : ''}`}
                onClick={() => setPromptType('Chat')}
              >
                Chat
              </button>      
            </div>
          </div>
        </div>

        {/* Prompt Content */}
        <div className={styles.formGroup}>
          <label htmlFor="prompt-content" className={styles.label}>Prompt</label>
          {/* Prompt Type에 따라 다른 에디터 렌더링 */}
          {promptType === 'Chat' ? (
             <textarea
                id="prompt-content"
                className={styles.textarea}
                placeholder={chatPlaceholder}
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
             />
          ) : (
             <LineNumberedTextarea
                id="prompt-content"
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                placeholder='Enter your text prompt here, e.g. "Summarize this: {{text}}"'
                minHeight={200}
             />
          )}
        </div>

        {/* Config 섹션 */}
        <div className={styles.formGroup}>
          <label htmlFor="prompt-config" className={styles.label}>Config</label>
          <p className={styles.subLabel}>
            Arbitrary JSON configuration that is available on the prompt. Use this to track LLM parameters, function definitions, or any other metadata.
          </p>
          <LineNumberedTextarea
            id="prompt-config"
            value={config}
            onChange={(e) => setConfig(e.target.value)}
          />
        </div>

        {/* Commit message (optional) */}
      <div className={styles.formGroup}>
        <label htmlFor="prompt-commit-message" className={styles.label}>Commit Message</label>
        <p className={styles.subLabel}>
          A brief description of the changes made.
        </p>
        <textarea
            id="commit-message"
            className={styles.textarea}
            placeholder="Addit Commit messages..."
            value={promptCommit}
            onChange={(e) => setPromptCommit(e.target.value)}
        />
      </div>
      </div>

      {/* 3. 액션 버튼 */}
      <div className={styles.actions}>
        <button className={styles.cancelButton} onClick={() => navigate('/prompts')}>
          Cancel
        </button>
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PromptsNew;