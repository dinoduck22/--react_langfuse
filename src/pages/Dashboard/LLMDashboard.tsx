// src/pages/Dashboard/LLMDashboard.tsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import styles from "./LLMDashboard.module.css";
import { modelScores, dailyTrend, DashboardDatum, DailyPoint } from "../../data/dummyDashboardData";

export default function LLMDashboard() {
  // 간단 KPI 계산 (데이터는 더미)
  const avgScore =
    Math.round((modelScores.reduce((s, d) => s + d.score, 0) / modelScores.length) * 10) / 10;
  const best = modelScores.reduce((a, b) => (a.score > b.score ? a : b));
  const worst = modelScores.reduce((a, b) => (a.score < b.score ? a : b));
  const lastDelta =
    dailyTrend.length >= 2
      ? dailyTrend[dailyTrend.length - 1].score - dailyTrend[dailyTrend.length - 2].score
      : 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📊 LLM 대시보드</h1>

      {/* KPI 카드 */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>평균 점수</div>
          <div className={styles.kpiValue}>{avgScore}</div>
          <div className={styles.kpiDelta}>{lastDelta >= 0 ? "▲" : "▼"} {Math.abs(lastDelta).toFixed(1)} (d/d)</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>최상위 모델</div>
          <div className={styles.kpiValue}>{best.model}</div>
          <div className={styles.kpiDelta}>score {best.score}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>최하위 모델</div>
          <div className={styles.kpiValue}>{worst.model}</div>
          <div className={styles.kpiDelta}>score {worst.score}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>모델 수</div>
          <div className={styles.kpiValue}>{modelScores.length}</div>
          <div className={styles.kpiDelta}>active</div>
        </div>
      </div>

      {/* 차트 + 테이블 */}
      <div className={styles.chartGrid}>
        {/* (1) 모델별 점수 – 막대 */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>모델별 점수</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={modelScores as DashboardDatum[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
          <div className={styles.legendRow}>최근 평가 기준 (샘플 데이터)</div>
        </div>

        {/* (2) 일간 평균 점수 추이 – 선 */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>일간 평균 점수 추이</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyTrend as DailyPoint[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" />
            </LineChart>
          </ResponsiveContainer>
          <div className={styles.legendRow}>지난 7일 (샘플 데이터)</div>
        </div>
      </div>
    </div>
  );
}
