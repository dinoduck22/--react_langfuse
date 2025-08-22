// src/pages/Tracing/Tracing.jsx
import { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Tracing.module.css';
import { DataTable } from 'components/DataTable/DataTable';
import { traceTableColumns } from './traceColumns.jsx';
import SearchInput from 'components/SearchInput/SearchInput';
import FilterControls from 'components/FilterControls/FilterControls';
import TraceDetailPanel from './TraceDetailPanel.jsx';
import { useSearch } from '../../hooks/useSearch.js';
import ColumnVisibilityModal from './ColumnVisibilityModal.jsx';
import { fetchTraces } from './TracingApi';
import FilterButton from 'components/FilterButton/FilterButton';
import { Columns, Plus, Edit } from 'lucide-react';
import { createTrace, updateTrace } from './CreateTrace.jsx';
import { langfuse } from '../../lib/langfuse';

const Tracing = () => {
  const [activeTab, setActiveTab] = useState('Traces');
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [traces, setTraces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchType, setSearchType] = useState('IDs / Names');
  const { searchQuery, setSearchQuery, filteredData: filteredTraces } = useSearch(traces, searchType);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [columns, setColumns] = useState(
    traceTableColumns.map(c => ({ ...c, visible: true }))
  );

  const loadTraces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTraces = await fetchTraces();
      setTraces(fetchedTraces);
    } catch (err) {
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => { loadTraces(); }, []);

  const handleCreateClick = () => {
    createTrace(loadTraces);
  };
  
  // "Update Trace" 버튼 클릭 핸들러도 async 함수로 변경
  const handleUpdateClick = async () => {
    const traceNameToUpdate = window.prompt("업데이트할 Trace의 Name을 입력하세요:");

    if (!traceNameToUpdate || traceNameToUpdate.trim() === '') {
      return;
    }

    const traceToUpdate = traces.find(t => t.name === traceNameToUpdate.trim());

    if (!traceToUpdate) {
      alert(`Name '${traceNameToUpdate}'에 해당하는 Trace를 찾을 수 없습니다.`);
      return;
    }

    const langfuseTraceObject = langfuse.trace({ id: traceToUpdate.id, _dangerouslyIgnoreCorruptData: true });

    // await 키워드 추가
    await updateTrace(langfuseTraceObject, loadTraces);
  };

  const handleRowClick = (trace) => { setSelectedTrace(prev => (prev?.id === trace.id ? null : trace)); };
  const setAllColumnsVisible = (visible) => { setColumns(prev => prev.map(col => ({ ...col, visible }))); };
  const toggleColumnVisibility = (key) => { setColumns(prev => prev.map(col => col.key === key ? { ...col, visible: !col.visible } : col)); };
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  return (
    <div className={styles.container}>
      <div className={styles.listSection}>
        
        <div className={styles.tabs}>
          <button className={`${styles.tabButton} ${activeTab === 'Traces' ? styles.active : ''}`} onClick={() => setActiveTab('Traces')}>Traces</button>
          <button className={`${styles.tabButton} ${activeTab === 'Observations' ? styles.active : ''}`} onClick={() => setActiveTab('Observations')}>Observations</button>
        </div>
        
        <div className={styles.filterBar}>
          <div className={styles.filterLeftGroup}>
            <SearchInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              searchType={searchType}
              setSearchType={setSearchType}
              searchTypes={['IDs / Names', 'Full Text']}
            />
            <FilterControls />
          </div>
          <div className={styles.filterRightGroup}>
            <FilterButton onClick={handleCreateClick}>
              <Plus size={16} /> New Trace
            </FilterButton>

            <FilterButton onClick={handleUpdateClick} style={{marginLeft: '8px'}}>
              <Edit size={16} /> Update Trace
            </FilterButton>

            <FilterButton onClick={() => setIsColumnModalOpen(true)} style={{marginLeft: '8px'}}>
              <Columns size={16} /> Columns ({visibleColumns.length}/{columns.length})
            </FilterButton>
          </div>
        </div>
        
        <div className={styles.contentArea}>
          {activeTab === 'Traces' ? (
            isLoading ? ( <div>Loading traces...</div> ) : 
            error ? ( <div style={{ color: 'red' }}>Error: {error}</div> ) : 
            (
                <DataTable
                  columns={visibleColumns}
                  data={filteredTraces}
                  keyField="id"
                  renderEmptyState={() => <div>No traces found.</div>}
                  showActions={false}
                  onRowClick={handleRowClick}
                  selectedRowKey={selectedTrace?.id || null}
                />
            )
          ) : ( <div>Observations View</div> )}
        </div>
      </div>

      {selectedTrace && ReactDOM.createPortal(
        <TraceDetailPanel
          trace={selectedTrace}
          onClose={() => setSelectedTrace(null)}
        />,
        document.body
      )}

      <ColumnVisibilityModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        toggleColumnVisibility={toggleColumnVisibility}
        setAllColumnsVisible={setAllColumnsVisible}
      />
    </div>
  );
};

export default Tracing;