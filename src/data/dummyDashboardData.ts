// src/data/dummyDashboardData.ts

// 타입
export type DashboardDatum = { model: string; score: number };
export type DailyPoint = { date: string; score: number };

// 모델별 점수 (막대 차트)
export const modelScores: DashboardDatum[] = [
  { model: "GPT-3.5", score: 78 },
  { model: "GPT-4", score: 91 },
  { model: "Claude 2", score: 85 },
  { model: "Llama 2", score: 72 },
];

// 일간 평균 점수 추이 (선 차트) — YYYY-MM-DD
export const dailyTrend: DailyPoint[] = [
  { date: "2025-08-01", score: 80 },
  { date: "2025-08-02", score: 82 },
  { date: "2025-08-03", score: 83 },
  { date: "2025-08-04", score: 81 },
  { date: "2025-08-05", score: 84 },
  { date: "2025-08-06", score: 86 },
  { date: "2025-08-07", score: 85 },
];
