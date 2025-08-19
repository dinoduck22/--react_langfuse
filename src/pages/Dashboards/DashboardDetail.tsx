// src/pages/Dashboards/DashboardDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 🔽 useNavigate 추가
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

// Data and API
import { DUMMY_DASHBOARDS } from "data/dummyDashboardData";
import { DUMMY_WIDGETS, type Widget } from "data/dummyAddWidgetModal";
import { fetchMetrics, MetricDataPoint, MetricsApiParams } from "./metricsApi"; // API 함수 및 타입 import

// Modal and Utils
import AddWidgetModal from './AddWidgetModal';
import { downloadAsCSV } from 'lib/csvUtils'; // 🔽 CSV 유틸리티 import
import dayjs from 'dayjs';

const ResponsiveGridLayout = WidthProvider(Responsive);

// 🔽 기본 위젯 데이터 정의
const initialWidgets: Widget[] = [
  { id: 'total-traces', name: 'Total Traces', description: 'Shows the count of Traces', viewType: 'Traces', chartType: 'BigNumberChart' },
  { id: 'total-observations', name: 'Total Observations', description: 'Shows the count of Observations', viewType: 'Observations', chartType: 'BigNumberChart' },
  { id: 'total-costs', name: 'Total costs ($)', description: 'Total cost across all use cases', viewType: 'Traces', chartType: 'LineChart' },
  { id: 'cost-by-model', name: 'Cost by Model Name ($)', description: 'Total cost broken down by model name', viewType: 'Observations', chartType: 'VerticalBarChart' },
  { id: 'cost-by-env', name: 'Cost by Environment ($)', description: 'Total cost broken down by trace.environment', viewType: 'Traces', chartType: 'PieChart' },
  { id: 'top-users', name: 'Top Users by Cost ($)', description: 'Aggregated model cost by user', viewType: 'Traces', chartType: 'HorizontalBarChart' },
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

const getApiParamsForWidget = (widget: Widget, from: string, to: string): MetricsApiParams | null => {
    const view = widget.viewType.toLowerCase() as MetricsApiParams['view'];
    const baseParams = { fromTimestamp: from, toTimestamp: to };

    switch (widget.id) {
        case 'total-traces':
            return { ...baseParams, view: 'traces', metrics: [{ measure: 'count', aggregation: 'sum' }] };
        case 'total-observations':
            return { ...baseParams, view: 'observations', metrics: [{ measure: 'count', aggregation: 'sum' }] };
        case 'total-costs':
            return {
                ...baseParams,
                view: 'traces',
                metrics: [{ measure: 'totalCost', aggregation: 'sum' }],
                timeDimension: { granularity: 'day' }
            };
        case 'cost-by-model':
            return {
                ...baseParams,
                view: 'observations',
                metrics: [{ measure: 'totalCost', aggregation: 'sum' }],
                groupBy: [{ field: 'model' }]
            };
        case 'cost-by-env':
             return {
                ...baseParams,
                view: 'traces',
                metrics: [{ measure: 'totalCost', aggregation: 'sum' }],
                groupBy: [{ field: 'environment' }]
            };
        case 'top-users':
            return {
                ...baseParams,
                view: 'traces',
                metrics: [{ measure: 'totalCost', aggregation: 'sum' }],
                groupBy: [{ field: 'userId' }],
                config: { row_limit: 10 }
            };
        default:
            return null;
    }
};

const DashboardDetail: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const navigate = useNavigate(); // 🔽 navigate 함수 초기화
  const currentDashboard = DUMMY_DASHBOARDS.find(
    (d) => d.name.toLowerCase().replace(/\s+/g, '-') === dashboardId
  );
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>(initialLayout);

  // API 데이터, 로딩, 에러 상태 관리
  const [widgetData, setWidgetData] = useState<Record<string, MetricDataPoint[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  
  const [isAddWidgetModalOpen, setAddWidgetModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').toDate());
  const [endDate, setEndDate] = useState(new Date());

  // Metrics API 호출 로직
  useEffect(() => {
    const fetchAllWidgetData = async () => {
        const fromISO = startDate.toISOString();
        const toISO = endDate.toISOString();

        for (const widget of initialWidgets) {
            setLoading(prev => ({ ...prev, [widget.id]: true }));
            setError(prev => ({ ...prev, [widget.id]: null }));

            const params = getApiParamsForWidget(widget, fromISO, toISO);

            if (!params) {
                setLoading(prev => ({ ...prev, [widget.id]: false }));
                continue;
            }

            try {
                const response = await fetchMetrics(params);
                setWidgetData(prev => ({ ...prev, [widget.id]: response.data }));
            } catch (e) {
                // e가 Error 인스턴스인지 확인하여 구체적인 에러 메시지를 상태에 저장
                if (e instanceof Error) {
                    setError(prev => ({ ...prev, [widget.id]: e.message }));
                } else {
                    setError(prev => ({ ...prev, [widget.id]: 'An unknown error occurred.' }));
                }
            } finally {
                setLoading(prev => ({ ...prev, [widget.id]: false }));
            }
        }
    };

    fetchAllWidgetData();
  }, [startDate, endDate]); // 날짜 범위가 변경되면 데이터를 다시 불러옵니다.

  const renderChart = (widget: Widget) => {
    const data = widgetData[widget.id];
    const isLoading = loading[widget.id];
    const fetchError = error[widget.id];

    if (isLoading) return <div>Loading...</div>;
    if (fetchError) return <div>Error: {fetchError}</div>;
    if (!data) return <div>No data available.</div>;
    
    const chartStyle = { width: '100%', height: '100%' };

    switch (widget.chartType) {
      case 'BigNumberChart':{
        const countKey = Object.keys(data[0] || {}).find(k => k.includes('count')) || 'value';
        return <BigNumberChart value={data[0]?.[countKey] as number || 0} />;
      }
      case 'LineChart':
          return <div style={chartStyle}><LineChart data={data} dataKey="totalCost_sum" nameKey="time" /></div>;
      case 'VerticalBarChart':
          return <div style={chartStyle}><BarChart data={data} dataKey="totalCost_sum" nameKey="model" layout="horizontal" /></div>;
      case 'HorizontalBarChart':{
        const sortedData = [...data].sort((a, b) => (b.totalCost_sum as number) - (a.totalCost_sum as number));
        return <div style={chartStyle}><BarChart data={sortedData} dataKey="totalCost_sum" nameKey="userId" layout="vertical" /></div>;
      }
      case 'PieChart':
            return <div style={chartStyle}><PieChart data={data} dataKey="totalCost_sum" nameKey="environment" /></div>;
    default:
      return <div>Chart for "{widget.chartType}" not implemented yet.</div>;
    }
  };

  if (!currentDashboard) {
    return (
      <div className={styles.container}>
        <h1>Dashboard not found</h1>
      </div>
    );
  }

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

  // ▼▼▼ 위젯 데이터 다운로드 핸들러 함수 추가 ▼▼▼
  const handleDownloadWidgetData = (widget: Widget) => {
    const dataToDownload = getWidgetData(widget);
    const filename = widget.name.toLowerCase().replace(/[^a-z0-9]/g, '-'); // 파일 이름 정규화
    downloadAsCSV(dataToDownload, filename);
  };

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
              onDownload={() => handleDownloadWidgetData(widget)} // 🔽 onDownload prop 전달
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