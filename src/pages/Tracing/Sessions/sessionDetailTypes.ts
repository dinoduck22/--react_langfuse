// src/pages/Tracing/sessionDetailTypes.ts

// 어떤 형태의 JSON이든 표현할 수 있는 재귀 타입 정의
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// API 응답에서 Score 객체의 구조 (임시 정의)
export interface ApiScore {
    name: string;
    value: number;
}

// API 응답에서 Trace 객체의 구조
export interface ApiTrace {
  id: string;
  timestamp: string;
  name: string | null;
  // 'any' 대신 JsonValue 타입을 사용합니다.
  input: JsonValue | null;
  output: JsonValue | null;
  sessionId: string | null;
  userId: string | null;
  metadata: JsonValue | null;
  version: string | null;
  release: string | null;
  tags: string[] | null;
  // 'any[]' 대신 명시적인 Score 타입을 사용합니다.
  scores: ApiScore[]; 
}

// API 응답 전체의 구조 (Session 포함)
export interface SessionWithTraces {
  id: string;
  createdAt: string;
  projectId: string;
  traces: ApiTrace[];
}

// UI 컴포넌트에서 사용할 데이터 구조
export interface UiTrace {
  id: string;
  status: 'positive' | 'neutral' | 'negative';
  input: JsonValue;
  output: string; // output은 최종적으로 문자열로 변환하여 사용
  summary: string;
  timestamp: Date;
  scores: { name: string; value: number }[];
}

export interface UiSessionData {
  id: string;
  traces: UiTrace[];
}