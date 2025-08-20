export type Trace = {
  id: string;
  isFavorited: boolean;
  timestamp: string;
  name: string;
  input: string;
  output: string;
  observations: number;
};

export const dummyTraces: Trace[] = [
  { id: 'trace-1', isFavorited: false, timestamp: '2025-08-20 04:23:45', name: 'qa', input: 'explain traces how thy can be wrapped in streaming', output: 'It seems there might be a misunderstanding since the provided...', observations: 5 },
  { id: 'trace-2', isFavorited: true, timestamp: '2025-08-20 04:23:25', name: 'qa', input: 'kjsdf', output: 'It seems like your message may have been a bit jumbled. If you...', observations: 5 },
  { id: 'trace-3', isFavorited: false, timestamp: '2025-08-20 04:51:29', name: 'qa', input: 'hi', output: 'Hello! How can I help you today? If you have any questions a...', observations: 5 },
  { id: 'trace-4', isFavorited: false, timestamp: '2025-08-20 03:03:46', name: 'qa', input: 'how much time does LLM-as-a-judge takes to provide the evalua...', output: 'The Langfuse documentation does not specify the exact time i...', observations: 1 },
  { id: 'trace-5', isFavorited: false, timestamp: '2025-08-20 03:03:05', name: 'qa', input: 'Hello', output: 'Hello! How can I help you today? If you have any questions a...', observations: 5 },
  { id: 'trace-6', isFavorited: true, timestamp: '2025-08-20 02:41:20', name: 'qa', input: 'show me traces what do they look like in the row world?', output: 'The documentation you\'ve provided does not include real-world ...', observations: 5 },
  { id: 'trace-7', isFavorited: false, timestamp: '2025-08-20 02:40:58', name: 'qa', input: 'show me examples of sev6 and sev1 logs', output: 'It seems you\'re looking for specific examples of "severity level...', observations: 5 },
];