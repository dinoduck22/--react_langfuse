// src/data/dummySessionDetailData.ts
export interface Score {
    name: string;
    value: number;
}

export interface TraceItem {
    id: string;
    name: string;
    timestamp: Date;
    duration: string;
    input: { test: string };
    output: string;
    scores: Score[];
}

export interface SessionDetailData {
    id: string;
    userId: string;
    traceCount: number;
    totalCost: number;
    traces: TraceItem[];
}

export const DUMMY_SESSION_DETAIL: SessionDetailData = {
    id: 'if.docs.conversation.rM0hdVk',
    userId: 'u-8XBcMbnE',
    traceCount: 1,
    totalCost: 0.000158,
    traces: [
        {
            id: 'qn:ff4ac2d4-993c-40fc-8069-0e12ed7f9764',
            name: 'LLM-based evaluation',
            timestamp: new Date('2025-08-20T05:57:47Z'),
            duration: '2.09s',
            input: { "test": "test" },
            output: `
### Purpose

The LLM Playground is designed for you to test, iterate, and compare different prompts and models. It's a great space to enhance your understanding and effectiveness in working with Large Language Models (LLMs).

### Security

Additionally, security is a top priority for us, which is why we conduct tests with independent, third-party security experts. Their goals include:

- Identifying potential security vulnerabilities in our infrastructure and application.
- Simulating real-world attack scenarios to understand our defenses.
- Validating the effectiveness of existing security controls.
- Ensuring ongoing resilience against emerging threats.

If you have questions or run into any problems while using Langfuse, please don't hesitate to reach out to our founders directly via the chat widget or contact us on GitHub. We're here to help! 😊
            `,
            scores: [
                { name: 'conciseness...', value: 0.90 },
                { name: 'conta-ns-pii', value: 0.00 },
                { name: 'context-rele...', value: 0.80 },
                { name: 'hal-ucination', value: 0.00 },
                { name: 'helpfulness', value: 0.90 },
                { name: 'is exclamation', value: 0.00 },
                { name: 'is_question', value: 0.00 },
                { name: 'language-d...', value: 1.00 },
                { name: 'toxicity-v2', value: 0.00 },
            ]
        }
    ]
};