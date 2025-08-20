// src/pages/Tracing/traceColumns.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Triangle } from 'lucide-react';
import { Trace } from 'data/dummyTraces';
import styles from './Tracing.module.css';

// DataTable에 전달될 Column 정의
export const traceTableColumns = [
    {
      header: <input type="checkbox" />,
      accessor: (row: Trace) => <input type="checkbox" checked={row.isFavorited} readOnly />,
    },
    {
      header: <Star size={16} />,
      accessor: (row: Trace) => <Star size={16} className={row.isFavorited ? styles.favorited : ''} />,
    },
    {
      header: 'Timestamp',
      accessor: (row: Trace) => row.timestamp,
    },
    {
      header: 'Name',
      accessor: (row: Trace) => <Link to={`/traces/${row.id}`} className={styles.traceLink}>{row.name}</Link>,
    },
    {
      header: 'Input',
      accessor: (row: Trace) => <div className={styles.cellText}>{row.input}</div>,
    },
    {
      header: 'Output',
      accessor: (row: Trace) => <div className={styles.cellText}>{row.output}</div>,
    },
    {
      header: 'Observations',
      accessor: (row: Trace) => (
        <div className={styles.observationCell}>
          {row.observations}
          <Triangle size={12} />
        </div>
      ),
    },
];