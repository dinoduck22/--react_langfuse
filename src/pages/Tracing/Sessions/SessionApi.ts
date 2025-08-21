// src/pages/Tracing/SessionApi.ts
import { langfuse } from 'lib/langfuse';
import { Session } from 'data/dummySessionsData';

// Langfuse API 응답 데이터에 대한 타입 정의
interface LangfuseSession {
  id: string;
  createdAt: string;
  projectId: string;
  environment: string | null;
  // API 스키마에 따라 다른 필드들도 추가될 수 있습니다.
  // 현재 UI에 필요한 데이터는 기본 응답에 모두 있지 않으므로, 일부는 임시 처리합니다.
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
 */
export const fetchSessions = async (): Promise<Session[]> => {
  try {
    // langfuse SDK를 사용하여 세션 목록을 요청합니다.
    const response = await langfuse.api.sessionsList({});
    const apiResponse = response as unknown as SessionsApiResponse;

    // API 응답 데이터를 UI에서 사용하는 Session 형태로 변환합니다.
    return apiResponse.data.map(session => ({
      id: session.id,
      createdAt: new Date(session.createdAt).toLocaleString(),
      environment: session.environment ?? 'default',
      isFavorited: false, // 즐겨찾기 정보는 API에 없으므로 기본값으로 설정
      // --- 아래 필드들은 /api/public/sessions 응답에 포함되지 않으므로 임시 데이터로 처리합니다. ---
      // TODO: 각 세션의 상세 정보를 가져오거나 관련 trace를 집계하여 실제 데이터로 채워야 합니다.
      duration: 'N/A',
      userIds: 'N/A',
      traces: 0,
      totalCost: 0,
      usage: { input: 0, output: 0 },
    }));
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    // 에러 발생 시 사용자에게 알리기 위해 에러를 다시 던집니다.
    throw new Error('세션 목록을 불러오는 데 실패했습니다.');
  }
};