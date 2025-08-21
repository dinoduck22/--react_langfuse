// src/pages/Tracing/Tracing.tsx
import { useState, useMemo, useEffect } from 'react';
import styles from './Tracing.module.css';
import { DataTable } from '../../components/DataTable/DataTable';
import { Trace } from './types';
import { traceTableColumns } from './traceColumns';
import SearchInput from '../../components/SearchInput/SearchInput';
import FilterControls from '../../components/FilterControls/FilterControls';
import TraceDetailPanel from './TraceDetailPanel';
import { useSearch } from '../../hooks/useSearch';
import ColumnVisibilityModal from './ColumnVisibilityModal';
import { Column } from './types';
import { fetchTraces } from './TracingApi';
import FilterButton from '../../components/FilterButton/FilterButton'; // FilterButton import
import { Columns } from 'lucide-react'; // Columns icon import

const Tracing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Traces' | 'Observations'>('Traces');
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchType, setSearchType] = useState<string>('IDs / Names');
  const { searchQuery, setSearchQuery, filteredData: filteredTraces } = useSearch(traces, searchType);
  
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [columns, setColumns] = useState<Column<Trace>[]>(
    traceTableColumns.map(c => ({ ...c, visible: true }))
  );

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
  
  const setAllColumnsVisible = (visible: boolean) => {
    setColumns(prev => prev.map(col => ({ ...col, visible })));
  };

  const toggleColumnVisibility = (key: string) => {
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
        
        {/* ▼▼▼ filterBar 레이아웃 수정 ▼▼▼ */}
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
          <FilterButton onClick={() => setIsColumnModalOpen(true)}>
            <Columns size={16} /> Columns ({visibleColumns.length}/{columns.length})
          </FilterButton>
        </div>
        {/* ▲▲▲ filterBar 레이아웃 수정 ▲▲▲ */}
        
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