// src/pages/Dashboards/metricsApi.ts

// 환경 변수에서 인증 정보 직접 가져오기
const publicKey = import.meta.env.VITE_LANGFUSE_PUBLIC_KEY;
const secretKey = import.meta.env.VITE_LANGFUSE_SECRET_KEY;
const baseUrl = import.meta.env.VITE_LANGFUSE_BASE_URL;

// Langfuse 공식 문서 기반 타입 정의
export type MetricView = "traces" | "observations" | "scores";

export type MetricFilter = {
  column: string;
  operator: "=" | "!=" | "<" | ">" | "<=" | ">=" | "in" | "not in" | "contains";
  value: string | number | boolean | (string | number)[];
  type: "string" | "number" | "datetime" | "boolean" | "stringObject";
  key?: string;
};

export type MetricMeasure = {
  measure: "count" | "latency" | "totalTokens" | "totalCost" | "timeToFirstToken" | "value";
  aggregation: "sum" | "avg" | "min" | "max" | "p50" | "p95" | "p99" | "histogram";
};

export type MetricsApiParams = {
  view: MetricView;
  metrics: MetricMeasure[];
  fromTimestamp: string; // ISO datetime string
  toTimestamp: string;   // ISO datetime string
  filters?: MetricFilter[];
  groupBy?: { field: string }[];
  timeDimension?: {
    granularity: "minute" | "hour" | "day" | "week" | "month" | "auto";
  };
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  }[];
  config?: {
    bins?: number;
    row_limit?: number;
  };
};

export type MetricDataPoint = {
  [key: string]: string | number | null;
};

export type MetricsApiResponse = {
  data: MetricDataPoint[];
};

/**
 * Langfuse Metrics API에서 데이터를 가져오는 함수 (GET 방식 사용)
 * @param params API 요청 파라미터
 * @returns API 응답 데이터
 */
export const fetchMetrics = async (
  params: MetricsApiParams
): Promise<MetricsApiResponse> => {
  if (!publicKey || !secretKey || !baseUrl) {
    throw new Error("Langfuse 환경 변수가 .env 파일에 설정되지 않았습니다.");
  }

  // 파라미터 객체를 JSON 문자열로 변환하고 URL 인코딩
  const queryString = encodeURIComponent(JSON.stringify(params));
  const url = `${baseUrl}/api/public/metrics?query=${queryString}`;

  const headers = new Headers();
  headers.append(
    "Authorization",
    "Basic " + btoa(`${publicKey}:${secretKey}`)
  );

  try {
    // 요청 방식을 GET으로 변경하고 body 제거
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API 요청 실패 (상태 코드: ${response.status}): ${errorBody}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Langfuse Metrics API 호출 중 오류 발생:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("Metrics API 호출 중 알 수 없는 오류가 발생했습니다.");
  }
};