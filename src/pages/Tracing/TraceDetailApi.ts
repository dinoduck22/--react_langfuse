// src/pages/Tracing/TraceDetailApi.ts
import { langfuse } from '../../lib/langfuse';
import { TraceWithFullDetails } from './types';

/**
 * ID를 기반으로 단일 트레이스의 상세 정보를 가져옵니다.
 * @param traceId - 조회할 트레이스의 ID
 */
export const fetchTraceDetails = async (traceId: string): Promise<TraceWithFullDetails> => {
    try {
        // 오류 수정: { traceId } -> traceId
        const response = await langfuse.api.traceGet(traceId);
        // API 응답의 타입이 TraceWithFullDetails와 호환된다고 단언합니다.
        return response as unknown as TraceWithFullDetails;
    } catch (error) {
        console.error(`Failed to fetch details for trace ${traceId}:`, error);
        // 사용자에게 더 친절한 에러 메시지를 반환할 수 있습니다.
        throw new Error('트레이스 상세 정보를 불러오는 데 실패했습니다.');
    }
};