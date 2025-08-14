import React from 'react';
import styles from './DashboardDetail.module.css';
import { Info, Calendar, Filter } from 'lucide-react';
import WidgetCard from 'components/Dashboard/WidgetCard';

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
  // totalObservations
  costByModelData,
  costByEnvironmentData,
  totalCostData,
  topUsersCostData,
  dummyPivotData, // ---▼ dummyPivotData import ▼---
} from 'data/dummyDashboardDetailData';


const DashboardDetail: React.FC = () => {
  const totalEnvCost = costByEnvironmentData.reduce((sum, item) => sum + item.value, 0).toFixed(3);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Langfuse Dashboard</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
      </div>

      <div className={styles.filterBar}>
        <button className={styles.filterButton}><Calendar size={16} /> Aug 06, 25 13:57 - Aug 13, 25 13:57</button>
        <button className={styles.filterButton}>Past 7 days</button>
        <button className={styles.filterButton}><Filter size={14} /> Filters</button>
      </div>

      <div className={styles.grid}>
        {/* BigNumber 예시 */}
        <WidgetCard title="Total Traces" subtitle="Shows the count of Traces">
          <BigNumberChart value={totalTraces} />
        </WidgetCard>
        
        {/* ---▼ AreaChart 예시 추가 ▼--- */}
        <WidgetCard title="Total Observations" subtitle="Shows the count of Observations">
            <AreaChart data={totalCostData} dataKey="value" nameKey="name"/>
        </WidgetCard>
        {/* ---▲ AreaChart 예시 추가 ▲--- */}

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
          <div className={styles.donutContainer}>
            <PieChart data={costByEnvironmentData} dataKey="value" nameKey="name" />
            <div className={styles.donutCenter}>
              <div className={styles.donutTotal}>${totalEnvCost}</div>
              <div className={styles.donutSubtitle}>Total</div>
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