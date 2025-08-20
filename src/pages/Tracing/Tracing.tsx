import { useState, useMemo } from 'react';
import styles from './Tracing.module.css';
import { DataTable } from '../../components/DataTable/DataTable';
import { dummyTraces, Trace } from '../../data/dummyTraces';
import { traceTableColumns } from './traceColumns';
import SearchInput from '../../components/SearchInput/SearchInput';
import FilterControls from '../../components/FilterControls/FilterControls';
import TraceDetailPanel from './TraceDetailPanel';
import { useSearch } from '../../hooks/useSearch';
import ColumnVisibilityModal from './ColumnVisibilityModal'; // ✅ 모달 import
import { Column } from './types'; // ✅ Column 타입 import

const Tracing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Traces' | 'Observations'>('Traces');
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const { searchQuery, setSearchQuery, filteredData: filteredTraces } = useSearch(dummyTraces);
  
  // ✅ 모달 상태 및 컬럼 상태 추가
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [columns, setColumns] = useState<Column<Trace>[]>(
    traceTableColumns.map(c => ({ ...c, visible: true }))
  );
  
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
      <div className={styles.listSection}>
        {/* ... (헤더, 탭) ... */}
        
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
            <DataTable<Trace>
              columns={visibleColumns} // ✅ 보이는 컬럼만 DataTable에 전달
              data={filteredTraces}
              keyField="id"
              renderEmptyState={() => <div>No traces found.</div>}
              showActions={false}
              selectedRowKey={selectedTrace?.id || null}
              onRowClick={handleRowClick}
            />
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