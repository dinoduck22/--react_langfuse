// src/pages/Tracing/types.ts
import { Session } from 'data/dummySessionsData';
import { Trace } from 'data/dummyTraces'; // Trace 타입 import

// SessionData는 기존과 동일
export interface SessionData extends Session {
  inputCost: number;
  outputCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  traceTags: string[];
  [key: string]: string | number | boolean | { input: number; output: number } | string[] | undefined;
}

// TraceData 추가
export interface TraceData extends Trace {}

// Column 타입은 TraceData도 받을 수 있도록 제네릭으로 수정 고려 가능
export interface Column {
  key: keyof SessionData | keyof TraceData; // 두 타입을 모두 지원
  header: string;
  visible: boolean;
}