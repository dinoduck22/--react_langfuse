import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './DashboardDetail.module.css';
import { Info, Calendar, Filter, Plus } from 'lucide-react';
import WidgetCard from 'components/Dashboard/WidgetCard';
import DateRangePicker from 'components/DateRange/DateRangePicker';


// 필요한 모든 차트 컴포넌트를 import 합니다.
import AreaChart from 'components/Chart/AreaChart';
import BarChart from 'components/Chart/BarChart';
import PieChart from 'components/Chart/PieChart';
import LineChart from 'components/Chart/LineChart';
import BigNumberChart from 'components/Chart/BigNumberChart';
import HistogramChart from 'components/Chart/HistogramChart';
import PivotTable from 'components/Chart/PivotTableChart';

import {
  totalTraces,
  costByModelData,
  costByEnvironmentData,
  totalCostData,
  topUsersCostData,
  dummyPivotData,
} from 'data/dummyDashboardDetailData';
import { DUMMY_DASHBOARDS } from 'data/dummyDashboardData'; // 2. 대시보드 목록 데이터 import

const DashboardDetail: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>(); // 3. URL에서 dashboardId 추출

  // 4. dashboardId를 이용해 현재 대시보드 정보 찾기
  const currentDashboard = DUMMY_DASHBOARDS.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, '-') === dashboardId
  );

  const totalEnvCost = costByEnvironmentData.reduce((sum, item) => sum + item.value, 0).toFixed(3);

  // 5. 대시보드 정보가 없을 경우 처리
  if (!currentDashboard) {
    return (
      <div className={styles.container}>
        <h1>Dashboard not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {/* 6. 제목을 동적으로 변경 */}
          <h1 className={styles.title}>{currentDashboard.name}</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        {/* ▼▼▼ 이미지처럼 Add Widget 버튼 추가 ▼▼▼ */}
        <button className={styles.addWidgetButton}>
          <Plus size={16} /> Add Widget
        </button>
      </div>

      <div className={styles.filterBar}>
        <DateRangePicker />
        <button className={styles.filterButton}><Filter size={14} /> Filters</button>
      </div>

      <div className={styles.grid}>
        {/* BigNumber 예시 */}
        <WidgetCard title="Total Traces" subtitle="Shows the count of Traces">
          <BigNumberChart value={totalTraces} />
        </WidgetCard>
        
        {/* AreaChart 예시 */}
        <WidgetCard title="Total Observations" subtitle="Shows the count of Observations">
            <AreaChart data={totalCostData} dataKey="value" nameKey="name"/>
        </WidgetCard>

        {/* LineChart 예시 (Time Series) */}
        <WidgetCard title="Total costs ($)" subtitle="Total cost across all use cases" gridSpan={2}>
            <LineChart data={totalCostData} dataKey="value" nameKey="name" />
        </WidgetCard>

        {/* VerticalBarChart 예시 (Time Series) */}
        <WidgetCard title="Cost by Model Name ($)" subtitle="Total cost broken down by model name">
            <BarChart data={costByModelData} dataKey="value" nameKey="name" layout="horizontal" />
        </WidgetCard>

        {/* PieChart 예시 (Total Value) */}
        <WidgetCard title="Cost by Environment ($)" subtitle="Total cost broken down by trace.environment">
          <div className={styles.pieContainer}>
            <PieChart data={costByEnvironmentData} dataKey="value" nameKey="name" />
            <div className={styles.pieCenter}>
              <div className={styles.pieTotal}>${totalEnvCost}</div>
              <div className={styles.pieSubtitle}>Total</div>
            </div>
          </div>
        </WidgetCard>

        {/* HorizontalBarChart 예시 (Total Value) */}
        <WidgetCard title="Top Users by Cost ($)" subtitle="Aggregated model cost by user" gridSpan={2}>
            <BarChart data={topUsersCostData} dataKey="value" nameKey="name" layout="vertical" />
        </WidgetCard>
        
        {/* Histogram 예시 (Total Value) */}
        <WidgetCard title="Cost Distribution" subtitle="Distribution of costs">
            <HistogramChart data={costByModelData} dataKey="value" nameKey="name" />
        </WidgetCard>
        
        {/* PivotTable 예시 (Total Value) */}
        <WidgetCard title="Costs by Model and Region" subtitle="Pivot table summary" gridSpan={2}>
            <PivotTable data={dummyPivotData} rows={['model']} cols={['region']} value="value" />
        </WidgetCard>
      </div>
    </div>
  );
};

export default DashboardDetail;