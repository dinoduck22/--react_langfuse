import React, { useState, useMemo, useEffect, useCallback } from 'react';
// 🚫 useParams 훅을 더 이상 사용하지 않으므로 삭제합니다.
// import { useParams } from 'react-router-dom'; 
import { Info, Plus, Clipboard, Trash2, Copy, X } from 'lucide-react';
import { getApiKeys, createApiKey, deleteApiKey, ApiKey } from './ApiKeysApi';
import commonStyles from "./layout/SettingsCommon.module.css";
import apiKeyStyles from "./layout/Apikeys.module.css";
import { getCodeSnippets } from './codeSnippets';

const ApiKeys: React.FC = () => {
    // 🚫 useParams 훅 대신 import.meta.env에서 projectId를 직접 가져옵니다.
    const projectId = import.meta.env.VITE_LANGFUSE_PROJECT_ID;

    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newKeyDetails, setNewKeyDetails] = useState<ApiKey | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Python');
    const [isLoading, setIsLoading] = useState(true); // 컴포넌트가 로드될 때 true로 시작
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const host = import.meta.env.VITE_LANGFUSE_BASE_URL || "http://localhost:3000";

    const fetchApiKeys = useCallback(async (currentProjectId: string) => {
        if (!currentProjectId) {
            setError('Project ID가 .env 파일에 설정되지 않았습니다.');
            setIsLoading(false);
            return;
        }
        try {
            setError(null);
            setIsLoading(true);
            const fetchedKeys = await getApiKeys(currentProjectId);
            setApiKeys(fetchedKeys);
        } catch (err) {
            console.error('Failed to fetch API keys:', err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // 컴포넌트 마운트 시 projectId를 사용하여 API 키를 불러옵니다.
        fetchApiKeys(projectId);
    }, [projectId, fetchApiKeys]);

    const codeSnippets = useMemo(() => {
        if (!newKeyDetails?.secretKey) {
            return {};
        }

        return getCodeSnippets({
            publicKey: newKeyDetails.publicKey,
            secretKey: newKeyDetails.secretKey,
            host: host,
        });
    }, [newKeyDetails, host]);

    const copyToClipboard = (text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            alert('복사되었습니다.');
        });
    };

    const handleCreateNewKey = async () => {
        if (!projectId) {
            alert('Project ID가 .env 파일에 설정되지 않았습니다.');
            return;
        }
        setIsCreating(true);
        try {
            const newKey = await createApiKey(projectId, null);
            setNewKeyDetails(newKey);
            setIsModalOpen(true);
            await fetchApiKeys(projectId);
        } catch (error) {
            console.error('Failed to create API key:', error);
            alert(`API 키 생성에 실패했습니다.: ${ error instanceof Error ? error.message : String(error) }`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteKey = async (publicKeyToDelete: string) => {
        if (window.confirm("정말로 이 API 키를 삭제하시겠습니까?")) {
            if (!projectId) return;
            try {
                await deleteApiKey(projectId, publicKeyToDelete);
                alert('API 키가 삭제되었습니다.');
                await fetchApiKeys(projectId);
            } catch (error) {
                console.error('Failed to delete API key:', error);
                alert(`API 키 삭제에 실패했습니다: ${ error instanceof Error ? error.message : String(error) }`);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewKeyDetails(null);
    };

    if (isLoading) {
        return <div className={commonStyles.container}>Loading API Keys...</div>;
    }

    if (error) {
        return <div className={commonStyles.container} style={{ color: 'red' }}>Error: {error}</div>;
    }

    // ... (나머지 JSX 렌더링 부분은 동일)
    return (
        <div className = { commonStyles.container }>
            { /* Host Name Section */ }
            <header className = { commonStyles.header }>
                <h3 className = { commonStyles.title }>
                    Project API Keys <Info size = { 12 } />
                </h3>
            </header>

            <main className = { commonStyles.content }>
                <div className = { commonStyles.keyList }>
                    <div className = { `${ commonStyles.keyRow } ${ commonStyles.keyHeader }` }>
                        <div>Created</div>
                        <div>Note</div>
                        <div>Public Key</div>
                        <div>Secret Key</div>
                        <div>Actions</div>
                    </div>

                    { apiKeys.map(key => (
                        <div key = { key.id } className = { commonStyles.keyRow }>
                            <div>{ new Date(key.createdAt).toLocaleDateString() }</div>
                            <div className = { apiKeyStyles.note }>{ key.note || 'Click to add note' }</div>
                            <div>
                                <div className = { apiKeyStyles.publicKeyCell }>
                                    <span>{ key.publicKey }</span>
                                    <button onClick = { () => copyToClipboard(key.publicKey) } className = { apiKeyStyles.copyButton }>
                                        <Clipboard size = { 14 } />
                                    </button>
                                </div>
                            </div>
                            <div className = { apiKeyStyles.secreatKeyCell }>{ key.displaySecretKey }</div>
                            <div>
                                <button onClick = { () => handleDeleteKey(key.publicKey) } className = { apiKeyStyles.deleteButton }>
                                    <Trash2 size = { 14 } />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <button onClick = { handleCreateNewKey } className = { commonStyles.createButton } disabled = { isCreating || !projectId }>
                { isCreating ? 'Creating...' : <><Plus size = { 16 } /> Create new API keys</> }
            </button>

            {isModalOpen && newKeyDetails && (
                <div className = { apiKeyStyles.modalOverlay }>
                    <div className = { apiKeyStyles.modalContent }>
                        <div className = { apiKeyStyles.modalHeader }>
                            <h2 className = { apiKeyStyles.modalTitle }>API Keys</h2>
                            <button onClick = { handleCloseModal } className = { apiKeyStyles.closeButton }><X size = { 20 } /></button>
                        </div>

                        <div className = { apiKeyStyles.section }>
                            <h3 className = { apiKeyStyles.sectionTitle }>Secret Key</h3>
                            <p className = { apiKeyStyles.sectionDescription }>This key can only be viewed once. You can always create new keys in the project settings.</p>
                            <div className = { apiKeyStyles.inputWrapper }>
                                <input value = { newKeyDetails.secretKey || '' } readOnly className = { apiKeyStyles.input } />
                                <button onClick = { () => copyToClipboard(newKeyDetails.secretKey ?? null) } className = { apiKeyStyles.copyButtonInInput }><Copy size = { 16 } /></button>
                            </div>
                        </div>

                        <div className = { apiKeyStyles.section }>
                            <h3 className = { apiKeyStyles.sectionTitle }>Public Key</h3>
                            <div className = { apiKeyStyles.inputWrapper }>
                                <input value = { newKeyDetails.publicKey } readOnly className = { apiKeyStyles.input } />
                                <button onClick = { () => copyToClipboard(newKeyDetails.publicKey) } className = { apiKeyStyles.copyButtonInInput }><Copy size = { 16 } /></button>
                            </div>
                        </div>

                        <div className = { apiKeyStyles.section }>
                            <h3 className = { apiKeyStyles.sectionTitle }>Host</h3>
                            <div className = { apiKeyStyles.inputWrapper }>
                                <input value = { host } readOnly className = { apiKeyStyles.input } />
                                <button onClick = { () => copyToClipboard(host) } className = { apiKeyStyles.copyButtonInInput }><Copy size = { 16 } /></button>
                            </div>
                        </div>

                        <div className = { apiKeyStyles.section }>
                            <h3 className = { apiKeyStyles.sectionTitle }>Usage</h3>
                            <div className = { apiKeyStyles.tabsContainer }>
                                { Object.keys(codeSnippets).map(tab => (
                                    <button
                                        key = { tab }
                                        onClick = { () => setActiveTab(tab) }
                                        className = { `${ apiKeyStyles.tabButton } ${ activeTab === tab ? apiKeyStyles.tabActive : '' }` }
                                    >
                                        { tab }
                                    </button>
                                    ))}
                            </div>
                            <div className = { apiKeyStyles.codeBlockWrapper }>
                                <pre className = { apiKeyStyles.codeBlock }>
                                    <code>{ codeSnippets[activeTab] }</code>
                                </pre>
                                <button onClick = { () => copyToClipboard(codeSnippets[activeTab])} className = { apiKeyStyles.copyButtonInCode }>
                                    <Copy size = { 16 } />
                                </button>
                            </div>
                        </div>
                        <p className = { apiKeyStyles.footerLinks }>
                            See <a href="#">Quickstart</a> and <a href="#">Python docs</a> for more details and an end-to-end example.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;