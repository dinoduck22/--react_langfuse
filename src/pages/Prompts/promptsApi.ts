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
 * 프롬프트 목록 전체를 가져오고, 각 프롬프트의 최신 버전 정보와 타입을 포함합니다.
 */
export const fetchPrompts = async (): Promise<DisplayPrompt[]> => {
  // 1. 모든 프롬프트의 기본 목록(이름 위주)을 가져옵니다.
  const listResponse = await langfuse.api.promptsList({});
  
  // 2. 각 프롬프트의 상세 정보를 병렬로 조회합니다.
  const detailedPrompts = await Promise.all(
    listResponse.data.map(promptInfo => 
      langfuse.api.promptsGet({ promptName: promptInfo.name }) as Promise<FetchedPrompt>
    )
  );

  // 3. 상세 정보가 포함된 데이터를 DisplayPrompt 형태로 가공합니다.
  return detailedPrompts.map((prompt): DisplayPrompt => ({
    id: prompt.name,
    name: prompt.name,
    versions: prompt.version, // API에서 받은 최신 버전 번호를 사용합니다.
    type: prompt.type,       // API에서 받은 프롬프트 타입을 사용합니다.
    observations: 0, // 이 정보는 현재 API에서 제공되지 않으므로 0으로 유지합니다.
    latestVersionCreatedAt: new Date(prompt.updatedAt).toLocaleString(), // 업데이트된 시간을 보기 좋게 포맷합니다.
    tags: prompt.tags || [],
  }));
};


/**
 * 특정 프롬프트의 최신 버전을 가져옵니다.
 * Langfuse API가 단일 버전 객체를 반환하므로, 이를 배열로 감싸서 UI와 호환되도록 합니다.
 */
export const fetchPromptVersions = async (promptName: string): Promise<Version[]> => {
    const response = await langfuse.api.promptsGet({ promptName }) as unknown as FetchedPrompt;
    
    // 단일 응답 객체를 배열로 감싸서 처리합니다.
    const versionsResponse: FetchedPrompt[] = response ? [response] : [];
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
    # You can use as many labels as you'd like to identify different deployment targets
    const prompt = await langfuse.getPrompt("${v.name}", { label: "latest" });

    # Get by version number, usually not recommended as it requires code changes to deploy new prompt versions
    langfuse.getPrompt("${v.name}", { version: ${v.version} });`;

        return {
            id: v.version,
            label: v.commitMessage || `Version ${v.version}`,
            labels: v.labels,
            details: v.updatedAt ? new Date(v.updatedAt).toLocaleString() : 'N/A',
            author: v.createdBy,
            prompt: {
                user: isChatPrompt(v.prompt) ? v.prompt.find(p => p.role === 'user')?.content ?? '' : v.prompt as string,
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