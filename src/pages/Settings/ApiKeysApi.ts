// src/pages/Settings/ApiKeysApi.ts

import { langfuse } from 'lib/langfuse';

export interface Project {
    id: string;
    name: string;
}

// API 응답 스키마를 기반으로 한 API Key 타입
export interface ApiKey {
    id: string;
    createdAt: string;
    expiresAt?: string | null;
    lastUsedAt?: string | null;
    note?: string | null;
    publicKey: string;
    displaySecretKey: string;
    secretKey?: string; // 생성 시에만 반환되는 전체 시크릿 키
}

// GET /api/public/projects/{projectId}/apiKeys 응답 전체를 위한 타입
interface ApiKeyListResponse {
    apiKeys: ApiKey[];
}

export const getProjects = async (): Promise<Project[]> => {
    const response = await langfuse.api.projectsGet();
    return response.data;
};

/**
 * 특정 프로젝트의 API 키 목록을 가져옵니다.
 * langfuse.api.projectsGetApiKeys가 ApiKeyListResponse 형태를 반환한다고 가정합니다.
 * @param projectId 프로젝트 ID
 * @returns API 키 목록 Promise
 */
export const getApiKeys = async (projectId: string): Promise<ApiKey[]> => {
    // langfuse SDK의 projectsGetApiKeys 메소드는 내부적으로 API를 호출합니다.
    const response = await langfuse.api.projectsGetApiKeys(projectId);

    // SDK가 반환하는 객체는 최상위에 data 프로퍼티를 가질 수 있으며,
    // 그 안에 apiKeys 배열이 포함될 수 있습니다.
    // 하지만 제공된 스키마에 따르면 바로 apiKeys를 포함하므로, response를 직접 캐스팅합니다.
    // 만약 SDK가 { data: { apiKeys: [...] } } 형태로 반환한다면 (response.data as ApiKeyListResponse).apiKeys 로 수정해야 합니다.
    return (response as unknown as ApiKeyListResponse).apiKeys;
};

export const createApiKey = async (projectId: string, note: string | null = null): Promise<ApiKey> => {
    return langfuse.api.projectsCreateApiKey(projectId, { note });
}

export const deleteApiKey = async (projectId: string, publicKey: string): Promise<void> => {
    await langfuse.api.projectsDeleteApiKey(projectId, publicKey);
}