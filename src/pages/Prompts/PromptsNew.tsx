import React, { useState, useMemo, ChangeEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PromptsNew.module.css';
import { Book } from 'lucide-react';
import PromptsReference from './PromptsReference';
import ChatBox, { ChatMessage } from 'components/ChatBox/ChatBox'; // ChatBox import

// 줄 번호가 있는 텍스트 에디터를 위한 재사용 컴포넌트
const LineNumberedTextarea: React.FC<{
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  minHeight?: number;
  children?: ReactNode;
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
      {children}
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
    const [labels, setLabels] = useState({ latest: false, production: false });
    const [commitMessage, setCommitMessage] = useState('');
    const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
    
    // ... (handleLabelChange, handleInsertReference, handleSave 등 다른 핸들러는 변경 없음) ...
    
    const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setLabels(prev => ({ ...prev, [name]: checked }));
    };

    const handleInsertReference = (promptId: string) => {
        const referenceText = `{{@ ${promptId} }}`;
        if (promptType === 'Text') {
        setTextContent(prev => prev + referenceText);
        } else {
        alert(`Please manually insert ${referenceText} into the desired message.`);
        }
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
        labels: Object.keys(labels).filter(key => labels[key as keyof typeof labels]),
        commitMessage,
        });
        alert('새 프롬프트가 저장되었습니다. (콘솔 로그 확인)');
        navigate('/prompts');
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Book size={16} />
                <Link to="/prompts" className={styles.breadcrumbLink}>Prompts</Link>
                <span>/</span>
                <span className={styles.breadcrumbActive}>New prompt</span>
            </div>

            <div className={styles.form}>
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
                        {promptType === 'Chat' && (
                            <button className={styles.addReferenceButton} onClick={() => setIsReferenceModalOpen(true)}>+ AddPromptReferenct</button>
                        )}
                    </div>
                    {promptType === 'Chat' ? (
                        // 기존 chatEditor 로직을 ChatBox 컴포넌트로 대체
                        <ChatBox messages={chatContent} setMessages={setChatContent} />
                    ) : (
                        // ... Text 모드 ...
                        <LineNumberedTextarea
                        id="prompt-content"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder='Enter your text prompt here, e.g. "Summarize this: {{text}}"'
                        minHeight={200}
                        >
                        <button className={styles.addReferenceButtonInEditor} onClick={() => setIsReferenceModalOpen(true)}>+ AddPromptReferenct</button>
                        </LineNumberedTextarea>
                    )}
                </div>
                {/* ... 나머지 폼 그룹들 ... */}
                <div className={styles.formGroup}>
                    <label htmlFor="prompt-config" className={styles.label}>Config</label>
                    <p className={styles.subLabel}>Arbitrary JSON configuration that is available on the prompt...</p>
                    <LineNumberedTextarea id="prompt-config" value={config} onChange={(e) => setConfig(e.target.value)} />
                </div>

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


            {isReferenceModalOpen && (
                <PromptsReference
                    onClose={() => setIsReferenceModalOpen(false)}
                    onInsert={handleInsertReference}
                />
            )}
        </div>
    );
};

export default PromptsNew;