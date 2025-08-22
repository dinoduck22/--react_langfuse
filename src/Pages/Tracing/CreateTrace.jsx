// src/Pages/Tracing/CreateTrace.jsx
import { langfuse } from '../../lib/langfuse';

/**
 * 새로운 Langfuse Trace를 생성하는 함수
 * @param {function} callback - Trace 생성 후 실행될 콜백 함수 (예: 목록 새로고침)
 */
export const handleCreateTrace = (callback) => {
  try {
    const trace = langfuse.trace({
      name: "chat-app-session-test",
      userId: "user_0822",
      metadata: { user: "user@wini-tech.com" },
      tags: ["development"],
    });

    trace.update({
      metadata: {
        tag: "long-running-test",
      },
    });
    
    alert(`새로운 Trace가 생성되었습니다. ID: ${trace.id}`);
    
    // Trace 생성 후 전달받은 콜백 함수 실행
    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Trace 생성 중 오류 발생:", error);
    alert("Trace 생성에 실패했습니다. 콘솔을 확인해주세요.");
  }
};