// src/pages/Tracing/Tracing.tsx
import { useState, useMemo } from 'react';
import styles from './Tracing.module.css';
import { DataTable } from '../../components/DataTable/DataTable';
import { dummyTraces, Trace } from '../../data/dummyTraces';
import { traceTableColumns } from './traceColumns';
import SearchInput from '../../components/SearchInput/SearchInput'; // 신규
import FilterControls from '../../components/FilterControls/FilterControls'; // 신규
import { useSearch } from '../../hooks/useSearch'; // ✅ useSearch 훅 import

const Tracing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Traces' | 'Observations'>('Traces');
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null); // ✅ 선택된 행 ID 상태 추가

  // ✅ useSearch 훅을 사용하여 검색 로직 적용
  const { searchQuery, setSearchQuery, filteredData: filteredTraces } = useSearch(dummyTraces);

  return (
    <div className={styles.container}>
      {/* 1. 페이지 헤더 */}
      <div className={styles.header}>
        <h1>Tracing</h1>
      </div>

      {/* 2. 탭 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'Traces' ? styles.active : ''}`}
          onClick={() => setActiveTab('Traces')}
        >
          Traces
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'Observations' ? styles.active : ''}`}
          onClick={() => setActiveTab('Observations')}
        >
          Observations
        </button>
      </div>

      {/* 3. 필터 바 */}
      <div className={styles.filterBar}>
        <SearchInput
            placeholder="Search... IDs / Names"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterControls />
      </div>

      {/* 4. 테이블 컨텐츠 */}
      <div className={styles.contentArea}>
        {activeTab === 'Traces' ? (
          <DataTable<Trace>
            columns={traceTableColumns}
            data={filteredTraces}
            keyField="id"
            renderEmptyState={() => <div>No traces found.</div>}
            showActions={false}
            selectedRowKey={selectedTraceId} // ✅ 선택된 행의 key 전달
            onRowClick={(row) => setSelectedTraceId(row.id)} // ✅ 행 클릭 시 상태 업데이트
          />
        ) : (
          <div>Observations View</div>
        )}
      </div>
    </div>
  );
};

export default Tracing;