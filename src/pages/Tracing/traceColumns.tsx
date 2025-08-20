import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Triangle } from 'lucide-react';
import styles from './Tracing.module.css';
import { Column, Trace } from './types';

export const traceTableColumns: Column<Trace>[] = [
    {
      key: 'select',
      header: <input type="checkbox" />,
      accessor: (row: Trace) => <input type="checkbox" checked={row.isFavorited} readOnly />,
      visible: true,
    },
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
      key: 'observations',
      header: 'Observations',
      accessor: (row: Trace) => (
        <div className={styles.observationCell}>
          {row.observations}
          <Triangle size={12} />
        </div>
      ),
      visible: true,
    },
    // ✅ 아래부터 새로 추가된 컬럼들
    {
      key: 'latency',
      header: 'Latency',
      accessor: (row: Trace) => `${(row.latency / 1000).toFixed(2)}s`,
      visible: true,
    },
    {
      key: 'tokens',
      header: 'Tokens',
      accessor: (row: Trace) => row.tokens.total.toLocaleString(),
      visible: true,
    },
    {
      key: 'cost',
      header: 'Total Cost',
      accessor: (row: Trace) => row.cost ? `$${row.cost.toFixed(6)}` : 'N/A',
      visible: true,
    },
    {
      key: 'environment',
      header: 'Environment',
      accessor: (row: Trace) => row.env || 'N/A',
      visible: false, // 기본 숨김
    },
    {
      key: 'tags',
      header: 'Tags',
      accessor: (row: Trace) => (
        <div className={styles.tagsCell}>
          {row.tags.map(tag => <span key={tag} className={styles.tagPill}>{tag}</span>)}
        </div>
      ),
      visible: false, // 기본 숨김
    },
    {
      key: 'metadata',
      header: 'Metadata',
      accessor: (row: Trace) => row.metadata ? JSON.stringify(row.metadata) : '{}',
      visible: false, // 기본 숨김
    },
    {
      key: 'session',
      header: 'Session',
      accessor: (row: Trace) => row.sessionId,
      visible: false, // 기본 숨김
    },
    {
      key: 'user',
      header: 'User',
      accessor: (row: Trace) => row.userId,
      visible: false, // 기본 숨김
    },
];