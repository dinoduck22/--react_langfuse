import React, { useState } from 'react'; // useState 추가
import { useParams } from 'react-router-dom';
import { Info, Filter, Plus } from 'lucide-react';
import WidgetCard from 'components/Dashboard/WidgetCard';
import DateRangePicker from 'components/DateRange/DateRangePicker';

// 스타일
import styles from './DashboardDetail.module.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// 필요한 모든 차트 컴포넌트를 import 합니다.
import AreaChart from 'components/Chart/AreaChart';
import BarChart from 'components/Chart/BarChart';
import PieChart from 'components/Chart/PieChart';
import LineChart from 'components/Chart/LineChart';
import BigNumberChart from 'components/Chart/BigNumberChart';
import HistogramChart from 'components/Chart/HistogramChart';
import PivotTable from 'components/Chart/PivotTableChart';

// add widget 버튼
import AddWidgetModal from './AddWidgetModal'; // 🔽 모달 컴포넌트 import

import {
  totalTraces,
  costByModelData,
  costByEnvironmentData,
  totalCostData,
  topUsersCostData,
  dummyPivotData,
} from 'data/dummyDashboardDetailData';
import { DUMMY_DASHBOARDS } from 'data/dummyDashboardData'; // 2. 대시보드 목록 데이터 import

// 🔽 ResponsiveGridLayout 컴포넌트를 사용하기 위해 WidthProvider로 감싸줍니다.
const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardDetail: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>(); // 3. URL에서 dashboardId 추출
  const [isAddWidgetModalOpen, setAddWidgetModalOpen] = useState(false); // 🔽 모달 상태 추가

  // 4. dashboardId를 이용해 현재 대시보드 정보 찾기
  const currentDashboard = DUMMY_DASHBOARDS.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, '-') === dashboardId
  );

  // 🔽 위젯들의 레이아웃 상태 정의
  const [layout, setLayout] = useState([
    { i: 'total-traces', x: 0, y: 0, w: 1, h: 1 },
    { i: 'total-observations', x: 1, y: 0, w: 1, h: 1 },
    { i: 'total-costs', x: 2, y: 0, w: 2, h: 1 },
    { i: 'cost-by-model', x: 0, y: 1, w: 1, h: 1.5 },
    { i: 'cost-by-env', x: 1, y: 1, w: 1, h: 1.5 },
    { i: 'top-users', x: 2, y: 1, w: 2, h: 1.5 },
    { i: 'cost-distribution', x: 0, y: 2.5, w: 1, h: 1.5 },
    { i: 'cost-by-model-region', x: 1, y: 2.5, w: 2, h: 1.5 },
  ]);

  const onLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
    // 레이아웃 변경 시 상태를 업데이트 할 수 있습니다 (선택 사항)
    // setLayout(newLayout);
  };

  const totalEnvCost = costByEnvironmentData.reduce((sum, item) => sum + item.value, 0).toFixed(3);

  // 5. 대시보드 정보가 없을 경우 처리
  if (!currentDashboard) {
    return (
      <div className={styles.container}>
        <h1>Dashboard not found</h1>
      </div>
    );
  }

  // 🔽 모달에서 위젯 추가 시 실행될 핸들러 (지금은 콘솔에 로그만 출력)
  const handleAddWidget = (widgetId: string) => {
    console.log("Adding widget:", widgetId);
    // 여기에 실제 대시보드에 위젯을 추가하는 로직을 구현할 수 있습니다.
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          {/* 6. 제목을 동적으로 변경 */}
          <h1 className={styles.title}>{currentDashboard.name}</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        {/* ▼▼▼ 이미지처럼 Add Widget 버튼 추가 ▼▼▼ */}
        <button className={styles.addWidgetButton} onClick={() => setAddWidgetModalOpen(true)}>
          <Plus size={16} /> Add Widget
        </button>
      </div>

      <div className={styles.filterBar}>
        <DateRangePicker />
        <button className={styles.filterButton}><Filter size={14} /> Filters</button>
      </div>

      {/* 🔽 기존 grid div를 ResponsiveGridLayout으로 교체 */}
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={180} // 행 높이 조절
        onLayoutChange={onLayoutChange}
      >
        {/* 각 위젯을 div로 감싸고 고유한 key를 부여합니다. */}
        <div key="total-traces">
          <WidgetCard title="Total Traces" subtitle="Shows the count of Traces">
            <BigNumberChart value={totalTraces} />
          </WidgetCard>
        </div>
        <div key="total-observations">
          <WidgetCard title="Total Observations" subtitle="Shows the count of Observations">
            <AreaChart data={totalCostData} dataKey="value" nameKey="name" />
          </WidgetCard>
        </div>
        <div key="total-costs">
          <WidgetCard title="Total costs ($)" subtitle="Total cost across all use cases">
            <LineChart data={totalCostData} dataKey="value" nameKey="name" />
          </WidgetCard>
        </div>
        <div key="cost-by-model">
          <WidgetCard title="Cost by Model Name ($)" subtitle="Total cost broken down by model name">
            <BarChart data={costByModelData} dataKey="value" nameKey="name" layout="horizontal" />
          </WidgetCard>
        </div>
        <div key="cost-by-env">
          <WidgetCard title="Cost by Environment ($)" subtitle="Total cost broken down by trace.environment">
            <div className={styles.pieContainer}>
              <PieChart data={costByEnvironmentData} dataKey="value" nameKey="name" />
              <div className={styles.pieCenter}>
                <div className={styles.pieTotal}>${totalEnvCost}</div>
                <div className={styles.pieSubtitle}>Total</div>
              </div>
            </div>
          </WidgetCard>
        </div>
        <div key="top-users">
          <WidgetCard title="Top Users by Cost ($)" subtitle="Aggregated model cost by user">
            <BarChart data={topUsersCostData} dataKey="value" nameKey="name" layout="vertical" />
          </WidgetCard>
        </div>
        <div key="cost-distribution">
          <WidgetCard title="Cost Distribution" subtitle="Distribution of costs">
            <HistogramChart data={costByModelData} dataKey="value" nameKey="name" />
          </WidgetCard>
        </div>
        <div key="cost-by-model-region">
          <WidgetCard title="Costs by Model and Region" subtitle="Pivot table summary">
            <PivotTable data={dummyPivotData} rows={['model']} cols={['region']} value="value" />
          </WidgetCard>
        </div>
      </ResponsiveGridLayout>

      {/* 🔽 모달을 조건부로 렌더링 */}
      {isAddWidgetModalOpen && (
        <AddWidgetModal
          onClose={() => setAddWidgetModalOpen(false)}
          onAddWidget={handleAddWidget}
        />
      )}

    </div>
  );
};

export default DashboardDetail;