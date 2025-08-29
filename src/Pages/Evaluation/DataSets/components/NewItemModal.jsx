// src/Pages/Evaluation/DataSets/components/NewItemModal.jsx
import React, { useState, useEffect } from 'react';
import styles from '../newItemModal.module.css';
import * as api from "../datasetsApi";
import { X } from 'lucide-react';

const isValidJson = (str) => {
    if (str.trim() === '') return true; // 빈 값은 유효
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

const isNumeric = (str) => {
    if (str.trim() === '') return true; // 빈 값은 유효
    return /^-?\d+(\.\d+)?$/.test(str);
};

export default function NewItemModal({ isOpen, onClose, datasetName, onSubmitSuccess }) {
    const [input, setInput] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [metadata, setMetadata] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // 👇 오류 메시지를 객체로 관리하는 상태 추가
    const [errors, setErrors] = useState({
        input: null,
        expectedOutput: null,
        metadata: null,
    });

    const inputPlaceholder = '{\n  "question": "What is the capital of England?"\n}';
    const expectedOutputPlaceholder = '{\n  "answer": "London"\n}';
    const metadataPlaceholder = '{}';

    useEffect(() => {
        if (isOpen) {
            setInput('');
            setExpectedOutput('');
            setMetadata('');
            setErrors({ input: null, expectedOutput: null, metadata: null }); // 모든 에러 초기화
            setIsSaving(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validateAndSubmit = async () => {
        const newErrors = { input: null, expectedOutput: null, metadata: null };
        let hasError = false;

        // Input 유효성 검사
        if (!isValidJson(input)) {
            newErrors.input = 'Invalid input. Please provide a JSON object or double-quoted string.';
            hasError = true;
        }

        // Expected Output 유효성 검사
        if (!isValidJson(expectedOutput)) {
            newErrors.expectedOutput = 'Invalid input. Please provide a JSON object or double-quoted string.';
            hasError = true;
        }

        // Metadata 유효성 검사
        if (!isValidJson(metadata) && !isNumeric(metadata)) {
            newErrors.metadata = 'Invalid input. Please provide a JSON object or a number.';
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) {
            return; // 오류가 있으면 제출 중단
        }

        setIsSaving(true);

        try {
            const finalInput = input.trim() === '' ? JSON.parse(inputPlaceholder) : JSON.parse(input);
            const finalExpectedOutput = expectedOutput.trim() === '' ? JSON.parse(expectedOutputPlaceholder) : JSON.parse(expectedOutput);
            const finalMetadataStr = metadata.trim() === '' ? metadataPlaceholder : metadata;
            const parsedMetadata = isNumeric(finalMetadataStr) ? parseFloat(finalMetadataStr) : JSON.parse(finalMetadataStr);

            await api.upsertDatasetItem({
                datasetName: datasetName,
                input: finalInput,
                expectedOutput: finalExpectedOutput,
                metadata: parsedMetadata,
            });
            onSubmitSuccess();
        } catch (e) {
            setErrors({ ...newErrors, general: e.message || "Failed to add item." });
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Create new dataset item</h2>
                    <button onClick={onClose} className={styles.closeButton}><X size={20} /></button>
                </div>
                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label htmlFor="target-datasets">Target datasets</label>
                        <div className={styles.datasetTag}>{datasetName}</div>
                    </div>
                    <div className={styles.ioGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="input">Input</label>
                            <textarea id="input" className={styles.textarea} value={input} onChange={(e) => setInput(e.target.value)} rows={6} placeholder={inputPlaceholder} />
                            {/* 👇 Input 오류 메시지 표시 */}
                            {errors.input && <p className={styles.errorMessage}>{errors.input}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="expected-output">Expected output</label>
                            <textarea id="expected-output" className={styles.textarea} value={expectedOutput} onChange={(e) => setExpectedOutput(e.target.value)} rows={6} placeholder={expectedOutputPlaceholder} />
                            {/* 👇 Expected Output 오류 메시지 표시 */}
                            {errors.expectedOutput && <p className={styles.errorMessage}>{errors.expectedOutput}</p>}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="metadata">Metadata</label>
                        <textarea id="metadata" className={styles.textarea} value={metadata} onChange={(e) => setMetadata(e.target.value)} rows={4} placeholder={metadataPlaceholder} />
                        {/* 👇 Metadata 오류 메시지 표시 */}
                        {errors.metadata && <p className={styles.errorMessage}>{errors.metadata}</p>}
                    </div>
                    {/* 👇 일반적인 제출 오류 메시지 표시 */}
                    {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
                </div>
                <div className={styles.footer}>
                    <button onClick={validateAndSubmit} className={styles.submitButton} disabled={isSaving}>
                        {isSaving ? 'Adding...' : 'Add to dataset'}
                    </button>
                </div>
            </div>
        </div>
    );
}