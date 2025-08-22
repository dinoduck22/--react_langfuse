import { langfuse } from 'lib/langfuse'

export interface Project {
    id: string;
    name: string;
}
export interface ApiKey {
    id: string;
    createdAt: string;
    expiresAt?: string | null;
    lastUsedAt?: string | null;
    note?: string | null;
    publicKey: string;
    displaySecretKey: string;
    secretKey?: string;
}

export const getProjects = async (): Promise<Project[]> => {
    const response = await langfuse.api.projectsGet();
    return response.data;
};

interface ApiKeyListResponse {
    apiKeys: ApiKey[];
}

export const getApiKeys = async (projectId: string): Promise<ApiKey[]> => {
    const response = await langfuse.api.projectsGetApiKeys(projectId);
    return (response as unknown as ApiKeyListResponse).apiKeys;
};

export const createApiKey = async (projectId: string, note: string | null = null): Promise<ApiKey> => {
    return langfuse.api.projectsCreateApiKey(projectId, { note });
}

export const deleteApiKey = async (projectId: string, publicKey: string): Promise<void> => {
    await langfuse.api.projectsDeleteApiKey(projectId, publicKey);
}