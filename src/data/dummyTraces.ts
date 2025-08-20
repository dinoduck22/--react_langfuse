export type Trace = {
  id: string;
  isFavorited: boolean;
  timestamp: string;
  name: string;
  input: string;
  output: string;
  observations: number;
  // ✅ 상세 패널을 위한 데이터 추가
  sessionId: string;
  userId: string;
  env: string;
  latency: number; // ms 단위
  cost: number; // $ 단위
  release?: string;
  metadata?: Record<string, string | number | boolean | string[]>;
};

export const dummyTraces: Trace[] = [
  // ✅ 이미지에 보이는 데이터와 유사하게 상세 정보 추가
  { 
    id: '9a358b8-793f-fec1-b1df-3effd9ccdbff', 
    isFavorited: false, 
    timestamp: '2025-08-20 12:26:01', 
    name: 'qa', 
    input: 'how to collect the record by session?', 
    output: 'To collect records by session in Langfuse, you need to follow these steps...', 
    observations: 5, 
    sessionId: 'if.docs.conversation.XiuwrU5', 
    userId: 'u-fUKqjkjh', 
    env: 'default', 
    latency: 5120, 
    cost: 0.000143, 
    release: '00a50a3f...' 
  },
  // 기존 데이터에도 예시 상세 정보 추가
  { 
    id: 'trace-2', 
    isFavorited: true, 
    timestamp: '2025-08-20 04:23:25', 
    name: 'qa', 
    input: 'kjsdf', 
    output: 'It seems like your message may have been a bit jumbled. If you...', 
    observations: 5, 
    sessionId: 'session-abc-123', 
    userId: 'user-456', 
    env: 'production', 
    latency: 3200, 
    cost: 0.000088 
  },
  // ... 나머지 dummyTraces 데이터에도 유사한 필드를 추가할 수 있습니다.
];