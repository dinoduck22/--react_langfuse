import React from 'react';
import styles from './DashboardDetail.module.css';
import { Info, Calendar, Filter } from 'lucide-react';
import WidgetCard from 'components/Dashboard/WidgetCard';
import AreaChart from 'components/Chart/AreaChart';
import BarChart from 'components/Chart/BarChart';
import PieChart from 'components/Chart/PieChart';
import LineChart from 'components/Chart/LineChart'; // Import LineChart

import {
  totalTraces,
  totalObservations,
  costByModelData,
  costByEnvironmentData,
  totalCostData,
  topUsersCostData,
  topTracesCostData,
  topObservationsCostData,
  costByInputTypeData,
  p95CostPerTraceData,
  p95InputCostPerObservationData,
  p95OutputCostPerObservationData,
} from '../../data/dummyDashboardDetailData';

const DashboardDetail: React.FC = () => {
  const totalEnvCost = costByEnvironmentData.reduce((sum, item) => sum + item.value, 0).toFixed(3);

  return (
    <div className={styles.container}>
      {/* 기존 헤더 및 필터 바 유지... */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Langfuse Cost Dashboard</h1>
          <span className={styles.subtitle}>(Clone)</span>
          <Info size={16} className={styles.infoIcon} />
        </div>
        <button className={styles.cloneButton}>
          View-only clone created
        </button>
      </div>

      <div className={styles.filterBar}>
        <button className={styles.filterButton}><Calendar size={16} /> Aug 06, 25 13:57 - Aug 13, 25 13:57</button>
        <button className={styles.filterButton}>Past 7 days</button>
        <button className={styles.filterButton}><Filter size={14} /> Filters</button>
      </div>

      <div className={styles.grid}>
        {/* 기존 위젯 유지... */}
        <WidgetCard title="Total Count Traces" subtitle="Shows the count of Traces">
          <div className={styles.kpiValue}>{totalTraces}</div>
        </WidgetCard>

        <WidgetCard title="Total Count Observations" subtitle="Shows the count of Observations">
          <div className={styles.kpiValue}>{totalObservations}</div>
        </WidgetCard>

        <WidgetCard title="Cost by Model Name ($)" subtitle="Total cost broken down by model name">
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart data={costByModelData} dataKey="value" nameKey="name" />
          </div>
        </WidgetCard>

        <WidgetCard title="Cost by Input Type ($)" subtitle="Total cost broken down by input type">
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart data={costByInputTypeData} dataKey="value" nameKey="name" layout="vertical" />
          </div>
        </WidgetCard>

        <WidgetCard title="Cost by Environment ($)" subtitle="Total cost broken down by trace.environment">
          <div className={styles.pieContainer}>
            <PieChart data={costByEnvironmentData} dataKey="value" nameKey="name" />
            <div className={styles.pieCenter}>
              <div className={styles.pieTotal}>${totalEnvCost}</div>
              <div className={styles.pieSubtitle}>Total</div>
            </div>
          </div>
        </WidgetCard>

        <WidgetCard title="P 95 Cost per Trace ($)" subtitle="95th percentile of cost for each trace">
          <div style={{ width: '100%', height: '100%' }}>
            <LineChart data={p95CostPerTraceData} dataKey="value" nameKey="name" />
          </div>
        </WidgetCard>

        <WidgetCard title="Total costs ($)" subtitle="Total cost across all use cases" gridSpan={2}>
          <div style={{ width: '100%', height: '100%' }}>
            <AreaChart data={totalCostData} dataKey="value" nameKey="name" />
          </div>
        </WidgetCard>

        <WidgetCard title="P 95 Input Cost per Observation ($)" subtitle="95th percentile of input cost for each observation (llm c..." gridSpan={2}>
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart data={p95InputCostPerObservationData} dataKey="value" nameKey="name" layout="vertical" />
          </div>
        </WidgetCard>

        <WidgetCard title="Top 20 Users by Cost ($)" subtitle="Aggregated model cost (observation.totalCost) by trace...">
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart data={topUsersCostData} dataKey="value" nameKey="name" layout="vertical" />
          </div>
        </WidgetCard>

        <WidgetCard title="P 95 Output Cost per Observation ($)" subtitle="95th percentile of output cost for each observation (llm..." gridSpan={2}>
          <div style={{ width: '100%', height: '100%' }}>
            <LineChart data={p95OutputCostPerObservationData} dataKey="value" nameKey="name" />
          </div>
        </WidgetCard>

        <WidgetCard title="Top 20 Use Cases (Trace) by Cost ($)" subtitle="Aggregated model cost (observation.totalCost) by trace...">
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart data={topTracesCostData} dataKey="value" nameKey="name" />
          </div>
        </WidgetCard>

        <WidgetCard title="Top 20 Use Cases (Observation) by Cost ($)" subtitle="Aggregated model cost (observation.totalCost) by obse...">
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart data={topObservationsCostData} dataKey="value" nameKey="name" layout="vertical" />
          </div>
        </WidgetCard>
      </div>
    </div>
  );
};

export default DashboardDetail;