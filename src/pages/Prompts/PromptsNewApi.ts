import { langfuse } from 'lib/langfuse';
import { ChatMessage } from 'components/ChatBox/ChatBox';

// API 요청에 필요한 데이터 타입을 정의합니다.
export interface NewPromptParams {
  promptName: string;
  promptType: 'Chat' | 'Text';
  chatContent: ChatMessage[];
  textContent: string;
  config: string; // JSON string
  labels: { production: boolean };
  commitMessage: string;
}

/**
 * 새로운 프롬프트를 생성하거나 기존 프롬프트의 새 버전을 생성합니다.
 * @param params - 프롬프트 생성에 필요한 데이터
 */
export const createPromptOrVersion = async (params: NewPromptParams): Promise<void> => {
  const {
    promptName,
    promptType,
    chatContent,
    textContent,
    config,
    labels,
    commitMessage,
  } = params;

  // 활성화된 레이블만 문자열 배열로 변환합니다.
  const activeLabels = Object.entries(labels)
    .filter(([, isActive]) => isActive)
    .map(([label]) => label);
  
  // 공통 요청 본문을 정의합니다.
  const commonPayload = {
    name: promptName,
    config: JSON.parse(config),
    labels: activeLabels,
    commitMessage: commitMessage || null,
  };

  // 프롬프트 타입에 따라 요청을 분기합니다.
  if (promptType === 'Chat') {
    const chatPromptData = chatContent
      .filter(msg => msg.role !== 'Placeholder')
      .map(({ role, content }) => ({
        type: 'chatmessage' as const,
        role: role.toLowerCase() as 'system' | 'user' | 'assistant',
        content,
      }));

    await langfuse.api.promptsCreate({
      ...commonPayload,
      type: 'chat',
      prompt: chatPromptData,
    });
  } else { // 'Text'
    await langfuse.api.promptsCreate({
      ...commonPayload,
      type: 'text',
      prompt: textContent,
    });
  }
};