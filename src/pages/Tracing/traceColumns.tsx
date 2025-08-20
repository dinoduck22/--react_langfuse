// src/pages/Tracing/traceColumns.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Trace } from './types'; // types.ts에서 직접 Trace 타입을 가져옵니다.
import styles from './Tracing.module.css';
import { Column } from './types';

// 비용 포맷팅 헬퍼 함수
const formatCost = (cost: number | null) => {
    if (cost === null || cost === 0) return '-';
    return `$${cost.toFixed(6)}`;
};

export const traceTableColumns: Column<Trace>[] = [
    {
      key: 'favorite',
      header: <Star size={16} />,
      accessor: (row: Trace) => <Star size={16} className={row.isFavorited ? styles.favorited : ''} />,
      visible: true,
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      accessor: (row: Trace) => row.timestamp,
      visible: true,
    },
    {
      key: 'name',
      header: 'Name',
      accessor: (row: Trace) => <Link to={`/traces/${row.id}`} className={styles.traceLink}>{row.name}</Link>,
      visible: true,
    },
    {
        key: 'userId',
        header: 'User ID',
        accessor: (row: Trace) => row.userId || 'N/A',
        visible: true,
    },
    {
      key: 'input',
      header: 'Input',
      accessor: (row: Trace) => <div className={styles.cellText}>{row.input}</div>,
      visible: true,
    },
    {
      key: 'output',
      header: 'Output',
      accessor: (row: Trace) => <div className={styles.cellText}>{row.output}</div>,
      visible: true,
    },
    {
        key: 'cost',
        header: 'Cost (USD)',
        accessor: (row: Trace) => formatCost(row.cost),
        visible: true,
    },
    {
        key: 'latency',
        header: 'Latency',
        accessor: (row: Trace) => `${row.latency} ms`,
        visible: true,
    },
    {
      key: 'observations',
      header: 'Observations',
      accessor: (row: Trace) => row.observations,
      visible: true,
    },
    {
        key: 'sessionId',
        header: 'Session ID',
        accessor: (row: Trace) => row.sessionId || 'N/A',
        visible: false, // 기본 숨김
    },
    {
        key: 'tags',
        header: 'Tags',
        accessor: (row: Trace) => row.tags?.join(', ') || 'N/A',
        visible: false, // 기본 숨김
    },
    {
        key: 'version',
        header: 'Version',
        accessor: (row: Trace) => row.version || 'N/A',
        visible: false, // 기본 숨김
    },
    {
        key: 'release',
        header: 'Release',
        accessor: (row: Trace) => row.release || 'N/A',
        visible: false, // 기본 숨김
    },
    {
        key: 'environment',
        header: 'Environment',
        accessor: (row: Trace) => row.environment || 'N/A',
        visible: false, // 기본 숨김
    },
];