import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
    LayoutDashboard,
    LineChart as LineChartIcon,
    AreaChart as AreaChartIcon, // 🔽 AreaChart 아이콘 import 추가
    BarChartBig,
    Sigma,
    BarChartHorizontalBig,
    BarChart4,
    PieChart as PieChartIcon,
    Table2,
    Plus,
    X,
} from 'lucide-react';
import styles from './WidgetNew.module.css';
import FormGroup from 'components/Form/FormGroup';
import WidgetCard from 'components/Dashboard/WidgetCard';
import DateRangePicker from 'components/DateRange/DateRangePicker'; 

// --- 차트 컴포넌트 import ---
import LineChart from 'components/Chart/LineChart';
import BarChart from 'components/Chart/BarChart';
import PieChart from 'components/Chart/PieChart';
import BigNumberChart from 'components/Chart/BigNumberChart';
import HistogramChart from 'components/Chart/HistogramChart';
import PivotTable from 'components/Chart/PivotTableChart';
// import AreaChart from 'components/Chart/AreaChart';

// ---▼ 분리된 더미 데이터 import ▼---
import { dummyChartData, dummyPivotData } from 'data/dummyWidgetData';

// 🔽 필터 타입 정의
type Filter = {
  id: number;
  column: string;
  operator: string;
  value: string;
};

// --- Chart Type 옵션 데이터 ---
const chartTypeOptions = [
    {
        group: 'Time Series',
        options: [
            { value: 'LineChart', label: 'Line Chart', icon: <LineChartIcon size={16} /> },
            { value: 'AreaChart', label: 'Area Chart', icon: <AreaChartIcon size={16} /> }, // 🔽 AreaChart 옵션 추가
            { value: 'VerticalBarChart', label: 'Vertical Bar Chart', icon: <BarChartBig size={16} /> }
        ]
    },
    {
        group: 'Total Value',
        options: [
            { value: 'BigNumberChart', label: 'Big Number', icon: <Sigma size={16} /> },
            { value: 'HorizontalBarChart', label: 'Horizontal Bar Chart', icon: <BarChartHorizontalBig size={16} /> },
            { value: 'Histogram', label: 'Histogram', icon: <BarChart4 size={16} /> },
            { value: 'PieChart', label: 'Pie Chart', icon: <PieChartIcon size={16} /> },
            { value: 'PivotTable', label: 'Pivot Table', icon: <Table2 size={16} /> }
        ]
    }
];

const WidgetNew: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 🔽 URL 파라미터 접근 훅
  
  // 🔽 URL 파라미터를 사용해 각 상태의 초기값 설정
  const [name, setName] = useState(searchParams.get('name') || 'Count(Trace)');
  const [description, setDescription] = useState(searchParams.get('description') || '');
  const [viewType, setViewType] = useState(searchParams.get('viewType') || 'Trace');

  // 🔽 필터 상태 추가
  const [filters, setFilters] = useState<Filter[]>([]);

  const findChartTypeFromValue = (value: string | null) => {
  if (!value) return chartTypeOptions[0].options[0];
  for (const group of chartTypeOptions) {
    const found = group.options.find(option => option.value === value);
    if (found) return found;
  }
  return chartTypeOptions[0].options[0];
};

  const [chartType, setChartType] = useState(() => findChartTypeFromValue(searchParams.get('chartType')));

  // 🔽 날짜 상태도 URL 파라미터로 초기화
  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') ? dayjs(searchParams.get('startDate')).toDate() : dayjs().subtract(7, 'day').toDate()
  );
  const [endDate, setEndDate] = useState(
    searchParams.get('endDate') ? dayjs(searchParams.get('endDate')).toDate() : new Date()
  );

  const chartTypeRef = useRef<HTMLDivElement>(null);
  const [isChartTypeOpen, setIsChartTypeOpen] = useState(false);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartTypeRef.current && !chartTypeRef.current.contains(event.target as Node)) {
        setIsChartTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ▼▼▼ 필터 관련 핸들러 함수 추가 ▼▼▼
  const addFilter = () => {
    setFilters(prev => [...prev, {
      id: Date.now(),
      column: 'Environment', // 기본값
      operator: 'is equal to',
      value: ''
    }]);
  };

  const removeFilter = (id: number) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const updateFilter = (id: number, field: keyof Omit<Filter, 'id'>, value: string) => {
    setFilters(prev => prev.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));
  };
  // ▲▲▲ 필터 관련 핸들러 함수 추가 ▲▲▲

  const handleSave = () => {
    // 저장 로직에서 날짜 관련 부분은 DateRangePicker의 상태를 참조해야 함 (지금은 단순 예시)
    console.log({ name, description, viewType, chartType: chartType.value });
    alert(`Widget "${name}" saved! Check the console for details.`);
    navigate('/dashboards');
  };

  const renderPreviewChart = () => {
    const chartStyle = { width: '100%', height: '100%' };
    const totalValue = dummyChartData.reduce((sum, item) => sum + item.value, 0);

    switch (chartType.value) {
      case 'LineChart':
        return <div style={chartStyle}><LineChart data={dummyChartData} dataKey="value" nameKey="name" /></div>;
      case 'VerticalBarChart':
        return <div style={chartStyle}><BarChart data={dummyChartData} dataKey="value" nameKey="name" layout="horizontal" /></div>;
      case 'HorizontalBarChart':
        return <div style={chartStyle}><BarChart data={dummyChartData} dataKey="value" nameKey="name" layout="vertical" /></div>;
      case 'Histogram':
        return <div style={chartStyle}><HistogramChart data={dummyChartData} dataKey="value" nameKey="name" /></div>;
      case 'PieChart':
        return <div style={chartStyle}><PieChart data={dummyChartData} dataKey="value" nameKey="name" /></div>;
      case 'BigNumberChart':
        return <BigNumberChart value={totalValue.toLocaleString()} />;
      case 'PivotTable':
        return <PivotTable data={dummyPivotData} rows={['model']} cols={['region']} value="value" />;
      default:
        return <div>Select a chart type to see a preview.</div>;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {/* ... (이전과 동일한 코드) ... */}
        <div className={styles.fixedHeader}>
          <header className={styles.breadcrumbs}>
            <LayoutDashboard size={16} />
            <Link to="/dashboards">Dashboards</Link>
            <span>/</span>
            <Link to="/dashboards">Widgets</Link>
            <span>/</span>
            <span className="active">New widget</span>
          </header>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>Widget Configuration</h2>
            <p className={styles.sublabel}>
              Configure your widget by selecting data and visualization options
            </p>
          </div>
        </div>

        <div className={styles.scrollableForm}>
            <h3 className={styles.subheading}>Data Selection</h3>
            <FormGroup
                htmlFor="widget-view"
                label="View"
                subLabel="The entity type this widget is based on."
            >
                <select
                  id="widget-view"
                  className="form-select"
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                >
                  <option value="Trace">Trace</option>
                  <option value="Observation">Observation</option>
                  <option value="Score">Score</option>
                </select>
            </FormGroup>
            <FormGroup
                htmlFor="widget-metrics"
                label="Metrics"
                subLabel="Optional filters to apply to the data."
            >
                <select id="widget-metrics" className="form-select">
                  <option value="Count">Count</option>
                  <option value="Latency">Latency</option>
                  <option value="Observations Count">Observations Count</option>
                  <option value="Scores Count">Scores Count</option>
                  <option value="Total Cost">Total Cost</option>
                  <option value="Total Tokens">Total Tokens</option>
                </select>
            </FormGroup>

            {/* ▼▼▼ 필터 섹션 추가 ▼▼▼ */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Filters</label>
              {filters.map((filter) => (
                <div key={filter.id} className={styles.filterRow}>
                  <span>Where</span>
                  <select
                    className="form-select"
                    value={filter.column}
                    onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                  >
                    <option>Environment</option>
                    <option>Trace Name</option>
                    <option>Observation Name</option>
                    <option>Score Name</option>
                    <option>Tags</option>
                    <option>User</option>
                    <option>Session</option>
                    <option>Metadata</option>
                    <option>Release</option>
                  </select>
                  <select
                    className="form-select"
                    value={filter.operator}
                    onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                  >
                    <option></option>
                  </select>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  />
                  <button onClick={() => removeFilter(filter.id)} className={styles.removeFilterBtn}>
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button onClick={addFilter} className={styles.addFilterBtn}>
                <Plus size={14} /> Add filter
              </button>
            </div>
            {/* ▲▲▲ 필터 섹션 추가 ▲▲▲ */}

            <h3 className={styles.subheading}>Visualization</h3>
            <FormGroup
                htmlFor="widget-name"
                label="Name"
                subLabel="Unique identifier for this widget."
            >
                <input
                  id="widget-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
            </FormGroup>
            <FormGroup
                htmlFor="widget-description"
                label="Description"
                subLabel="Optional description."
            >
                <input
                  id="widget-description"
                  type="text"
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
            </FormGroup>

            <FormGroup
                htmlFor="widget-chart-type"
                label="Chart Type"
                subLabel="The visualization type for this widget."
            >
                <div className={styles.customSelectContainer} ref={chartTypeRef}>
                    <button
                        className={styles.customSelectValue}
                        onClick={() => setIsChartTypeOpen(prev => !prev)}
                    >
                        {chartType.icon}
                        <span>{chartType.label}</span>
                    </button>
                    {isChartTypeOpen && (
                        <ul className={styles.customSelectOptions}>
                            {chartTypeOptions.map(group => (
                                <React.Fragment key={group.group}>
                                    <li className={styles.optionGroupLabel}>{group.group}</li>
                                    {group.options.map(option => (
                                        <li
                                            key={option.value}
                                            className={styles.option}
                                            onClick={() => {
                                                setChartType(option);
                                                setIsChartTypeOpen(false);
                                            }}
                                        >
                                            {option.icon}
                                            <span>{option.label}</span>
                                        </li>
                                    ))}
                                </React.Fragment>
                            ))}
                        </ul>
                    )}
                </div>
            </FormGroup>

            <FormGroup
                htmlFor="widget-date-range"
                label="Date Range"
                subLabel="The time range for the data."
            >
              <DateRangePicker 
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </FormGroup>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>

      <div className={styles.previewContainer}>
        <h2 className={styles.previewHeader}>Preview</h2>
        <div className={styles.previewContent}>
          <WidgetCard title={name || 'Widget Preview'} subtitle={description}>
            {renderPreviewChart()}
          </WidgetCard>
        </div>
      </div>
    </div>
  );
};

export default WidgetNew;