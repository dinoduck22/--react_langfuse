// src/pages/Tracing/sessionColumns.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Session } from 'data/dummySessionsData';
import styles from './Sessions.module.css'; // Sessions의 CSS 사용

const formatCost = (cost: number) => `$${cost.toFixed(6)}`;
const formatUsage = (usage: { input: number; output: number }) =>
    `${usage.input.toLocaleString()} → ${usage.output.toLocaleString()} (${(usage.input + usage.output).toLocaleString()})`;

export const sessionTableColumn = [
    {
        header: 'ID',
        accessor: (row: Session) => <Link to={`/sessions/${row.id}`} className={styles.idLink}>{row.id}</Link>
    },
    {
        header: 'Created At',
        accessor: (row: Session) => row.createdAt,
    },
    {
        header: 'Duration',
        accessor: (row: Session) => row.duration,
    },
    {
        header: 'Environment',
        accessor: (row: Session) => row.environment,
    },
    {
        header: 'User IDs',
        accessor: (row: Session) => row.userIds,
    },
    {
        header: 'Traces',
        accessor: (row: Session) => row.traces,
    },
    {
        header: 'Total Cost',
        accessor: (row: Session) => formatCost(row.totalCost),
    },
    {
        header: 'Usage',
        accessor: (row: Session) => <span className={styles.usageCell}>{formatUsage(row.usage)}</span>,
    },
];