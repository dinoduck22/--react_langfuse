import React from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '../../components/DataTable/DataTable';
import { Bot, ChevronDown } from 'lucide-react';
import styles from './Dashboards.module.css';

type Dashboard = {
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

const DUMMY_DASHBOARDS: Dashboard[] = [
    {
        name: 'Langfuse Cost Dashboard',
        description: 'Review your LLM costs.',
        owner: 'Langfuse',
        createdAt: '2025-05-21 00:38:32',
        updatedAt: '2025-05-21 01:09:56',
    },
    {
        name: 'Langfuse Usage Management',
        description: 'Track usage metrics across traces, observations, and scores to manage resource allocation.',
        owner: 'Langfuse',
        createdAt: '2025-05-20 23:18:27',
        updatedAt: '2025-05-21 00:56:46',
    },
    {
        name: 'Langfuse Latency Dashboard',
        description: 'Monitor latency metrics across traces and generations for performance optimization.',
        owner: 'Langfuse',
        createdAt: '2025-05-20 22:36:15',
        updatedAt: '2025-05-21 00:56:46',
    },
];

const columns = [
  {
    header: 'Name',
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