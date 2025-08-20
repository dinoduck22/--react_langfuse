import { ReactNode } from 'react';
import { Session } from 'data/dummySessionsData';
import { Trace } from 'data/dummyTraces';

export interface SessionData extends Session {
  inputCost: number;
  outputCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  traceTags: string[];
  [key: string]: string | number | boolean | { input: number; output: number } | string[] | undefined;
}

// ✅ interface 대신 type 별칭을 사용하여 TraceData 타입을 정의합니다.
export type TraceData = Trace;

export interface Column<T> {
  key: string;
  header: ReactNode;
  visible: boolean;
  accessor?: (row: T) => ReactNode;
}