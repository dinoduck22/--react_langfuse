import React, { useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar } from 'lucide-react';
import styles from './WidgetNew.module.css';
import FormGroup from '../../components/Form/FormGroup';
import WidgetCard from '../../components/Dashboard/WidgetCard';
import TraceChart from '../../components/Chart/TraceChart';
import WidgetNewPopup from './WidgetNewPopup';
import dayjs from 'dayjs';

const WidgetNew: React.FC = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('Count(Trace)');
  const [description, setDescription] = useState('');
  const [viewType, setViewType] = useState('Trace');
  const [chartType, setChartType] = useState('LineChart');
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const dateRangeInputRef = useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').toDate());
  const [endDate, setEndDate] = useState(new Date());
  
  const formattedDateRange = useMemo(() => {
    const start = dayjs(startDate).format('MMM DD, YY : HH:mm');
    const end = dayjs(endDate).format('MMM DD, YY : HH:mm');
    return `${start} - ${end}`;
  }, [startDate, endDate]);

  const handleSave = () => {
    console.log({ name, description, viewType, chartType, startDate, endDate });
    alert(`Widget "${name}" saved! Check the console for details.`);
    navigate('/dashboards');
  };

  const handleCancel = () => {
    navigate('/dashboards');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
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
                <select
                id="widget-metrics"
                className="form-select"
                value=" "
                onChange={(e) => setViewType(e.target.value)}
                >
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
                htmlFor="d"
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
                <select
                id="widget-chart-type"
                className="form-select"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                >
                <option value="Table">Table</option>
                <option value="LineChart">Line Chart</option>
                <option value="BarChart">Bar Chart</option>
                <option value="DonutChart">Donut Chart</option>
                </select>
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
                <button className={styles.dateRangePreset}>Past 7...</button>
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
      
      {/* ---▼ `startDate`와 `endDate` props 전달하도록 수정 ▼--- */}
      {isDateRangePickerOpen && ReactDOM.createPortal(
        <WidgetNewPopup 
          startDate={startDate}
          endDate={endDate}
          triggerRef={dateRangeInputRef}
          onClose={() => setIsDateRangePickerOpen(false)} 
        />,
        document.body
      )}
      {/* ---▲ `startDate`와 `endDate` props 전달하도록 수정 ▲--- */}

      <div className={styles.previewContainer}>
        <h2 className={styles.previewHeader}>Preview</h2>
        <div className={styles.previewContent}>
          <WidgetCard title={name || 'Widget Preview'} subtitle={description}>
            {chartType === 'LineChart' && (
              <div style={{ width: '100%', height: '100%' }}>
                <TraceChart />
              </div>
            )}
            {chartType === 'Table' && <div>Table Preview Here</div>}
          </WidgetCard>
        </div>
      </div>
    </div>
  );
};

export default WidgetNew;