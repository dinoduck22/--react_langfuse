// src/pages/Tracing/SessionApi.ts
import { langfuse } from 'lib/langfuse';
import { SessionData } from '../types'; // Session -> SessionData

// Langfuse API 응답 데이터에 대한 타입 정의
interface LangfuseSession {
  id: string;
  createdAt: string;
  projectId: string;
  environment: string | null;
}

interface SessionsApiResponse {
  data: LangfuseSession[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Langfuse API에서 세션 목록을 가져옵니다.
 * 반환 타입을 Promise<SessionData[]>로 수정합니다.
 */
export const fetchSessions = async (): Promise<SessionData[]> => {
  try {
    const response = await langfuse.api.sessionsList({});
    const apiResponse = response as unknown as SessionsApiResponse;

    // API 응답 데이터를 UI에서 사용하는 SessionData 형태로 변환합니다.
    return apiResponse.data.map((session): SessionData => ({
      id: session.id,
      createdAt: new Date(session.createdAt).toLocaleString(),
      environment: session.environment ?? 'default',
      isFavorited: false, 
      duration: 'N/A',
      userIds: 'N/A',
      traces: 0,
      totalCost: 0,
      usage: { input: 0, output: 0 },
      // SessionData에 필요한 추가 필드를 기본값으로 채워줍니다.
      inputCost: 0,
      outputCost: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      traceTags: [],
    }));
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    throw new Error('세션 목록을 불러오는 데 실패했습니다.');
  }
};