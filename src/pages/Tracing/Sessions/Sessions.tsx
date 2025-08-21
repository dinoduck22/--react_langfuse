// src/pages/Tracing/Sessions/Sessions.tsx
import { useState, useMemo, useEffect } from 'react';
import styles from './Sessions.module.css';
import {
    RefreshCw,
    Star,
    Columns
} from 'lucide-react';
import { SessionData } from '../types'; // Session -> SessionData
import ColumnVisibilityModal from '../ColumnVisibilityModal';
import { Column } from '../types';
import { DataTable } from 'components/DataTable/DataTable'; 
import { sessionTableColumns } from './sessionColumns'; 
import FilterButton from 'components/FilterButton/FilterButton';
import DateRangePicker from 'components/DateRange/DateRangePicker';
import { fetchSessions } from './SessionApi';

import EnvironmentFilter from '../../../components/FilterControls/EnvironmentFilter';
import FilterBuilder from '../../../components/FilterControls/FilterBuilder';

const Sessions: React.FC = () => {
    // 상태 타입을 SessionData[]로 수정
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [isColumnVisibleModalOpen, setIsColumnVisibleModalOpen] = useState(false);

    // 컬럼 상태 타입을 Column<SessionData>[]로 수정
    const [columns, setColumns] = useState<Column<SessionData>[]>(
        sessionTableColumns.map(c => ({ ...c, visible: c.visible }))
    );

    const [startDate, setStartDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());

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
    }, []);

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
            accessor: (row: SessionData) => ( // row 타입을 SessionData로 수정
                <Star
                    size={16}
                    className={`${styles.starIcon} ${row.isFavorited ? styles.favorited : ''}`}
                    onClick={(e) => toggleFavorite(row.id, e)}
                />
            ),
            visible: true
        },
        ...visibleColumns,
    ], [visibleColumns, sessions]);

    const renderTableContent = () => {
        if (isLoading) {
            return <div>Loading sessions...</div>;
        }
        if (error) {
            return <div style={{ color: 'red' }}>Error: {error}</div>;
        }
        // DataTable 타입을 DataTable<SessionData>로 수정
        return (
            <DataTable<SessionData>
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
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Sessions</h1>
                    <RefreshCw size={16} className={styles.refreshIcon} />
                </div>
            </div>

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

            <div className={styles.tableContainer}>
                {renderTableContent()}
            </div>

            {/* ColumnVisibilityModal 타입을 <SessionData>로 수정 */}
            <ColumnVisibilityModal<SessionData>
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