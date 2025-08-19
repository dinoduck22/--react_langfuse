import { langfuse } from 'lib/langfuse';
// promptsTypes.ts 파일에서 모든 타입을 가져옵니다.
import {
  type ChatMessage,
  type DisplayPrompt,
  type FetchedPrompt,
  type PromptContentType,
  type Version
} from './promptTypes';

// --- API 함수 ---

/**
 * 프롬프트 목록 전체를 가져옵니다.
 */
export const fetchPrompts = async (): Promise<DisplayPrompt[]> => {
  const response = await langfuse.api.promptsList({});
  return response.data.map((prompt): DisplayPrompt => ({
    id: prompt.name,
    name: prompt.name,
    versions: 1,
    type: 'text',
    observations: 0,
    latestVersionCreatedAt: '-',
    tags: prompt.tags || [],
  }));
};

/**
 * 특정 프롬프트의 최신 버전을 가져옵니다.
 */
export const fetchPromptVersions = async (promptName: string): Promise<Version[]> => {
    // [수정] API 호출 시 인자 객체의 속성 이름을 'name'에서 'promptName'으로 변경합니다.
    const response = await langfuse.api.promptsGet({ promptName }) as unknown as FetchedPrompt;
    
    const versionsResponse: FetchedPrompt[] = [response];
    const isChatPrompt = (prompt: PromptContentType): prompt is ChatMessage[] => Array.isArray(prompt);

    return versionsResponse.map((v): Version => {
      const pythonCode = `from langfuse import Langfuse

    # Initialize langfuse client
    langfuse = Langfuse()

    # Get production prompt
    prompt = langfuse.get_prompt("${v.name}")

    # Get by Label
    # You can use as many labels as you'd like to identify different deployment targets
    prompt = langfuse.get_prompt("${v.name}", label="latest")

    # Get by version number, usually not recommended as it requires code changes to deploy new prompt versions
    langfuse.get_prompt("${v.name}", version=${v.version})`;
      const jsTsCode = `import { Langfuse } from "langfuse";

    // Initialize the langfuse client
    const langfuse = new Langfuse();

    // Get production prompt
    const prompt = await langfuse.getPrompt("${v.name}");

    // Get by Label
    // You can use as many labels as you'd like to identify different deployment targets
    const prompt = await langfuse.getPrompt("${v.name}", { label: "latest" });

    // Get by version number, usually not recommended as it requires code changes to deploy new prompt versions
    langfuse.getPrompt("${v.name}", { version: ${v.version} });`;

        return {
            id: v.version,
            label: v.commitMessage || `Version ${v.version}`,
            labels: v.labels,
            details: v.updatedAt ? new Date(v.updatedAt).toLocaleString() : 'N/A',
            author: v.createdBy,
            prompt: {
                user: isChatPrompt(v.prompt) ? v.prompt.find(p => p.role === 'user')?.content ?? '' : v.prompt,
                system: isChatPrompt(v.prompt) ? v.prompt.find(p => p.role === 'system')?.content : undefined,
            },
            config: v.config,
            useprompts: { python: pythonCode, jsTs: jsTsCode },
            tags: v.tags,
            commitMessage: v.commitMessage,
        };
    }).sort((a, b) => b.id - a.id);
};

/**
 * 기존 프롬프트를 기반으로 새 버전을 생성합니다.
 */
export const createNewPromptVersion = async (
  name: string,
  versionData: Version
): Promise<FetchedPrompt> => {
  const { prompt, config, commitMessage: versionCommitMessage } = versionData;
  const isChat = !!prompt.system;
  const commitMessage = versionCommitMessage ? `${versionCommitMessage} (copy)` : `Forked from v${versionData.id}`;
  
  const commonPayload = {
      name: name,
      config: config,
      labels: [],
      commitMessage: commitMessage,
  };

  if (isChat) {
      // [수정] chatPromptPayload의 각 메시지 객체에 type: 'chatmessage'를 추가합니다.
      const chatPromptPayload = [
          { type: 'chatmessage' as const, role: 'system' as const, content: prompt.system! },
          { type: 'chatmessage' as const, role: 'user' as const, content: prompt.user },
      ];
      const response = await langfuse.api.promptsCreate({ ...commonPayload, type: 'chat', prompt: chatPromptPayload });
      return response as unknown as FetchedPrompt;
  } else {
      const response = await langfuse.api.promptsCreate({ ...commonPayload, type: 'text', prompt: prompt.user });
      return response as unknown as FetchedPrompt;
  }
};