import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LineChart as LineChartIcon,
    BarChartBig,
    Sigma,
    BarChartHorizontalBig,
    BarChart4,
    PieChart as PieChartIcon,
    Table2
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

const WidgetNew: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('Count(Trace)');
  const [description, setDescription] = useState('');
  const [viewType, setViewType] = useState('Trace');

  const [chartType, setChartType] = useState(chartTypeOptions[0].options[0]);
  const [isChartTypeOpen, setIsChartTypeOpen] = useState(false);
  const chartTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartTypeRef.current && !chartTypeRef.current.contains(event.target as Node)) {
        setIsChartTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      case 'BigNumber':
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
              <DateRangePicker />
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