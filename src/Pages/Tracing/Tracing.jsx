// src/pages/Tracing/Tracing.jsx
import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { Columns, Plus, Edit, Star, Trash2 } from 'lucide-react'; // Star 아이콘을 lucide-react에서 직접 가져옵니다.
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

  // 즐겨찾기 상태를 토글하는 함수를 추가합니다.
  const toggleFavorite = (traceId, event) => {
    event.stopPropagation(); // 이벤트 버블링을 막아 행 클릭 이벤트를 방지합니다.
    setTraces(prevTraces =>
      prevTraces.map(trace =>
        trace.id === traceId ? { ...trace, isFavorited: !trace.isFavorited } : trace
      )
    );
  };

  // 기존 컬럼 정의에 즐겨찾기 핸들러를 추가하여 새로운 컬럼 배열을 생성합니다.
  const memoizedTraceTableColumns = useMemo(() => {
    return traceTableColumns.map(col => {
      if (col.key === 'favorite') {
        return {
          ...col,
          accessor: (row) => (
            <Star
              size={16}
              className={row.isFavorited ? styles.favorited : ''}
              onClick={(e) => toggleFavorite(row.id, e)}
              style={{ cursor: 'pointer' }} // 클릭 가능함을 나타내는 커서 스타일을 추가합니다.
            />
          ),
        };
      }
      return col;
    });
  }, [traces]); // traces가 변경될 때마다 즐겨찾기 아이콘이 리렌더링되도록 의존성 배열에 추가합니다.

  const [columns, setColumns] = useState(
    memoizedTraceTableColumns.map(c => ({ ...c, visible: true }))
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
  
  const handleUpdateClick = async () => {
    const traceNameToUpdate = window.prompt("업데이트할 Trace의 ID를 입력하세요:");

    if (!traceNameToUpdate || traceNameToUpdate.trim() === '') {
      return;
    }

    const traceToUpdate = traces.find(t => t.id === traceNameToUpdate.trim());

    if (!traceToUpdate) {
      alert(`ID '${traceNameToUpdate}'에 해당하는 Trace를 찾을 수 없습니다.`);
      return;
    }

    const langfuseTraceObject = langfuse.trace({ id: traceToUpdate.id, _dangerouslyIgnoreCorruptData: true });

    await updateTrace(langfuseTraceObject, loadTraces);
  };

  // 삭제 핸들러 함수 추가
  const handleDeleteTrace = useCallback((traceId) => {
    if (window.confirm(`정말로 이 트레이스를 삭제하시겠습니까? ID: ${traceId}`)) {
      setTraces(prevTraces => prevTraces.filter(trace => trace.id !== traceId));
      console.log(`Trace with ID: ${traceId} deleted.`);
      // TODO: API를 통해 실제 데이터 삭제 로직 추가
    }
  }, []);

  const handleRowClick = (trace) => { setSelectedTrace(prev => (prev?.id === trace.id ? null : trace)); };
  const setAllColumnsVisible = (visible) => { setColumns(prev => prev.map(col => ({ ...col, visible }))); };
  const toggleColumnVisibility = (key) => { setColumns(prev => prev.map(col => col.key === key ? { ...col, visible: !col.visible } : col)); };
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  // 기존 컬럼에 Actions(삭제 버튼) 컬럼을 추가
  const columnsWithActions = useMemo(() => [
    ...visibleColumns,
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <button
          className={styles.iconButton}
          onClick={(e) => {
            e.stopPropagation(); // 행 클릭 이벤트 전파 방지
            handleDeleteTrace(row.id);
          }}
          title={`Delete trace ${row.id}`}
        >
          <Trash2 size={16} />
        </button>
      ),
    }
  ], [visibleColumns, handleDeleteTrace]);


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
                  columns={columnsWithActions}
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