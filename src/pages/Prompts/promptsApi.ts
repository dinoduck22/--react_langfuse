import { langfuse } from 'lib/langfuse';

// --- 타입 정의 ---

// UI 목록에서 사용할 데이터 타입
export interface DisplayPrompt {
  id: string;
  name: string;
  versions: number;
  type: 'chat' | 'text';
  latestVersionCreatedAt: string;
  observations: number;
  tags: string[];
}

// API 응답 원시 데이터 타입 (상세 조회)
export interface FetchedPrompt {
  name: string;
  prompt: PromptContentType;
  type: 'chat' | 'text';
  version: number;
  config: ConfigContent;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  commitMessage: string | null;
}

// UI 상세 페이지에서 사용할 데이터 타입
export interface Version {
  id: number;
  label: string;
  labels: string[];
  details: string;
  author: string;
  prompt: {
    system?: string;
    user: string;
  };
  config: ConfigContent;
  useprompts: UseContent;
  tags: string[];
  commitMessage: string | null;
}

// 공통 타입
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type PromptContentType = string | ChatMessage[];
export type ConfigContent = Record<string, unknown> | null;
export interface UseContent { python: string; jsTs: string }

// --- API 함수 ---

/**
 * Langfuse 서버에서 프롬프트 목록을 가져옵니다.
 * @returns {Promise<DisplayPrompt[]>} UI 목록에 표시될 프롬프트 객체의 배열
 */
export const fetchPrompts = async (): Promise<DisplayPrompt[]> => {
  const response = await langfuse.api.promptsList({});
  
  return response.data.map((prompt): DisplayPrompt => ({
    id: prompt.name,
    name: prompt.name,
    // 참고: promptsList API는 version, type, observations 정보를 반환하지 않습니다.
    // 따라서 UI 표시를 위해 임시 기본값을 사용합니다. 정확한 정보는 상세 페이지에서 확인됩니다.
    versions: 1, 
    type: 'text',
    observations: 0,
    latestVersionCreatedAt: '-',
    tags: prompt.tags || [],
  }));
};

/**
 * 특정 프롬프트의 상세 정보를 가져옵니다.
 * @param promptName - 조회할 프롬프트의 이름
 * @returns {Promise<{ promptDetails: Version; allPromptNames: string[] }>}
 */
export const fetchPromptDetails = async (promptName: string): Promise<{ promptDetails: Version; allPromptNames: string[] }> => {
  const isChatPrompt = (prompt: PromptContentType): prompt is ChatMessage[] => Array.isArray(prompt);

  const [latestPrompt, promptListResponse] = await Promise.all([
    langfuse.getPrompt(promptName) as unknown as FetchedPrompt,
    langfuse.api.promptsList({})
  ]);

  const allPromptNames = promptListResponse.data.map(p => p.name);

  // 코드 스니펫 생성
  const pythonCode = `from langfuse import Langfuse\n\nlangfuse = Langfuse()\nprompt = langfuse.get_prompt("${promptName}", version=${latestPrompt.version})`;
  const jsTsCode = `import { Langfuse } from "langfuse";\n\nconst langfuse = new Langfuse();\nconst prompt = await langfuse.getPrompt("${promptName}", { version: ${latestPrompt.version} });`;

  // API 응답을 UI에 맞는 형태로 가공
  const promptDetails: Version = {
    id: latestPrompt.version,
    label: latestPrompt.commitMessage || `Version ${latestPrompt.version}`,
    labels: latestPrompt.labels,
    details: latestPrompt.createdAt ? new Date(latestPrompt.createdAt).toLocaleString() : 'N/A',
    author: latestPrompt.createdBy,
    prompt: {
      user: isChatPrompt(latestPrompt.prompt) ? latestPrompt.prompt.find(p => p.role === 'user')?.content ?? '' : latestPrompt.prompt,
      system: isChatPrompt(latestPrompt.prompt) ? latestPrompt.prompt.find(p => p.role === 'system')?.content : undefined,
    },
    config: latestPrompt.config,
    useprompts: { python: pythonCode, jsTs: jsTsCode },
    tags: latestPrompt.tags, // tags 정보 추가
    commitMessage: latestPrompt.commitMessage, // commitMessage 정보 추가
  };
  
  return { promptDetails, allPromptNames };
};