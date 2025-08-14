// src/Tracing/types.ts
import { Session } from 'data/dummySessionsData';

// Session 데이터 타입을 SessionData로 다시 export하여 명확하게 사용합니다.
export type { Session as SessionData };

// 컬럼의 구조를 정의하는 인터페이스입니다.
export interface Column {
  key: keyof Session; // Session 데이터의 키 중 하나여야 합니다.
  header: string;
  visible: boolean;
}