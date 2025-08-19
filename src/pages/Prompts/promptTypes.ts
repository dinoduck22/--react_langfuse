/**
 * @file Prompts 페이지에서 공통으로 사용하는 TypeScript 타입 정의 파일
 */

// --- 공통 및 기본 타입 ---

/**
 * Langfuse API에서 사용하는 Chat Message의 기본 구조입니다.
 * 'system', 'user', 'assistant' 등 다양한 역할을 가질 수 있습니다.
 */
export type ChatMessage = { 
  role: "system" | "user" | "assistant"; 
  content: string 
};

/**
 * 프롬프트의 내용을 나타내는 타입입니다.
 * 단순 텍스트(string)이거나, ChatMessage 객체들의 배열일 수 있습니다.
 */
export type PromptContentType = string | ChatMessage[];

/**
 * 프롬프트에 포함될 수 있는 설정(config) 객체의 타입입니다.
 * JSON 형식이므로 다양한 키와 값을 가질 수 있습니다.
 */
export type ConfigContent = Record<string, unknown> | null;

/**
 * 상세 페이지의 'Use' 탭에서 Python, JS/TS 코드 스니펫을 담기 위한 타입입니다.
 */
export interface UseContent { 
  python: string; 
  jsTs: string 
}

// --- API 응답 및 UI 표시용 타입 ---

/**
 * API를 통해 직접 받아온 프롬프트의 원시 데이터 구조입니다.
 * version, createdBy 등 서버에서 제공하는 모든 필드를 포함합니다.
 */
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

/**
 * 프롬프트 '목록' 화면(Prompts.tsx)에 각 행을 표시하기 위해 가공된 데이터 타입입니다.
 * 목록 표시에 필요한 최소한의 정보를 담습니다.
 */
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
 * 프롬프트 '상세' 화면(PromptsDetail.tsx)에서 특정 버전을 표시하기 위해 가공된 데이터 타입입니다.
 * FetchedPrompt 데이터를 기반으로 UI에 표시하기 용이하게 변환된 구조입니다.
 */
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