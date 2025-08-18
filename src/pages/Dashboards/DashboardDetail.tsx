// src/pages/Dashboards/DashboardDetail.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 🔽 useNavigate 추가
import dayjs from 'dayjs'; // 🔽 dayjs 추가import styles from './DashboardDetail.module.css';
import { Info, Filter, Plus } from 'lucide-react';
import WidgetCard from 'components/Dashboard/WidgetCard';
import DateRangePicker from 'components/DateRange/DateRangePicker';
import styles from './DashboardDetail.module.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Chart Components
import AreaChart from 'components/Chart/AreaChart';
import BarChart from 'components/Chart/BarChart';
import PieChart from 'components/Chart/PieChart';
import LineChart from 'components/Chart/LineChart';
import BigNumberChart from 'components/Chart/BigNumberChart';
import HistogramChart from 'components/Chart/HistogramChart';
import PivotTable from 'components/Chart/PivotTableChart';

// Data
import { DUMMY_DASHBOARDS } from 'data/dummyDashboardData';
import * as dummyData from 'data/dummyDashboardDetailData';
import { DUMMY_WIDGETS, type Widget } from 'data/dummyAddWidgetModal';

import AddWidgetModal from './AddWidgetModal';

const ResponsiveGridLayout = WidthProvider(Responsive);

// 🔽 기본 위젯 데이터 정의
const initialWidgets: Widget[] = [
  { id: 'total-traces', name: 'Total Traces', description: 'Shows the count of Traces', viewType: 'Traces', chartType: 'BigNumberChart' },
  { id: 'total-observations', name: 'Total Observations', description: 'Shows the count of Observations', viewType: 'Observations', chartType: 'AreaChart' },
  { id: 'total-costs', name: 'Total costs ($)', description: 'Total cost across all use cases', viewType: 'Traces', chartType: 'LineChart' },
  { id: 'cost-by-model', name: 'Cost by Model Name ($)', description: 'Total cost broken down by model name', viewType: 'Observations', chartType: 'VerticalBarChart' },
  { id: 'cost-by-env', name: 'Cost by Environment ($)', description: 'Total cost broken down by trace.environment', viewType: 'Traces', chartType: 'PieChart' },
  { id: 'top-users', name: 'Top Users by Cost ($)', description: 'Aggregated model cost by user', viewType: 'Users', chartType: 'HorizontalBarChart' },
  { id: 'cost-distribution', name: 'Cost Distribution', description: 'Distribution of costs', viewType: 'Traces', chartType: 'Histogram' },
  { id: 'cost-by-model-region', name: 'Costs by Model and Region', description: 'Pivot table summary', viewType: 'Observations', chartType: 'PivotTable' },
];

// 🔽 기본 레이아웃 정의
const initialLayout: ReactGridLayout.Layout[] = [
  { i: 'total-traces', x: 0, y: 0, w: 1, h: 1 },
  { i: 'total-observations', x: 1, y: 0, w: 1, h: 1.5 },
  { i: 'total-costs', x: 2, y: 0, w: 2, h: 1 },
  { i: 'cost-by-model', x: 0, y: 1, w: 1, h: 1.5 },
  { i: 'cost-by-env', x: 1, y: 1, w: 1, h: 1.5 },
  { i: 'top-users', x: 2, y: 1, w: 2, h: 1.5 },
  { i: 'cost-distribution', x: 0, y: 2.5, w: 1, h: 1.5 },
  { i: 'cost-by-model-region', x: 1, y: 2.5, w: 2, h: 1.5 },
];


// 차트 타입에 따라 적절한 컴포넌트를 렌더링하는 헬퍼 함수
const renderChart = (widget: Widget) => {
  const chartStyle = { width: '100%', height: '100%' };
  const totalEnvCost = dummyData.costByEnvironmentData.reduce((sum, item) => sum + item.value, 0).toFixed(3);

  switch (widget.chartType) {
    case 'BigNumberChart':
      return <BigNumberChart value={dummyData.totalTraces} />;
    case 'AreaChart':
        return <div style={chartStyle}><AreaChart data={dummyData.totalCostData} dataKey="value" nameKey="name" /></div>;
    case 'LineChart':
      return <div style={chartStyle}><LineChart data={dummyData.totalCostData} dataKey="value" nameKey="name" /></div>;
    case 'VerticalBarChart':
      return <div style={chartStyle}><BarChart data={dummyData.costByModelData} dataKey="value" nameKey="name" layout="horizontal" /></div>;
    case 'HorizontalBarChart':
        return <div style={chartStyle}><BarChart data={dummyData.topUsersCostData} dataKey="value" nameKey="name" layout="vertical" /></div>;
    case 'PieChart':
      return (
        <div className={styles.pieContainer}>
          <PieChart data={dummyData.costByEnvironmentData} dataKey="value" nameKey="name" />
          <div className={styles.pieCenter}>
            <div className={styles.pieTotal}>${totalEnvCost}</div>
            <div className={styles.pieSubtitle}>Total</div>
          </div>
        </div>
      );
    case 'Histogram':
        return <div style={chartStyle}><HistogramChart data={dummyData.costByModelData} dataKey="value" nameKey="name" /></div>;
    case 'PivotTable':
        return <PivotTable data={dummyData.dummyPivotData} rows={['model']} cols={['region']} value="value" />;
    default:
      return <div>Chart for "{widget.chartType}" not implemented yet.</div>;
  }
};


const DashboardDetail: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate(); // 🔽 navigate 함수 초기화
  const currentDashboard = DUMMY_DASHBOARDS.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, '-') === dashboardId
  );

  const [isAddWidgetModalOpen, setAddWidgetModalOpen] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>(initialLayout);

  // 🔽 날짜 상태를 DashboardDetail에서 직접 관리
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').toDate());
  const [endDate, setEndDate] = useState(new Date());

  const handleAddWidget = (widgetId: string) => {
    const widgetToAdd = DUMMY_WIDGETS.find(w => w.id === widgetId);
    if (!widgetToAdd) return;

    const newWidget = { ...widgetToAdd, id: `${widgetToAdd.id}-${Date.now()}` };
    const newLayoutItem = {
      i: newWidget.id,
      x: (widgets.length * 2) % 4,
      y: Math.floor(widgets.length / 2) * 2,
      w: 2,
      h: 2,
    };

    setWidgets(prev => [...prev, newWidget]);
    setLayouts(prev => [...prev, newLayoutItem]);
  };

  // ▼▼▼ 위젯 삭제 처리 함수 추가 ▼▼▼
  const handleDeleteWidget = (widgetId: string) => {
    // 사용자에게 삭제 여부를 재차 확인
    const confirmDelete = window.confirm(
      `"${widgets.find(w => w.id === widgetId)?.name}"를 삭제 하시겠습니까?`
    );

    if (confirmDelete) {
      // 확인을 누르면 해당 위젯과 레이아웃 정보를 상태에서 제거
      setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== widgetId));
      setLayouts(prevLayouts => prevLayouts.filter(layout => layout.i !== widgetId));
    }
  };

  // 🔽 위젯 복사 처리 함수 추가
  const handleCopyWidget = (widgetId: string) => {
    const widgetToCopy = widgets.find(w => w.id === widgetId);
    if (!widgetToCopy) return;

    const params = new URLSearchParams();
    params.append('name', widgetToCopy.name);
    params.append('description', widgetToCopy.description);
    params.append('viewType', widgetToCopy.viewType);
    params.append('chartType', widgetToCopy.chartType);
    // 현재 설정된 날짜 범위를 ISO 문자열로 변환하여 추가
    params.append('startDate', startDate.toISOString());
    params.append('endDate', endDate.toISOString());

    navigate(`/dashboards/widgets/new?${params.toString()}`);
  };

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
          <h1 className={styles.title}>{currentDashboard.name}</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        <button className={styles.addWidgetButton} onClick={() => setAddWidgetModalOpen(true)}>
          <Plus size={16} /> Add Widget
        </button>
      </div>

      <div className={styles.filterBar}>
        {/* 🔽 관리하는 상태와 함수를 DateRangePicker에 전달 */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <button className={styles.filterButton}><Filter size={14} /> Filters</button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={180}
        onLayoutChange={(layout) => setLayouts(layout)}
        draggableHandle=".drag-handle" // 🔽 이 속성을 추가합니다.
      >
        {widgets.map(widget => (
          <div key={widget.id}>
            <WidgetCard
              title={`${widget.name} (${widget.viewType})`}
              subtitle={widget.description}
              onDelete={() => handleDeleteWidget(widget.id)} // 🔽 onDelete prop 전달
              onCopy={() => handleCopyWidget(widget.id)} // 🔽 onCopy 핸들러 연결
            >
              {renderChart(widget)}
            </WidgetCard>
          </div>
        ))}
      </ResponsiveGridLayout>

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