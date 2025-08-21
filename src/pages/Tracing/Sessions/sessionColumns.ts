// src/pages/Tracing/sessionColumns.ts
import { Column, SessionData } from '../types';

// 테이블과 모달에서 사용할 컬럼 목록을 정의합니다.
// Column 타입을 사용할 때 어떤 데이터 타입에 대한 컬럼인지 명시해줍니다. (Column -> Column<SessionData>)
export const sessionTableColumns: Column<SessionData>[] = [
    { key: 'id', header: 'ID', visible: true },
    { key: 'createdAt', header: 'Created At', visible: true },
    { key: 'duration', header: 'Duration', visible: true },
    { key: 'environment', header: 'Environment', visible: true },
    { key: 'userIds', header: 'User IDs', visible: true },
    { key: 'traces', header: 'Traces', visible: true },
    { key: 'inputCost', header: 'Input Cost', visible: true },
    { key: 'outputCost', header: 'Output Cost', visible: true },
    { key: 'totalCost', header: 'Total Cost', visible: true },
    { key: 'inputTokens', header: 'Input Tokens', visible: true },
    { key: 'outputTokens', header: 'Output Tokens', visible: true },
    { key: 'totalTokens', header: 'Total Tokens', visible: true },
    { key: 'usage', header: 'Usage', visible: true },
    { key: 'traceTags', header: 'Trace Tags', visible: true },
    // Scores 컬럼 정의 추가
    { key: '# Conciseness-V1 (Eval)', header: '# Conciseness-V1 (Eval)', visible: false },
    { key: '# Contains-Pii (Eval)', header: '# Contains-Pii (Eval)', visible: false },
    { key: '# Contextrelevance (Eval)', header: '# Contextrelevance (Eval)', visible: false },
    { key: '# Hallucination (Eval)', header: '# Hallucination (Eval)', visible: false },
    { key: '# Helpfulness (Eval)', header: '# Helpfulness (Eval)', visible: false },
    { key: '# Is Exclamation (Eval)', header: '# Is Exclamation (Eval)', visible: false },
    { key: '# Is_question (Eval)', header: '# Is_question (Eval)', visible: false },
    { key: '# Language-Detector (Eval)', header: '# Language-Detector (Eval)', visible: false },
    { key: '# Toxicity-V2 (Eval)', header: '# Toxicity-V2 (Eval)', visible: false },
    { key: '# User-Feedback (Api)', header: '# User-Feedback (Api)', visible: false },

];

// ColumnVisibilityModal에 표시될 컬럼들의 순서를 정의합니다.
export const columnOrderInModal: (keyof SessionData)[] = [
    'createdAt', 
    'duration', 
    'environment', 
    'userIds', 
    'traces', 
    'inputCost',
    'outputCost', 
    'totalCost', 
    'inputTokens', 
    'outputTokens', 
    'totalTokens',
    'usage', 
    'traceTags'
];

// Scores 관련 컬럼 키 목록을 추가하고 export 합니다.
export const scoreColumnKeys: (keyof SessionData)[] = [
    '# Conciseness-V1 (Eval)',
    '# Contains-Pii (Eval)',
    '# Contextrelevance (Eval)',
    '# Hallucination (Eval)',
    '# Helpfulness (Eval)',
    '# Is Exclamation (Eval)',
    '# Is_question (Eval)',
    '# Language-Detector (Eval)',
    '# Toxicity-V2 (Eval)',
    '# User-Feedback (Api)',
];