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
import { DUMMY_SESSIONS } from '../../data/dummySessionsData';
import ColumnVisibilityModal from './ColumnVisibilityModal';
import { Column, SessionData } from './types';
import { sessionTableColumns } from './sessionColumns'; // 분리된 컬럼 정의를 가져옵니다.


const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState(DUMMY_SESSIONS);
    const [isColumnVisibleModalOpen, setIsColumnVisibleModalOpen] = useState(false);
    // initialColumns 대신 sessionTableColumns를 초기 상태로 사용합니다.
    const [columns, setColumns] = useState<Column[]>(sessionTableColumns);

    const toggleFavorite = (id: string) => {
        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === id ? { ...session, isFavorited: !session.isFavorited } : session
            )
        );
    };
    
    const toggleColumnVisibility = (key: keyof SessionData) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                col.key === key ? { ...col, visible: !col.visible } : col
            )
        );
    };

    const setAllColumnsVisible = (visible: boolean) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                col.key === 'id' ? col : { ...col, visible }
            )
        );
    };

    const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

    const formatCost = (cost: number) => `$${cost.toFixed(6)}`;
    const formatUsage = (usage: { input: number; output: number }) =>
        `${usage.input.toLocaleString()} → ${usage.output.toLocaleString()} (${(usage.input + usage.output).toLocaleString()})`;

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
            <div className={styles.filterBar}>
                <div className={styles.filterLeft}>
                    <button className={styles.filterButton}>Past 24 hours <ChevronDown size={16} /></button>
                    <button className={styles.filterButton}>Env <ChevronDown size={16} /></button>
                    <button className={styles.filterButton}>default <ChevronDown size={16} /></button>
                    <button className={styles.filterButton}>Filters</button>
                </div>
                <div className={styles.filterRight}>
                    <button className={styles.filterButton}>Table View <ChevronDown size={16} /></button>
                    <button className={styles.filterButton} onClick={() => setIsColumnVisibleModalOpen(true)}>
                        <Columns size={16} /> Columns
                        <span className={styles.badge}>{visibleColumns.length}/{columns.length}</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th></th>
                            {visibleColumns.map(col => <th key={col.key}>{col.header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(session => (
                            <tr key={session.id}>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <Star
                                        size={16}
                                        className={`${styles.starIcon} ${session.isFavorited ? styles.favorited : ''}`}
                                        onClick={() => toggleFavorite(session.id)}
                                    />
                                </td>
                                {visibleColumns.map(col => {
                                    const value = (session as unknown as SessionData)[col.key];
                                    let content;
                                    switch (col.key) {
                                        case 'id':
                                            content = <Link to={`/sessions/${session.id}`} className={styles.idLink}>{value as string}</Link>;
                                            break;
                                        case 'totalCost':
                                            content = formatCost(value as number);
                                            break;
                                        case 'usage':
                                            content = <span className={styles.usageCell}>{formatUsage(value as { input: number; output: number })}</span>;
                                            break;
                                        default:
                                            content = value as string | number;
                                    }
                                    return <td key={`${session.id}-${col.key}`}>{content}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
                <div className={styles.rowsPerPage}>
                    <span>Rows per page</span>
                    <select>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div className={styles.pageInfo}>Page 1 of 1</div>
                <div className={styles.pageControls}>
                    <button className={styles.iconButton} disabled><ChevronsLeft size={18} /></button>
                    <button className={styles.iconButton} disabled><ChevronLeft size={18} /></button>
                    <button className={styles.iconButton} disabled><ChevronRight size={18} /></button>
                    <button className={styles.iconButton} disabled><ChevronsRight size={18} /></button>
                </div>
            </div>

            <ColumnVisibilityModal
                isOpen={isColumnVisibleModalOpen}
                onClose={() => setIsColumnVisibleModalOpen(false)}
                columns={columns.filter(c => c.key !== 'id')}
                toggleColumnVisibility={toggleColumnVisibility}
                setAllColumnsVisible={setAllColumnsVisible}
            />
        </div>
    );
};

export default Sessions;