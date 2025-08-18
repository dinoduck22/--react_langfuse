// src/data/dummyDashboardDetailData.ts

// 차트 데이터 포인트의 타입을 정의합니다.
// BarChart, AreaChart 등 다양한 차트에서 재사용할 수 있습니다.
export interface ChartDataPoint {
  name: string;
  value: number;
}

// KPI 위젯 데이터
export const totalTraces: number = 444;
export const totalObservations: string = "2.619 k";

// 모델별 비용 데이터 (세로 막대 그래프) - CSV 파일 기반으로 업데이트됨
export const costByModelData: ChartDataPoint[] = [
  { name: 'gpt-4o-mini', value: 0.072609 },
  { name: 'gpt-4.1-2025-04-14', value: 0.032852 },
  { name: 'text-embedding-ada-002', value: 0.000459 }
];

// 환경별 비용 데이터 (도넛 그래프)
export const costByEnvironmentData: ChartDataPoint[] = [
    { name: 'production', value: 0.106 },
    { name: 'development', value: 0.045 },
    { name: 'staging', value: 0.012 },
];

// 총 비용 데이터 (영역 그래프)
export const totalCostData: ChartDataPoint[] = [
  { name: '8/9/25', value: 0.01 },
  { name: '8/10/25', value: 0.03 },
  { name: '8/11/25', value: 0.02 },
  { name: '8/12/25', value: 0.06 },
  { name: '8/13/25', value: 0.05 },
];

// 사용자별 비용 데이터 (가로 막대 그래프)
export const topUsersCostData: ChartDataPoint[] = [
  { name: 'user-a1b2c3d4', value: 0.08 },
  { name: 'user-e5f6g7h8', value: 0.06 },
  { name: 'user-i9j0k1l2', value: 0.04 },
  { name: 'user-m3n4o5p6', value: 0.02 },
];

// Trace별 비용 데이터 (세로 막대 그래프)
export const topTracesCostData: ChartDataPoint[] = [
  { name: 'trace-001-login', value: 0.06 },
  { name: 'trace-002-signup', value: 0.04 },
  { name: 'trace-003-payment', value: 0.03 },
  { name: 'trace-004-search', value: 0.01 },
];

// Observation별 비용 데이터 (가로 막대 그래프)
export const topObservationsCostData: ChartDataPoint[] = [
  { name: 'obs-chat-response', value: 0.08 },
  { name: 'obs-tool-call', value: 0.05 },
  { name: 'obs-db-query', value: 0.03 },
  { name: 'obs-api-request', value: 0.02 },
];

export const costByInputTypeData: ChartDataPoint[] = [
  { name: 'prompt', value: 0.07 },
  { name: 'dataset/run-item-create/w', value: 0.05 },
  { name: 'llm-completion', value: 0.02 },
];

export const p95CostPerTraceData: ChartDataPoint[] = [
  { name: '8/8/25, 09:00 AM', value: 0.002 },
  { name: '8/9/25, 09:00 AM', value: 0.006 },
  { name: '8/10/25, 09:00 AM', value: 0.004 },
  { name: '8/11/25, 09:00 AM', value: 0.005 },
  { name: '8/12/25, 09:00 AM', value: 0.003 },
  { name: '8/13/25, 09:00 AM', value: 0.007 },
];

export const p95InputCostPerObservationData: ChartDataPoint[] = [
  { name: 'generation', value: 0.0001 },
  { name: 'fetch-prompt-from-langfuse', value: 0.0002 },
  { name: 'llm-completion-create', value: 0.00015 },
  { name: 'other', value: 0.00005 },
];

export const p95OutputCostPerObservationData: ChartDataPoint[] = [
  { name: '8/8/25, 09:00 AM', value: 0.00005 },
  { name: '8/9/25, 09:00 AM', value: 0.00012 },
  { name: '8/10/25, 09:00 AM', value: 0.00008 },
  { name: '8/11/25, 09:00 AM', value: 0.0001 },
  { name: '8/12/25, 09:00 AM', value: 0.00006 },
  { name: '8/13/25, 09:00 AM', value: 0.00014 },
];

// ---▼ 피벗 테이블용 더미 데이터 추가 ▼---
export const dummyPivotData = [
    { model: 'GPT-4', region: 'US', value: 100 },
    { model: 'GPT-4', region: 'EU', value: 150 },
    { model: 'Claude 2', region: 'US', value: 80 },
    { model: 'Claude 2', region: 'EU', value: 120 },
    { model: 'GPT-3.5', region: 'US', value: 200 },
];

// ▼▼▼ TraceChart용 데이터 추가 ▼▼▼
export const tracesOverTimeData = [
  { date: '2025-08-01', traces: 12 },
  { date: '2025-08-02', traces: 18 },
  { date: '2025-08-03', traces: 8 },
  { date: '2025-08-04', traces: 20 },
  { date: '2025-08-05', traces: 10 },
];

// ▼▼▼ CostChart용 데이터 추가 ▼▼▼
export const costOverTimeData = [
  { date: '8/7/25', cost: 1 },
  { date: '8/8/25', cost: 2 },
  { date: '8/9/25', cost: 1.5 },
  { date: '8/10/25', cost: 3 },
  { date: '8/11/25', cost: 2.5 },
  { date: '8/12/25', cost: 4 },
];

// ... (다른 기존 데이터는 동일)