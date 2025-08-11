import React, { useState, useMemo, ChangeEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PromptsNew.module.css';
import { Book, GripVertical, X } from 'lucide-react';

// Chat 메시지 타입을 위한 인터페이스 정의
interface ChatMessage {
  id: number;
  role: 'System' | 'User' | 'Developer' | 'Assistant' | 'Placeholder';
  content: string;
}

// 줄 번호가 있는 텍스트 에디터를 위한 재사용 컴포넌트
const LineNumberedTextarea: React.FC<{
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  minHeight?: number;
  children?: ReactNode; // ✅ 자식 요소를 받을 수 있도록 children prop 추가
}> = ({ id, value, onChange, placeholder, minHeight = 150, children }) => {
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
      {children} {/* 자식 요소(버튼) 렌더링 */}
    </div>
  );
};

const PromptsNew: React.FC = () => {
  const navigate = useNavigate();
  const [promptName, setPromptName] = useState('');
  const [promptType, setPromptType] = useState<'Chat' | 'Text'>('Chat');
  const [chatContent, setChatContent] = useState<ChatMessage[]>([
    { id: 1, role: 'System', content: 'You are a helpful assistant.' },
  ]);
  const [textContent, setTextContent] = useState('');
  const [config, setConfig] = useState('{\n  \n}');
  
  // ✅ Labels 상태를 객체로 변경
  const [labels, setLabels] = useState({ latest: false, production: false });
  const [commitMessage, setCommitMessage] = useState('');

  // ✅ Labels 체크박스 핸들러
  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setLabels(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddMessage = () => {
    const newMessage: ChatMessage = { id: Date.now(), role: 'User', content: '' };
    setChatContent([...chatContent, newMessage]);
  };

  const handleAddPlaceholder = () => {
    const newPlaceholder: ChatMessage = { id: Date.now(), role: 'Placeholder', content: '' };
    setChatContent([...chatContent, newPlaceholder]);
  };

  const handleRemoveMessage = (id: number) => {
    setChatContent(chatContent.filter(msg => msg.id !== id));
  };

  const handleMessageChange = (id: number, field: 'role' | 'content', value: string) => {
    setChatContent(chatContent.map(msg =>
      msg.id === id ? { ...msg, [field]: value as ChatMessage['role'] } : msg
    ));
  };

  const handleSave = () => {
    const finalPromptContent = promptType === 'Chat'
      ? JSON.stringify(chatContent.map(({ role, content }) => ({ role: role.toLowerCase(), content })), null, 2)
      : textContent;

    console.log({
      name: promptName,
      type: promptType,
      content: finalPromptContent,
      config,
      labels: Object.keys(labels).filter(key => labels[key as keyof typeof labels]), // 체크된 라벨만 배열로 변환
      commitMessage,
    });
    alert('새 프롬프트가 저장되었습니다. (콘솔 로그 확인)');
    navigate('/prompts');
  };

  return (
    <div className={styles.container}>
      {/* ... 헤더 부분 (변경 없음) ... */}
      <div className={styles.header}>
        <Book size={16} />
        <Link to="/prompts" className={styles.breadcrumbLink}>Prompts</Link>
        <span>/</span>
        <span className={styles.breadcrumbActive}>New prompt</span>
      </div>

      <div className={styles.form}>
        {/* ... Name, Prompt/Type 그룹 ... */}
        <div className={styles.formGroup}>
          <label htmlFor="prompt-name" className={styles.label}>Name</label>
          <p className={styles.subLabel}>Unique identifier for this prompt.</p>
          <input id="prompt-name" type="text" className={styles.input} placeholder="e.g. summarize-short-text" value={promptName} onChange={(e) => setPromptName(e.target.value)} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="prompt-content" className={styles.label}>Prompt</label>
          <div className={styles.promptHeader}>
            <div className={styles.typeSelector}>
              <button className={`${styles.typeButton} ${promptType === 'Chat' ? styles.active : ''}`} onClick={() => setPromptType('Chat')}>Chat</button>
              <button className={`${styles.typeButton} ${promptType === 'Text' ? styles.active : ''}`} onClick={() => setPromptType('Text')}>Text</button>
            </div>
            {/* Chat 모드일 때만 버튼 표시 */}
            {promptType === 'Chat' && (
              <button className={styles.addReferenceButton}>+ AddPromptReferenct</button>
            )}
          </div>
          {promptType === 'Chat' ? (
            <div className={styles.chatEditor}>
              {chatContent.map((msg) => (
                <div key={msg.id} className={styles.messageRow}>
                  <GripVertical className={styles.dragHandle} size={18} />
                  {msg.role === 'Placeholder' ? (
                    <span className={styles.placeholderRole}>Placeholder</span>
                  ) : (
                    <select className={styles.roleSelect} value={msg.role} onChange={(e) => handleMessageChange(msg.id, 'role', e.target.value)}>
                      <option>System</option>
                      <option>User</option>
                      <option>Developer</option>
                      <option>Assistant</option>
                    </select>
                  )}
                  <textarea className={styles.messageTextarea} placeholder={msg.role === 'Placeholder' ? 'Enter placeholder content' : 'Enter a message'} value={msg.content} onChange={(e) => handleMessageChange(msg.id, 'content', e.target.value)} rows={1} />
                  <button className={styles.removeButton} onClick={() => handleRemoveMessage(msg.id)}><X size={16} /></button>
                </div>
              ))}
              <div className={styles.chatActions}>
                <button className={styles.addMessageButton} onClick={handleAddMessage}>+ Add Message</button>
                <button className={styles.addMessageButton} onClick={handleAddPlaceholder}>+ Placeholder</button>
              </div>
            </div>
          ) : (
            // Text 모드일 때, LineNumberedTextarea 안에 버튼을 자식으로 전달
            <LineNumberedTextarea
              id="prompt-content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder='Enter your text prompt here, e.g. "Summarize this: {{text}}"'
              minHeight={200}
            >
              <button className={styles.addReferenceButtonInEditor}>+ AddPromptReferenct</button>
            </LineNumberedTextarea>
          )}
        </div>
        
        {/* ... Config 섹션 (변경 없음) ... */}
        <div className={styles.formGroup}>
            <label htmlFor="prompt-config" className={styles.label}>Config</label>
            <p className={styles.subLabel}>Arbitrary JSON configuration that is available on the prompt...</p>
            <LineNumberedTextarea id="prompt-config" value={config} onChange={(e) => setConfig(e.target.value)} />
        </div>

        {/* Labels 섹션을 체크박스로 수정 */}
        <div className={styles.formGroup}>
            <label className={styles.label}>Labels</label>
            <p className={styles.subLabel}>Apply labels to the new version to organize your prompts.</p>
            <div className={styles.labelsContainer}>
              <label className={styles.checkboxWrapper}>
                <input type="checkbox" name="production" checked={labels.production} onChange={handleLabelChange} />
                <span>Set the "Production" label</span>
              </label>
            </div>
        </div>

        {/* Commit Message */}
        <div className={styles.formGroup}>
            <label htmlFor="prompt-commit-message" className={styles.label}>Commit Message</label>
            <p className={styles.subLabel}>Optional message to describe the changes in this version.</p>
            <input id="prompt-commit-message" type="text" className={styles.input} placeholder="e.g. fix typo in system prompt" value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.cancelButton} onClick={() => navigate('/prompts')}>Cancel</button>
        <button className={styles.saveButton} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default PromptsNew;