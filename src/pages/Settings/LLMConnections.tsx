import React, { useState } from 'react';
import Modal from '../../components/Modal/Modal'
import NewLLMConnectionForm from "./form/NewLLMConnectionsForm";
import styles from "./layout/SettingsCommon.module.css";
import llmstyles from './layout/LLMConnections.module.css';
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Connection {
    id: string;
    provider: string;
    adapter: string;
    baseUrl: string;
    apiKey: string;
}

const LLMConnections = () => {

    const [connections, setConnections] = useState<Connection[]>([
        {
            id: '1',
            provider: 'gemini',
            adapter: 'google-ai-studio',
            baseUrl: 'default',
            apiKey: '...-7IM',
        },
        {
            id: '2',
            provider: 'chatgpt',
            adapter: 'openai',
            baseUrl: 'default',
            apiKey: '...-7IM',
        },
        {
            id: '3',
            provider: 'claude',
            adapter: 'anthropic',
            baseUrl: 'default',
            apiKey: '...-7IM',
        },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveConnection = (newConnectionData: {
        adapter: string;
        provider: string;
        apiKey: string;
        baseUrl?: string;
    }) => {
        const connectionWithId = {
            id: crypto.randomUUID(),
            provider: newConnectionData.provider,
            adapter: newConnectionData.adapter,
            baseUrl: newConnectionData.baseUrl || 'default',
            apiKey: `...${ newConnectionData.apiKey.slice(-3) }`,
        };
        setConnections([...connections, connectionWithId]);
        setIsModalOpen(false);
    }

    return (
        <div className = { styles.container }>
            { /* Host Name Section */ }
            <h3 className = { styles.title }>LLM Connections </h3>
            <p>Connect your LLM services to enable evaluations and playground features. Your provider will charge based on usage.</p>

            <div className = { styles.keyList }>
                <div className = { `${ styles.keyRow } ${ styles.keyHeader }` }>
                    <span>Provider</span>
                    <span>Adapter</span>
                    <span>Base URL</span>
                    <span>API Key</span>
                    <span style = {{ textAlign: 'center' }}>Actions</span>
                </div>
                { connections.map((conn) => (
                    <div key = { conn.id } className = { styles.keyRow }>
                        <span>{ conn.provider }</span>
                        <span>{ conn.adapter }</span>
                        <span>{ conn.baseUrl }</span>
                        <span>{ conn.apiKey }</span>
                        <div className = { llmstyles.actions }>
                            <button title = "Edit"><Pencil size = { 16 } />️</button>
                            <button title = "Delete"><Trash2 size = { 16 } /></button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick = { () => setIsModalOpen(true) } className = { styles.createButton }>
                <Plus size = { 16 } /> Add LLM Connection
            </button>

            <Modal
                title = "New LLM Connection"
                isOpen = { isModalOpen }
                onClose = { () => setIsModalOpen(false) }
            >
                <NewLLMConnectionForm
                    onSave = { handleSaveConnection }
                />
            </Modal>
        </div>
    );
};

export default LLMConnections;