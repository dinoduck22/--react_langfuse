// src/pages/Tracing/Tracing.jsx
import { useState, useMemo, useEffect } from 'react';
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
import { Columns, Plus } from 'lucide-react';
import { handleCreateTrace } from './CreateTrace.jsx'; // 1. CreateTrace.jsx에서 함수 import

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
  
  useEffect(() => {
    loadTraces();
  }, []);
  
  // 2. 이전에 추가했던 handleCreateTrace 로직은 여기서 삭제합니다.

  const handleRowClick = (trace) => {
    setSelectedTrace(prev => (prev?.id === trace.id ? null : trace));
  };
  
  const setAllColumnsVisible = (visible) => {
    setColumns(prev => prev.map(col => ({ ...col, visible })));
  };

  const toggleColumnVisibility = (key) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  return (
    <div className={`${styles.container} ${selectedTrace ? styles.containerWithDetail : ''}`}>
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
          <div>
            {/* 3. onClick 핸들러에서 import한 함수를 호출하고, loadTraces를 콜백으로 전달합니다. */}
            <FilterButton onClick={() => handleCreateTrace(loadTraces)}>
              <Plus size={16} /> New Trace
            </FilterButton>
            <FilterButton onClick={() => setIsColumnModalOpen(true)} style={{marginLeft: '8px'}}>
              <Columns size={16} /> Columns ({visibleColumns.length}/{columns.length})
            </FilterButton>
          </div>
        </div>
        
        <div className={styles.contentArea}>
          {activeTab === 'Traces' ? (
            isLoading ? (
                <div>Loading traces...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>Error: {error}</div>
            ) : (
                <DataTable
                  columns={visibleColumns}
                  data={filteredTraces}
                  keyField="id"
                  renderEmptyState={() => <div>No traces found.</div>}
                  showActions={false}
                  selectedRowKey={selectedTrace?.id || null}
                  onRowClick={handleRowClick}
                />
            )
          ) : ( <div>Observations View</div> )}
        </div>
      </div>

      {selectedTrace && (
        <TraceDetailPanel
          trace={selectedTrace}
          onClose={() => setSelectedTrace(null)}
        />
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