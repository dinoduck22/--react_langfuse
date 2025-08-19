// src/pages/Tracing/types.ts
import { Session } from 'data/dummySessionsData';

export interface SessionData extends Session {
  inputCost: number;
  outputCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  traceTags: string[];
  // Scores 컬럼들을 위한 인덱스 시그니처의 any 타입을 명시적인 타입으로 수정
  [key: string]: string | number | boolean | { input: number; output: number } | string[] | undefined;
}

export interface Column {
  key: keyof SessionData;
  header: string;
  visible: boolean;
}