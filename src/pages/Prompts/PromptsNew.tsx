import React, { useState, useMemo } from 'react';
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

const PromptsNew: React.FC = () => {
  const navigate = useNavigate();
  const [promptName, setPromptName] = useState('');
  const [promptType, setPromptType] = useState<'Text' | 'Chat'>('Text');
  const [promptContent, setPromptContent] = useState('');
  const [config, setConfig] = useState('{\n  \n}'); // Config 상태 추가 및 기본값 설정

  // Config 텍스트의 줄 수를 계산
  const lineNumbers = useMemo(() => {
    const lines = config.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  }, [config]);

  const handleSave = () => {
    // 실제 저장 로직은 여기에 구현합니다.
    console.log({
      name: promptName,
      type: promptType,
      content: promptContent,
      config, // 저장 객체에 config 포함
    });
    alert('새 프롬프트가 저장되었습니다. (콘솔 로그 확인)');
    navigate('/prompts'); // 저장 후 목록 페이지로 이동
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
        {/* Name Input */}
        <div className={styles.formGroup}>
          <label htmlFor="prompt-name" className={styles.label}>Name</label>
          <p className={styles.subLabel}>
            Unique identifier for this prompt. Use dot-notation for grouping (e.g. "chat.summarization").
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

        {/* Type Selector */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Type</label>
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

        {/* Prompt Content */}
        <div className={styles.formGroup}>
          <label htmlFor="prompt-content" className={styles.label}>Prompt</label>
          <p className={styles.subLabel}>
            Define your prompt template. You can use variables to insert variables into your prompt. Note: Variables must be alphabetical characters or underscores. You can also link other text prompts using the plus button.
          </p>
          <textarea
            id="prompt-content"
            className={styles.textarea}
            placeholder={promptType === 'Chat' ? chatPlaceholder : 'Enter your text prompt here, e.g. "Summarize this: {{text}}"'}
            value={promptContent}
            onChange={(e) => setPromptContent(e.target.value)}
          />
        </div>

        {/* Config 섹션 추가 */}
        <div className={styles.formGroup}>
            <label htmlFor="prompt-config" className={styles.label}>Config</label>
            <p className={styles.subLabel}>
                Arbitrary JSON configuration that is available on the prompt. Use this to track LLM parameters, function definitions, or any other metadata.
            </p>
            <div className={styles.configEditor}>
                <div className={styles.lineNumbers}>
                    {lineNumbers.map(num => <div key={num}>{num}</div>)}
                </div>
                <textarea
                    id="prompt-config"
                    className={styles.configTextarea}
                    value={config}
                    onChange={(e) => setConfig(e.target.value)}
                    spellCheck="false"
                />
            </div>
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