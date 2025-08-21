// src/data/dummySessionDetailData.ts
export interface Score {
    name: string;
    value: number;
}

export interface TraceItem {
    id: string;
    status: 'positive' | 'neutral' | 'negative';
    // any 타입을 Record<string, string>으로 수정하여
    // 문자열 키와 문자열 값을 갖는 객체임을 명시합니다.
    input: Record<string, string>;
    output: string;
    summary: string;
    timestamp: Date;
    scores: Score[];
}

export interface SessionDetailData {
    id: string;
    userId: string;
    traceCount: number;
    totalCost: number;
    traces: TraceItem[];
}

// 데이터의 input 필드 타입에 맞게 수정합니다.
export const DUMMY_SESSION_DETAILS: SessionDetailData = {
    id: 'if.docs.conversation.O0MPX3B',
    userId: 'u-8XBcMbnE',
    traceCount: 2,
    totalCost: 0.000158,
    traces: [
        {
            id: '6c51dc57-bda7-4011-9363-d083d1d237a2',
            status: 'positive',
            input: { "Hi": "" },
            output: "Hello! how can I assist you today? If you have any questions about Langfuse, I'm here to help!",
            summary: "Hello! how can I assist you today? If you have...",
            timestamp: new Date('2025-08-21T12:37:46Z'),
            scores: [
                { name: 'conciseness-v1', value: 0.90 },
                { name: 'contains-pii', value: 0.00 },
                { name: 'context-relevance', value: 0.80 },
                { name: 'hallucination', value: 0.00 },
                { name: 'helpfulness', value: 1.00 },
                { name: 'is-exclamation', value: 0.00 },
                { name: 'is_question', value: 0.00 },
                { name: 'language-detection', value: 1.00 },
                { name: 'toxicity-v2', value: 0.00 },
                { name: 'user-feedback', value: 1.00 },
            ]
        },
        {
            id: 'b6aaaa4d-b3d4-4f70-8c91-b680b45af6ad',
            status: 'neutral',
            // input이 비어있는 경우를 위해 빈 객체로 수정합니다.
            input: {},
            output: "Sorry, I don't know how to help with that.",
            summary: "Sorry, I don't know how to help with that.",
            timestamp: new Date('2025-08-21T12:38:55Z'),
            scores: [
                { name: 'conciseness-v1', value: 0.00 },
                { name: 'contains-pii', value: 0.00 },
                { name: 'context-relevance', value: 0.00 },
                { name: 'hallucination', value: 0.10 },
                { name: 'helpfulness', value: 1.00 },
                { name: 'is-exclamation', value: 0.00 },
                { name: 'is_question', value: 1.00 },
                { name: 'language-detection', value: 0.00 },
                { name: 'toxicity-v2', value: 0.00 },
                { name: 'user-feedback', value: 0.00 },
            ]
        }
    ]
};