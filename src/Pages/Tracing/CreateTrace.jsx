// src/Pages/Tracing/CreateTrace.jsx
import { langfuse } from '../../lib/langfuse';

/**
 * Langfuse 문서를 기반으로 새로운 Trace를 생성하는 함수
 * @param {function} callback - Trace 생성 후 실행될 콜백 함수 (예: 목록 새로고침)
 */
export const createTrace = async (callback) => { // 1. async 키워드 추가
  try {
    const trace = langfuse.trace({
      name: "chat-app-session-test",
      userId: "user_0822",
      sessionId: "session-12345",
      metadata: { user: "user@wini-tech.com", from: "createTrace function" },
      tags: ["development", "new-trace"],
    });

    // 2. 데이터를 즉시 서버로 전송하기 위해 flush()를 호출합니다.
    await langfuse.flush();

    alert(`새로운 Trace가 생성되었습니다. ID: ${trace.id}`);
    
    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Trace 생성 중 오류 발생:", error);
    alert("Trace 생성에 실패했습니다. 콘솔을 확인해주세요.");
  }
};

/**
 * Langfuse 문서를 기반으로 기존 Trace를 업데이트하는 함수
 * @param {object} trace - 업데이트할 Langfuse Trace 객체
 * @param {function} callback - Trace 업데이트 후 실행될 콜백 함수
 */
export const updateTrace = async (trace, callback) => { // 3. update 함수에도 동일하게 적용
  if (!trace || !trace.id) {
    alert("업데이트할 유효한 Trace 객체가 전달되지 않았습니다.");
    return;
  }
  try {
    trace.update({
      metadata: {
        tag: "long-running-test-updated",
        updatedAt: new Date().toISOString()
      },
    });
    
    // 4. 업데이트된 내용도 즉시 전송합니다.
    await langfuse.flush();

    alert(`Trace가 업데이트되었습니다. ID: ${trace.id}`);

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Trace 업데이트 중 오류 발생:", error);
    alert("Trace 업데이트에 실패했습니다. 콘솔을 확인해주세요.");
  }
};