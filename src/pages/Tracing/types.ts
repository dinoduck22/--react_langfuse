// src/pages/Tracing/types.ts
import { ReactNode } from 'react';
import { Session } from 'data/dummySessionsData';

// JSON으로 직렬화 가능한 모든 타입을 나타내는 재귀 타입
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Trace = {
  id: string;
  isFavorited: boolean;
  timestamp: string;
  name: string | null;
  input: string; // formatTraceValue 함수가 문자열로 변환
  output: string; // formatTraceValue 함수가 문자열로 변환
  observations: number;
  sessionId: string | null;
  userId: string | null;
  env: string;
  latency: number;
  cost: number;
  release?: string | null;
  version?: string | null;
  public?: boolean | null;
  tags: string[];
  metadata: Record<string, JsonValue> | null; // any 대신 JsonValue 사용
  environment: string | null;
};

export interface SessionData extends Session {
  inputCost: number;
  outputCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  traceTags: string[];
  [key: string]: string | number | boolean | { input: number; output: number } | string[] | undefined;
}

export type TraceData = Trace;

export interface Column<T> {
  key: string;
  header: ReactNode;
  visible: boolean;
  accessor?: (row: T) => ReactNode;
}