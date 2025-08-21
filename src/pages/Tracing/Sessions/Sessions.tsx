// src/pages/Tracing/Sessions/Sessions.tsx
import { useState, useMemo, useEffect } from 'react';
import styles from './Sessions.module.css';
import {
    RefreshCw,
    Star,
    Columns
} from 'lucide-react';
import { Session } from 'data/dummySessionsData';
import ColumnVisibilityModal from '../ColumnVisibilityModal';
import { Column } from '../types';
import { DataTable } from 'components/DataTable/DataTable'; 
import { sessionTableColumns } from './sessionColumns'; 
import FilterButton from 'components/FilterButton/FilterButton';
import DateRangePicker from 'components/DateRange/DateRangePicker';
import { fetchSessions } from './SessionApi'; // 새로 만든 API 함수 import

// 필터 컴포넌트 import
import EnvironmentFilter from '../../../components/FilterControls/EnvironmentFilter';
import FilterBuilder from '../../../components/FilterControls/FilterBuilder';

const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]); // API로부터 받을 데이터 (초기값 빈 배열)
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태

    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [isColumnVisibleModalOpen, setIsColumnVisibleModalOpen] = useState(false);

    // 컬럼 보이기/숨기기 상태 관리
    const [columns, setColumns] = useState<Column<Session>[]>(
        sessionTableColumns.map(c => ({ ...c, visible: c.visible }))
    );

    // 날짜 범위 상태 관리
    const [startDate, setStartDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());

    // 컴포넌트 마운트 시 API 호출
    useEffect(() => {
        const loadSessions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedSessions = await fetchSessions();
                setSessions(fetchedSessions);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadSessions();
    }, []); // 빈 의존성 배열로 최초 1회만 실행

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); 
        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === id ? { ...session, isFavorited: !session.isFavorited } : session
            )
        );
    };

    const toggleColumnVisibility = (key: string) => {
        setColumns(prev =>
            prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
        );
    };

    const setAllColumnsVisible = (visible: boolean) => {
        setColumns(prev => prev.map(col => ({ ...col, visible })));
    };

    const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

    const columnsWithActions = useMemo(() => [
        {
            key: 'checkbox',
            header: <input type="checkbox" />,
            accessor: () => <input type="checkbox" />,
            visible: true
        },
        {
            key: 'favorite',
            header: '',
            accessor: (row: Session) => (
                <Star
                    size={16}
                    className={`${styles.starIcon} ${row.isFavorited ? styles.favorited : ''}`}
                    onClick={(e) => toggleFavorite(row.id, e)}
                />
            ),
            visible: true
        },
        ...visibleColumns,
    ], [visibleColumns, sessions]); // sessions가 변경될 때도 재생성되도록 추가

    // 로딩 및 에러 상태에 따른 테이블 컨텐츠 렌더링 함수
    const renderTableContent = () => {
        if (isLoading) {
            return <div>Loading sessions...</div>;
        }
        if (error) {
            return <div style={{ color: 'red' }}>Error: {error}</div>;
        }
        return (
            <DataTable<Session>
                columns={columnsWithActions}
                data={sessions}
                keyField="id"
                renderEmptyState={() => <>No sessions found.</>}
                selectedRowKey={selectedSessionId}
                onRowClick={(row) => setSelectedSessionId(row.id)}
                showActions={false}
            />
        );
    };
    
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Sessions</h1>
                    <RefreshCw size={16} className={styles.refreshIcon} />
                </div>
            </div>

            {/* Filter Bar - Tracing 페이지와 동일한 구조로 수정 */}
            <div className={styles.filterBar}>
                <div className={styles.filterLeft}>
                    <DateRangePicker 
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                    <EnvironmentFilter />
                    <FilterBuilder />
                </div>
                <div className={styles.filterRight}>
                    <FilterButton onClick={() => setIsColumnVisibleModalOpen(true)}>
                        <Columns size={16} /> Columns ({visibleColumns.length}/{columns.length})
                    </FilterButton>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
                {renderTableContent()}
            </div>

            <ColumnVisibilityModal<Session>
                isOpen={isColumnVisibleModalOpen}
                onClose={() => setIsColumnVisibleModalOpen(false)}
                columns={columns}
                toggleColumnVisibility={toggleColumnVisibility}
                setAllColumnsVisible={setAllColumnsVisible}
            />
        </div>
    );
};

export default Sessions;