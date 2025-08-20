import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Triangle } from 'lucide-react';
import { Trace } from 'data/dummyTraces';
import styles from './Tracing.module.css';
import { Column } from './types';

export const traceTableColumns: Column<Trace>[] = [
    {
      key: 'select',
      header: <input type="checkbox" />,
      accessor: (row: Trace) => <input type="checkbox" checked={row.isFavorited} readOnly />,
      visible: true, // ✅ 'visible' 속성 추가
    },
    {
      key: 'favorite',
      header: <Star size={16} />,
      accessor: (row: Trace) => <Star size={16} className={row.isFavorited ? styles.favorited : ''} />,
      visible: true, // ✅ 'visible' 속성 추가
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      accessor: (row: Trace) => row.timestamp,
      visible: true, // ✅ 'visible' 속성 추가
    },
    {
      key: 'name',
      header: 'Name',
      accessor: (row: Trace) => <Link to={`/traces/${row.id}`} className={styles.traceLink}>{row.name}</Link>,
      visible: true, // ✅ 'visible' 속성 추가
    },
    {
      key: 'input',
      header: 'Input',
      accessor: (row: Trace) => <div className={styles.cellText}>{row.input}</div>,
      visible: true, // ✅ 'visible' 속성 추가
    },
    {
      key: 'output',
      header: 'Output',
      accessor: (row: Trace) => <div className={styles.cellText}>{row.output}</div>,
      visible: true, // ✅ 'visible' 속성 추가
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
      visible: true, // ✅ 'visible' 속성 추가
    },
];