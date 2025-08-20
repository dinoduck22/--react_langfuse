import { useState } from 'react'; // useMemo는 useSearch 훅에서 사용되므로 여기선 제거
import styles from './Tracing.module.css';
import { DataTable } from '../../components/DataTable/DataTable';
import { dummyTraces, Trace } from '../../data/dummyTraces';
import { traceTableColumns } from './traceColumns';
import SearchInput from '../../components/SearchInput/SearchInput';
import FilterControls from '../../components/FilterControls/FilterControls';
import { useSearch } from '../../hooks/useSearch';
import TraceDetailPanel from './TraceDetailPanel'; // ✅ 상세 패널 import

const Tracing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Traces' | 'Observations'>('Traces');
  // ✅ 선택된 Trace 객체 전체를 저장하도록 상태 변경
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null); 
  
  const { searchQuery, setSearchQuery, filteredData: filteredTraces } = useSearch(dummyTraces);

  // ✅ 행 클릭 핸들러: 같은 행 클릭 시 패널 닫기(toggle) 기능 추가
  const handleRowClick = (trace: Trace) => {
    setSelectedTrace(prev => (prev?.id === trace.id ? null : trace));
  };

  return (
    // ✅ 선택된 Trace 유무에 따라 동적으로 클래스 적용
    <div className={`${styles.container} ${selectedTrace ? styles.containerWithDetail : ''}`}>
      {/* 1. 왼쪽 리스트 영역 */}
      <div className={styles.listSection}>
        <div className={styles.header}><h1>Tracing</h1></div>
        
        <div className={styles.tabs}>
          <button className={`${styles.tabButton} ${activeTab === 'Traces' ? styles.active : ''}`} onClick={() => setActiveTab('Traces')}>Traces</button>
          <button className={`${styles.tabButton} ${activeTab === 'Observations' ? styles.active : ''}`} onClick={() => setActiveTab('Observations')}>Observations</button>
        </div>
        
        <div className={styles.filterBar}>
          <SearchInput placeholder="Search... IDs / Names" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <FilterControls />
        </div>
        
        <div className={styles.contentArea}>
          {activeTab === 'Traces' ? (
            <DataTable<Trace>
              columns={traceTableColumns}
              data={filteredTraces}
              keyField="id"
              renderEmptyState={() => <div>No traces found.</div>}
              showActions={false}
              selectedRowKey={selectedTrace?.id || null} // ✅ 선택된 Trace의 ID 전달
              onRowClick={handleRowClick} // ✅ 객체 전체를 다루는 핸들러로 교체
            />
          ) : ( 
            <div>Observations View</div> 
          )}
        </div>
      </div>

      {/* 2. 오른쪽 상세 패널 영역 (선택된 Trace가 있을 때만 렌더링) */}
      {selectedTrace && (
        <TraceDetailPanel
          trace={selectedTrace}
          onClose={() => setSelectedTrace(null)}
        />
      )}
    </div>
  );
};

export default Tracing;