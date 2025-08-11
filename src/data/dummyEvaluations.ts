// src/data/dummyEvaluations.ts

export type Evaluation = {
  id: string;
  name: string;
  model: string;
  score: number;
  updated: string;      // YYYY-MM-DD
  description: string;
};

export const dummyEvaluations: Evaluation[] = [
  {
    id: "eval-1",
    name: "Accuracy Test",
    model: "GPT-4",
    score: 92,
    updated: "2025-08-01",
    description: "Evaluate model accuracy with various inputs.",
  },
  {
    id: "eval-2",
    name: "Bias Detection",
    model: "Claude 2",
    score: 85,
    updated: "2025-08-03",
    description: "Detect potential bias in generated responses.",
  },
  {
    id: "eval-3",
    name: "Summarization Quality",
    model: "GPT-3.5",
    score: 78,
    updated: "2025-08-05",
    description: "Assess summary coherence and coverage.",
  },
  {
    id: "eval-4",
    name: "Tool Use Reliability",
    model: "Llama 2",
    score: 72,
    updated: "2025-08-06",
    description: "Check reliability when calling external tools.",
  },
  {
    id: "eval-5",
    name: "Instruction Following",
    model: "GPT-4",
    score: 90,
    updated: "2025-08-07",
    description: "Measure compliance with stepwise instructions.",
  },
  // 필요시 더 추가해도 됩니다.
];
