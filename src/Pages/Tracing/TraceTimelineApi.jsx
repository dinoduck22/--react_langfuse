// src/Pages/Tracing/TraceTimelineApi.jsx
import { langfuse } from '../../lib/langfuse';

/**
 * 특정 Trace에 속한 Observation 목록을 가져옵니다.
 * @param {string} traceId - 조회할 Trace의 ID
 * @returns {Promise<Array<Object>>} UI에 표시될 Observation 목록
 */
export const fetchObservationsForTrace = async (traceId) => {
  if (!traceId) {
    throw new Error('Trace ID가 필요합니다.');
  }

  try {
    // 오류 수정: 올바른 SDK 함수명인 observationsGetMany로 최종 변경
    const response = await langfuse.api.observationsGetMany({
      traceId: traceId,
      limit: 100, // 필요에 따라 페이징 처리 추가
    });

    return response.data.map(obs => ({
      id: obs.id,
      name: obs.name || obs.type,
      startTime: new Date(obs.startTime).toLocaleString(),
      endTime: obs.endTime ? new Date(obs.endTime).toLocaleString() : null,
      type: obs.type,
      model: obs.model,
    }));
  } catch (error) {
    console.error(`Failed to fetch observations for trace ${traceId}:`, error);
    throw new Error('Observation 목록을 불러오는 데 실패했습니다.');
  }
};