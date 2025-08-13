import React from 'react'

const DUMMY_MODELS = [
    {
        id: '1',
        maintainer: 'user',
        matchPattern: '(babbage-002)$',
        pricesPerUnit: {
            input: '$0.0001',
            output: '$0.0002',
        },
        tokenize: 'OpenAI',
        tokenizerConfiguration: '',
        lastUsed: '2025-08-05'
    },
    {
        id: '2',
        maintainer: 'user',
        matchPattern: '(babbage-001)$',
        pricesPerUnit: {
            input: '$0.0001',
            output: '$0.0002',
        },
        tokenize: 'Google',
        tokenizerConfiguration: '',
        lastUsed: '2025-08-05'
    },
    {
        id: '3',
        maintainer: 'user',
        matchPattern: '(babbage-003)$',
        pricesPerUnit: {
            input: '$0.0001',
            output: '$0.0002',
        },
        tokenize: 'Anthropic',
        tokenizerConfiguration: '',
        lastUsed: '2025-08-05'
    },
];

const Models: React.FC = () => {
    return (
        <div>
            <h4>Models</h4>
            <p>A model represents a LLM model. It is used to calculate tokens and cost.</p>


        </div>
    );
};

export default Models;