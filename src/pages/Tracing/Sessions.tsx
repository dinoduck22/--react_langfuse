// src/pages/Tracing/Sessions.tsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sessions.module.css';
import {
    RefreshCw,
    ChevronDown,
    Columns,
    Star,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight
} from 'lucide-react';
import { DUMMY_SESSIONS, Session } from '../../data/dummySessionsData';
import ColumnVisibilityModal from './ColumnVisibilityModal';
import { Column, SessionData } from './types';
import { DataTable } from '../../components/DataTable/DataTable'; // DataTable import
import { sessionTableColumns } from './sessionColumns'; // 분리된 컬럼 정의를 가져옵니다.
import { sessionTableColumn } from './sessionColumn'; // 분리된 컬럼 정의 import


const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState(DUMMY_SESSIONS);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // 행 클릭 이벤트 전파 방지
        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === id ? { ...session, isFavorited: !session.isFavorited } : session
            )
        );
    };

    // 체크박스와 별 아이콘을 포함한 컬럼 정의를 동적으로 생성
    const columnsWithActions = [
        {
            header: <input type="checkbox" />,
            accessor: (row: Session) => <input type="checkbox" />,
        },
        {
            header: '',
            accessor: (row: Session) => (
                <Star
                    size={16}
                    className={`${styles.starIcon} ${row.isFavorited ? styles.favorited : ''}`}
                    onClick={(e) => toggleFavorite(row.id, e)}
                />
            ),
        },
        ...sessionTableColumn
    ];
    
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Sessions</h1>
                    <RefreshCw size={16} className={styles.refreshIcon} />
                </div>
            </div>

            {/* Filter Bar */}

            {/* Table */}
            <div className={styles.tableContainer}>
                <DataTable<Session>
                    columns={columnsWithActions}
                    data={sessions}
                    keyField="id"
                    renderEmptyState={() => <>No sessions found.</>}
                    selectedRowKey={selectedSessionId}
                    onRowClick={(row) => setSelectedSessionId(row.id)}
                    showActions={false}
                />
            </div>

            {/* <ColumnVisibilityModal
                isOpen={isColumnVisibleModalOpen}
                onClose={() => setIsColumnVisibleModalOpen(false)}
                columns={columns.filter(c => c.key !== 'id')}
                toggleColumnVisibility={toggleColumnVisibility}
                setAllColumnsVisible={setAllColumnsVisible}
            /> */}
        </div>
    );
};

export default Sessions;