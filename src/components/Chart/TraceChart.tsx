// src/components/Chart/TraceChart.tsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import styles from './TraceChart.module.css';
// 🔽 데이터 import 경로 추가
import { tracesOverTimeData } from 'data/dummyDashboardDetailData';

// 🔽 컴포넌트 내부에 있던 'data' 변수 삭제

export default function TraceChart() {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>📈 Traces Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        {/* 🔽 data prop에 import한 데이터 사용 */}
        <LineChart data={tracesOverTimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#e2e8f0',
            }}
          />
          <Line
            type="monotone"
            dataKey="traces"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 3, stroke: '#e0e7ff', strokeWidth: 1.5, fill: '#4f46e5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}