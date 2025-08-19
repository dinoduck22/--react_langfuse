import { langfuse } from 'lib/langfuse';

// --- API 응답과 관련된 타입 정의 ---

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type PromptContentType = string | ChatMessage[];
export type ConfigContent = Record<string, unknown> | null;

// GET /api/public/v2/prompts/{promptName} 응답 기반 타입
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
}

// --- UI에서 사용할 데이터 타입 정의 ---

export interface UseContent {
  python: string;
  jsTs: string;
}

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
}

// --- API 호출 및 데이터 가공 함수 ---

/**
 * 특정 프롬프트의 상세 정보와 모든 프롬프트 목록을 가져옵니다.
 * @param promptName - 조회할 프롬프트의 이름 (id)
 * @returns {Promise<{ promptDetails: Version; allPromptNames: string[] }>} - 가공된 프롬프트 상세 정보와 전체 프롬프트 이름 목록
 */
export const fetchPromptDetails = async (promptName: string): Promise<{ promptDetails: Version; allPromptNames: string[] }> => {
  const isChatPrompt = (prompt: PromptContentType): prompt is ChatMessage[] => {
    return Array.isArray(prompt);
  };

  const [latestPrompt, promptListResponse] = await Promise.all([
    langfuse.getPrompt(promptName) as unknown as FetchedPrompt,
    langfuse.api.promptsList({})
  ]);

  const allPromptNames = promptListResponse.data.map(p => p.name);

  // 'Use' 탭에 들어갈 동적 코드 스니펫 생성
  const pythonCode = `from langfuse import Langfuse

# Initialize langfuse client
langfuse = Langfuse()

# Get production prompt
prompt = langfuse.get_prompt("${promptName}")

# Get by Label
# You can use as many labels as you'd like to identify different deployment targets
prompt = langfuse.get_prompt("${promptName}", label="latest")

# Get by version number, usually not recommended as it requires code changes to deploy new prompt versions
langfuse.get_prompt("${promptName}", version=${latestPrompt.version})`;

  const jsTsCode = `import { Langfuse } from "langfuse";

// Initialize the langfuse client
const langfuse = new Langfuse();

// Get production prompt
const prompt = await langfuse.getPrompt("${promptName}");

// Get by Label
// You can use as many labels as you'd like to identify different deployment targets
const prompt = await langfuse.getPrompt("${promptName}", { label: "latest" });

// Get by version number, usually not recommended as it requires code changes to deploy new prompt versions
langfuse.getPrompt("${promptName}", { version: ${latestPrompt.version} });`;

  // API 응답을 UI에 맞는 Version 형태로 가공
  const promptDetails: Version = {
    id: latestPrompt.version,
    label: `Version ${latestPrompt.version}`,
    labels: latestPrompt.labels,
    details: latestPrompt.createdAt ? new Date(latestPrompt.createdAt).toLocaleString() : 'N/A',
    author: latestPrompt.createdBy,
    prompt: {
      user: isChatPrompt(latestPrompt.prompt)
        ? latestPrompt.prompt.find(p => p.role === 'user')?.content ?? ''
        : latestPrompt.prompt,
      system: isChatPrompt(latestPrompt.prompt)
        ? latestPrompt.prompt.find(p => p.role === 'system')?.content
        : undefined,
    },
    config: latestPrompt.config,
    useprompts: { python: pythonCode, jsTs: jsTsCode },
  };
  
  return { promptDetails, allPromptNames };
};