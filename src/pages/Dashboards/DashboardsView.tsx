import React from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '../../components/DataTable/DataTable';
import { Bot, ChevronDown } from 'lucide-react';
import styles from './Dashboards.module.css';
import { DUMMY_DASHBOARDS, Dashboard } from 'data/dummyDashboardData'; // 데이터를 분리한 파일에서 import

const columns = [
  {
    header: 'Name',
    // accessor를 수정하여 Name을 클릭하면 Link 컴포넌트를 통해 페이지 이동이 되도록 설정
    accessor: (row: Dashboard) => (
        <Link
        to={`/dashboards/${row.name.toLowerCase().replace(/\s+/g, '-')}`}
        className={styles.dashboardLink}
      >
        {row.name}
      </Link>
    ),
  },
  {
    header: 'Description',
    accessor: (row: Dashboard) => row.description,
  },
  {
    header: 'Owner',
    accessor: (row: Dashboard) => (
      <div className={styles.ownerCell}>
        <Bot size={16} />
        <span>{row.owner}</span>
      </div>
    ),
  },
  {
    header: 'Created At',
    accessor: (row: Dashboard) => row.createdAt,
  },
  {
    header: <div style={{display: 'flex', alignItems: 'center'}}>Updated At <ChevronDown size={14} /></div>,
    accessor: (row: Dashboard) => row.updatedAt,
  },
];

export const DashboardsView: React.FC = () => {
  return (
    <DataTable
      columns={columns}
      data={DUMMY_DASHBOARDS}
      keyField="name"
      renderEmptyState={() => <div>No dashboards found.</div>}
    />
  );
};