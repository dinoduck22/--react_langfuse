import { langfuse } from 'lib/langfuse';

// API 응답의 원시 데이터 타입을 정의합니다.
interface PromptMeta {
  name: string;
  tags: string[];
  updatedAt?: string;
}

// UI에 표시될 데이터 형식을 정의합니다.
export interface DisplayPrompt {
  id: string;
  name: string;
  versions: number;
  type: 'chat' | 'text';
  latestVersionCreatedAt: string;
  observations: number;
  tags: string[];
}

/**
 * Langfuse 서버에서 프롬프트 목록을 가져와 UI에 맞는 형식으로 가공합니다.
 * @returns {Promise<DisplayPrompt[]>} UI에 표시될 프롬프트 객체의 배열
 */
export const fetchPrompts = async (): Promise<DisplayPrompt[]> => {
  // langfuse SDK를 사용하여 프롬프트 목록을 요청합니다.
  const response = await langfuse.api.promptsList({});
  
  // API 응답 데이터를 UI에 필요한 'DisplayPrompt' 형태로 변환(map)합니다.
  const formattedPrompts = response.data.map((prompt: PromptMeta): DisplayPrompt => {
    const latestVersionCreatedAt = prompt.updatedAt
      ? new Date(prompt.updatedAt).toLocaleString()
      : '-';

    return {
      id: prompt.name,
      name: prompt.name,
      versions: 1, // API 응답에 버전 정보가 없으므로 기본값 1로 설정합니다.
      type: 'text',  // API 응답에 타입 정보가 없으므로 'text'로 가정합니다.
      latestVersionCreatedAt: latestVersionCreatedAt,
      observations: 0, // API 응답에 관찰 횟수 정보가 없으므로 0으로 설정합니다.
      tags: prompt.tags || [],
    };
  });

  return formattedPrompts;
};