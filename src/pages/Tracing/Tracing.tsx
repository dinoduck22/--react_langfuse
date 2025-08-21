import { useState, useMemo, useEffect } from 'react';
import styles from './Tracing.module.css';
import { DataTable } from '../../components/DataTable/DataTable';
import { Trace } from './types'; // dummyTraces 대신 types에서 Trace 가져오기
import { traceTableColumns } from './traceColumns';
import SearchInput from '../../components/SearchInput/SearchInput';
import FilterControls from '../../components/FilterControls/FilterControls';
import TraceDetailPanel from './TraceDetailPanel';
import { useSearch } from '../../hooks/useSearch';
import ColumnVisibilityModal from './ColumnVisibilityModal'; // ✅ 모달 import
import { Column } from './types'; // ✅ Column 타입 import
import { fetchTraces } from './TracingApi'; // API 함수 import

const Tracing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Traces' | 'Observations'>('Traces');
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]); // 초기값을 빈 배열로 설정
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  const { searchQuery, setSearchQuery, filteredData: filteredTraces } = useSearch(traces); // useSearch에 traces 상태 전달
  
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [columns, setColumns] = useState<Column<Trace>[]>(
    traceTableColumns.map(c => ({ ...c, visible: true }))
  );

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
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

    loadTraces();
  }, []);
  
  const handleRowClick = (trace: Trace) => {
    setSelectedTrace(prev => (prev?.id === trace.id ? null : trace));
  };
  
  // ✅ 모든 컬럼 보이기/숨기기 함수
  const setAllColumnsVisible = (visible: boolean) => {
    setColumns(prev => prev.map(col => ({ ...col, visible })));
  };

  // ✅ toggleColumnVisibility 함수의 key 타입을 명확히 합니다.
  const toggleColumnVisibility = (key: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // ✅ 현재 보이는 컬럼만 필터링
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  return (
    <div className={`${styles.container} ${selectedTrace ? styles.containerWithDetail : ''}`}>
        {/* 1. 왼쪽 리스트 영역 */}
      <div className={styles.listSection}>
        
        <div className={styles.tabs}>
          <button className={`${styles.tabButton} ${activeTab === 'Traces' ? styles.active : ''}`} onClick={() => setActiveTab('Traces')}>Traces</button>
          <button className={`${styles.tabButton} ${activeTab === 'Observations' ? styles.active : ''}`} onClick={() => setActiveTab('Observations')}>Observations</button>
        </div>
        
        <div className={styles.filterBar}>
          <SearchInput placeholder="Search... IDs / Names" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {/* ✅ FilterControls에 props 전달 */}
          <FilterControls 
            onColumnsClick={() => setIsColumnModalOpen(true)}
            visibleColumnsCount={visibleColumns.length}
            totalColumnsCount={columns.length}
          />
        </div>
        
        <div className={styles.contentArea}>
          {activeTab === 'Traces' ? (
            isLoading ? (
                <div>Loading traces...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>Error: {error}</div>
            ) : (
                <DataTable<Trace>
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

      {/* ✅ 제네릭 타입을 명시하여 모달 호출 */}
      <ColumnVisibilityModal<Trace>
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