// src/pages/Tracing/types.ts
import { ReactNode } from 'react';
import { Session } from 'data/dummySessionsData';

// JSON-serializable type for metadata
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Type for a single observation from the detail API
export interface Observation {
    id: string;
    name: string | null;
    startTime: string;
    endTime: string | null;
    latency: number | null;
    type: string;
    model: string | null;
    input: JsonValue;
    output: JsonValue;
    level: "DEBUG" | "DEFAULT" | "WARNING" | "ERROR";
    statusMessage: string | null;
    parentObservationId: string | null;
    promptId: string | null;
    totalCost: number | null;
}

// Type for a single score from the detail API
export interface Score {
    id: string;
    name: string;
    value: number;
    source: "ANNOTATION" | "API" | "EVAL";
    comment: string | null;
    timestamp: string;
}

// Standalone type for the full trace details
export interface TraceWithFullDetails {
    id: string;
    timestamp: string;
    name: string | null;
    input: JsonValue;
    output: JsonValue;
    sessionId: string | null;
    release: string | null;
    version: string | null;
    userId: string | null;
    metadata: Record<string, JsonValue> | null;
    tags: string[];
    public: boolean | null;
    environment: string | null;
    htmlPath: string;
    latency: number; // in seconds
    totalCost: number; // in USD
    observations: Observation[]; // Correctly typed as an array
    scores: Score[];
}

// Type for an item in the trace list
export type Trace = {
  id: string;
  isFavorited: boolean;
  timestamp: string;
  name: string | null;
  input: string;
  output: string;
  observations: number; // Correctly typed as a number for the count
  sessionId: string | null;
  userId: string | null;
  env: string;
  latency: number;
  cost: number;
  release?: string | null;
  version?: string | null;
  public?: boolean | null;
  tags: string[];
  metadata: Record<string, JsonValue> | null;
  environment: string | null;
  details?: TraceWithFullDetails; // Optional field for detailed data
};

// Other existing types
export interface SessionData extends Session {
  inputCost: number;
  outputCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  traceTags: string[];
  [key: string]: string | number | boolean | { input: number; output: number } | string[] | undefined;
}

export type TraceData = Trace;

export interface Column<T> {
  key: string;
  header: ReactNode;
  visible: boolean;
  accessor?: (row: T) => ReactNode;
}