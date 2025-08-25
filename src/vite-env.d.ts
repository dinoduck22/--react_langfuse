/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
    readonly VITE_LANGFUSE_PUBLIC_KEY: string;
    readonly VITE_LANGFUSE_SECRET_KEY: string;
    readonly VITE_LANGFUSE_BASE_URL: string;
    readonly VITE_LANGFUSE_PROJECT_ID: string; // <-- 이 줄을 추가하세요.
    // 다른 VITE_ 변수들도 여기에 추가할 수 있습니다.
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }