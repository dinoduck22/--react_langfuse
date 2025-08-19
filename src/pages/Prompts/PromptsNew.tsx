import React, { useState, ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PromptsNew.module.css';
import { Book } from 'lucide-react';
import PromptsReference from './PromptsReference';
import ChatBox, { ChatMessage } from 'components/ChatBox/ChatBox';
import LineNumberedTextarea from 'components/LineNumberedTextarea/LineNumberedTextarea';
import FormPageLayout from 'components/Layouts/FormPageLayout';
import FormGroup from 'components/Form/FormGroup';
import { langfuse } from 'lib/langfuse';
import { AxiosError } from 'axios';

const PromptsNew: React.FC = () => {
    const navigate = useNavigate();
    const [promptName, setPromptName] = useState('');
    const [promptType, setPromptType] = useState<'Chat' | 'Text'>('Chat');
    const [chatContent, setChatContent] = useState<ChatMessage[]>([
        { id: Date.now(), role: 'System', content: 'You are a helpful assistant.' },
    ]);
    const [textContent, setTextContent] = useState('');
    const [config, setConfig] = useState('{\n  "temperature": 1\n}');
    const [labels, setLabels] = useState({ production: false });
    const [commitMessage, setCommitMessage] = useState('');
    const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
    const [variables, setVariables] = useState<string[]>([]);

    useEffect(() => {
        const extractVariables = (text: string): string[] => {
            const regex = /{{\s*(\w+)\s*}}/g;
            const matches = text.match(regex) || [];
            return matches.map(match => match.replace(/[{}]/g, '').trim());
        };

        let allVars: string[] = [];
        if (promptType === 'Text') {
            allVars = extractVariables(textContent);
        } else {
            const chatVars = chatContent.flatMap(msg => extractVariables(msg.content));
            allVars = [...chatVars];
        }

        setVariables([...new Set(allVars)]);
    }, [textContent, chatContent, promptType]);


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
    
    // Save 버튼 클릭 시 API 호출 로직
    const handleSave = async () => {
        try {
            const activeLabels = Object.entries(labels)
              .filter(([, isActive]) => isActive)
              .map(([label]) => label);
            
            const commonPayload = {
                name: promptName,
                config: JSON.parse(config),
                labels: activeLabels,
                commitMessage: commitMessage || null,
            };

            if (promptType === 'Chat') {
                const chatPromptData = chatContent
                    .filter(msg => msg.role !== 'Placeholder')
                    .map(({ role, content }) => ({ 
                        type: 'chatmessage' as const,
                        role: role.toLowerCase() as 'system' | 'user' | 'assistant',
                        content 
                    }));

                await langfuse.api.promptsCreate({
                    ...commonPayload,
                    type: 'chat',
                    prompt: chatPromptData,
                });
            } else { // 'Text'
                await langfuse.api.promptsCreate({
                    ...commonPayload,
                    type: 'text',
                    prompt: textContent,
                });
            }

            alert('새 프롬프트가 성공적으로 저장되었습니다.');
            navigate('/prompts');
        } catch (err) {
            console.error("Failed to save prompt:", err);
            if (err instanceof AxiosError) {
                alert(`프롬프트 저장에 실패했습니다: ${err.response?.data?.message || err.message}`);
            } else {
                alert(`프롬프트 저장에 실패했습니다: ${String(err)}`);
            }
        }
    };
    
    const breadcrumbs = (
        <>
          <Book size={16} />
          <Link to="/prompts">Prompts</Link>
          <span>/</span>
          <span className="active">New prompt</span>
        </>
    );

    return (
        <FormPageLayout
            breadcrumbs={breadcrumbs}
            onSave={handleSave}
            onCancel={() => navigate('/prompts')}
            isSaveDisabled={!promptName.trim()}
        >
            <FormGroup
                htmlFor="prompt-name"
                label="Name"
                subLabel="Unique identifier for this prompt."
            >
                <input id="prompt-name" type="text" className="form-input" placeholder="e.g. summarize-short-text" value={promptName} onChange={(e) => setPromptName(e.target.value)} />
            </FormGroup>
            
            <FormGroup
                htmlFor="prompt-content"
                label="Prompt"
                subLabel="Define your prompt template."
            >
                 <div className={styles.promptHeader}>
                    <div className={styles.typeSelector}>
                        <button className={`${styles.typeButton} ${promptType === 'Chat' ? styles.active : ''}`} onClick={() => setPromptType('Chat')}>Chat</button>
                        <button className={`${styles.typeButton} ${promptType === 'Text' ? styles.active : ''}`} onClick={() => setPromptType('Text')}>Text</button>
                    </div>
                    {promptType === 'Text' && (
                        <button className={styles.addReferenceButton} onClick={() => setIsReferenceModalOpen(true)}>+ Add prompt reference</button>
                    )}
                </div>
                {promptType === 'Chat' ? (
                    <ChatBox messages={chatContent} setMessages={setChatContent} />
                ) : (
                    <LineNumberedTextarea
                        id="prompt-content"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder='Enter your text prompt here, e.g. "Summarize this: {{text}}"'
                        minHeight={200}
                    >
                         <button className={styles.addReferenceButtonInEditor} onClick={() => setIsReferenceModalOpen(true)}>+ Add prompt reference</button>
                    </LineNumberedTextarea>
                )}
                {variables.length > 0 && (
                    <div className={styles.variablesContainer}>
                        <span className={styles.variablesLabel}>VARIABLES:</span>
                        {variables.map((variable, index) => (
                            <span key={index} className={styles.variableTag}>
                                {variable}
                            </span>
                        ))}
                    </div>
                )}
            </FormGroup>

            <FormGroup
                htmlFor="prompt-config"
                label="Config"
                subLabel="Arbitrary JSON configuration that is available on the prompt."
            >
                <LineNumberedTextarea id="prompt-config" value={config} onChange={(e) => setConfig(e.target.value)} />
            </FormGroup>

            <FormGroup
                htmlFor="labels"
                label="Labels"
                subLabel="Apply labels to the new version to organize your prompts."
            >
                <div className={styles.labelsContainer}>
                    <label className={styles.checkboxWrapper}>
                        <input type="checkbox" name="production" checked={labels.production} onChange={handleLabelChange} />
                        <span>Set the "Production" label</span>
                    </label>
                </div>
            </FormGroup>

            <FormGroup
                htmlFor="prompt-commit-message"
                label="Commit Message"
                subLabel="Optional message to describe the changes in this version."
            >
                <input id="prompt-commit-message" type="text" className="form-input" placeholder="e.g. fix typo in system prompt" value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} />
            </FormGroup>

            {isReferenceModalOpen && (
                <PromptsReference
                    onClose={() => setIsReferenceModalOpen(false)}
                    onInsert={handleInsertReference}
                />
            )}
        </FormPageLayout>
    );
};

export default PromptsNew;