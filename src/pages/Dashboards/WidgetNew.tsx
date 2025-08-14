import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Calendar,
    LineChart as LineChartIcon,
    BarChartBig,
    Sigma,
    BarChartHorizontalBig,
    BarChart4,
    PieChart as PieChartIcon,
    Table2
} from 'lucide-react';
import styles from './WidgetNew.module.css';
import FormGroup from '../../components/Form/FormGroup';
import WidgetCard from '../../components/Dashboard/WidgetCard';
import WidgetNewPopup from './WidgetNewPopup';
import dayjs from 'dayjs';

// ---▼ 차트 컴포넌트 import 추가 ▼---
import LineChart from '../../components/Chart/LineChart';
import BarChart from '../../components/Chart/BarChart';
import PieChart from '../../components/Chart/PieChart';
import BigNumberChart from '../../components/Chart/BigNumberChart';
import HistogramChart from '../../components/Chart/HistogramChart';
// ---▲ 차트 컴포넌트 import 추가 ▲---

// --- Chart Type 옵션 데이터 ---
const chartTypeOptions = [
    { 
        group: 'Time Series', 
        options: [
            { value: 'LineChart', label: 'Line Chart', icon: <LineChartIcon size={16} /> },
            { value: 'VerticalBarChart', label: 'Vertical Bar Chart', icon: <BarChartBig size={16} /> }
        ]
    },
    {
        group: 'Total Value',
        options: [
            { value: 'BigNumber', label: 'Big Number', icon: <Sigma size={16} /> },
            { value: 'HorizontalBarChart', label: 'Horizontal Bar Chart', icon: <BarChartHorizontalBig size={16} /> },
            { value: 'Histogram', label: 'Histogram', icon: <BarChart4 size={16} /> },
            { value: 'PieChart', label: 'Pie Chart', icon: <PieChartIcon size={16} /> },
            { value: 'PivotTable', label: 'Pivot Table', icon: <Table2 size={16} /> }
        ]
    }
];

const dateRangeOptions = [
  { value: '5m', label: '5 min' },
  { value: '30m', label: '30 min' },
  { value: '1h', label: '1 hour' },
  { value: '3h', label: '3 hours' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '1M', label: '1 month' },
  { value: '3M', label: '3 months' },
  { value: '1y', label: '1 year' },
];
type DateRangePreset = typeof dateRangeOptions[number]['value'];

// ---▼ 미리보기 차트를 위한 더미 데이터 ▼---
const dummyChartData = [
    { name: 'GPT-4', value: 450 },
    { name: 'Claude 2', value: 320 },
    { name: 'GPT-3.5', value: 280 },
    { name: 'Llama 2', value: 180 },
];
// ---▲ 미리보기 차트를 위한 더미 데이터 ▲---

const WidgetNew: React.FC = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('Count(Trace)');
  const [description, setDescription] = useState('');
  const [viewType, setViewType] = useState('Trace');
  
  const [chartType, setChartType] = useState(chartTypeOptions[0].options[0]);
  const [isChartTypeOpen, setIsChartTypeOpen] = useState(false);
  const chartTypeRef = useRef<HTMLDivElement>(null);

  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const dateRangeInputRef = useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('7d');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartTypeRef.current && !chartTypeRef.current.contains(event.target as Node)) {
        setIsChartTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const newEndDate = new Date();
    let newStartDate: Date;

    const valueStr = dateRangePreset.slice(0, -1);
    const unit = dateRangePreset.slice(-1);
    const value = parseInt(valueStr) || 1; 

    switch (unit) {
      case 'm':
        newStartDate = dayjs(newEndDate).subtract(value, 'minute').toDate();
        break;
      case 'h':
        newStartDate = dayjs(newEndDate).subtract(value, 'hour').toDate();
        break;
      case 'd':
        newStartDate = dayjs(newEndDate).subtract(value, 'day').toDate();
        break;
      case 'M':
        newStartDate = dayjs(newEndDate).subtract(value, 'month').toDate();
        break;
      case 'y':
        newStartDate = dayjs(newEndDate).subtract(value, 'year').toDate();
        break;
      default:
        newStartDate = new Date();
    }
    
    setEndDate(newEndDate);
    setStartDate(newStartDate);

  }, [dateRangePreset]);
  
  const formattedDateRange = useMemo(() => {
    const start = dayjs(startDate).format('MMM DD, YY : HH:mm');
    const end = dayjs(endDate).format('MMM DD, YY : HH:mm');
    return `${start} - ${end}`;
  }, [startDate, endDate]);

  const handleSave = () => {
    console.log({ name, description, viewType, chartType: chartType.value, startDate, endDate });
    alert(`Widget "${name}" saved! Check the console for details.`);
    navigate('/dashboards');
  };

  const handleCancel = () => {
    navigate('/dashboards');
  };

  // ---▼ 선택된 차트 타입에 따라 미리보기를 렌더링하는 함수 ▼---
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
      case 'BigNumber':
        return <BigNumberChart value={totalValue.toLocaleString()} />;
      case 'PivotTable':
        return <div>Pivot Table Preview</div>;
      default:
        return <div>Select a chart type to see a preview.</div>;
    }
  };
  // ---▲ 선택된 차트 타입에 따라 미리보기를 렌더링하는 함수 ▲---

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
                <div className={styles.dateRangeContainer}>
                <div
                    ref={dateRangeInputRef}
                    className={styles.dateRangeInput}
                    onClick={() => setIsDateRangePickerOpen(true)}
                >
                    <Calendar size={16} />
                    <span>{formattedDateRange}</span>
                </div>
                <select
                    id="widget-date-range-preset"
                    className={styles.dateRangePreset}
                    value={dateRangePreset}
                    onChange={(e) => setDateRangePreset(e.target.value as DateRangePreset)}
                    >
                    {dateRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                </div>
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
      
      {isDateRangePickerOpen && ReactDOM.createPortal(
        <WidgetNewPopup 
          startDate={startDate}
          endDate={endDate}
          triggerRef={dateRangeInputRef}
          onClose={() => setIsDateRangePickerOpen(false)} 
        />,
        document.body
      )}

      {/* ---▼ 미리보기 영역에 동적 렌더링 함수 연결 ▼--- */}
      <div className={styles.previewContainer}>
        <h2 className={styles.previewHeader}>Preview</h2>
        <div className={styles.previewContent}>
          <WidgetCard title={name || 'Widget Preview'} subtitle={description}>
            {renderPreviewChart()}
          </WidgetCard>
        </div>
      </div>
       {/* ---▲ 미리보기 영역에 동적 렌더링 함수 연결 ▲--- */}
    </div>
  );
};

export default WidgetNew;