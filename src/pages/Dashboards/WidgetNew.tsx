import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import styles from './WidgetNew.module.css'; // 새로 만든 CSS 모듈 import
import FormGroup from '../../components/Form/FormGroup';
import WidgetCard from '../../components/Dashboard/WidgetCard';
import TraceChart from '../../components/Chart/TraceChart'; // 미리보기용 차트 import

const WidgetNew: React.FC = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('Count(Trace)');
  const [description, setDescription] = useState('');
  const [viewType, setViewType] = useState('Trace');
  const [chartType, setChartType] = useState('LineChart');
  const [filters, setFilters] = useState('');
  const [groupBy, setGroupBy] = useState('');

  const handleSave = () => {
    console.log({ name, description, viewType, chartType, filters, groupBy });
    alert(`Widget "${name}" saved! Check the console for details.`);
    navigate('/dashboards');
  };

  const handleCancel = () => {
    navigate('/dashboards');
  };

  return (
    <div className={styles.pageContainer}>
      {/* 왼쪽 폼 영역 */}
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <LayoutDashboard size={16} />
          <Link to="/dashboards">Dashboards</Link>
          <span>/</span>
          <Link to="/dashboards">Widgets</Link>
          <span>/</span>
          <span className="active">New widget</span>
        </header>

        <div className={styles.form}>          
            <h3 className={styles.subheading}>Data Selection</h3>

            {/* 데이터 소스 관련 설정 */}
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
          

          {chartType !== 'Table' && (
            <FormGroup
              htmlFor="widget-group-by"
              label="Group by"
              subLabel="Optional grouping for the chart."
            >
              <input
                id="widget-group-by"
                type="text"
                className="form-input"
                placeholder='e.g. name'
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              />
            </FormGroup>
          )}

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
            <textarea
                id="widget-description"
                className="form-textarea"
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

        </div>
        {/* 저장/취소 버튼 */}
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave} disabled={!name.trim()}>
            Save
          </button>
        </div>
      </div>





      {/* 오른쪽 미리보기 영역 */}
      <div className={styles.previewContainer}>
        <h2 className={styles.previewHeader}>Preview</h2>
        <div className={styles.previewContent}>
          <WidgetCard title={name || "Widget Preview"} subtitle={description}>
            {chartType === 'LineChart' && (
              <div style={{ width: '100%', height: '100%' }}>
                <TraceChart />
              </div>
            )}
             {chartType === 'Table' && (
              <div>Table Preview Here</div>
            )}
             {/* 다른 차트 타입에 대한 미리보기도 추가할 수 있습니다. */}
          </WidgetCard>
        </div>
      </div>
    </div>
  );
};

export default WidgetNew;