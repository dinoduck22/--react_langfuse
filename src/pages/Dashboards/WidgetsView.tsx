import React from 'react';
import { DataTable } from '../../components/DataTable/DataTable';
import { ChevronDown } from 'lucide-react';

type Widget = {
  name: string;
  description: string;
  viewType: string;
  chartType: string;
  createdAt: string;
  updatedAt: string;
};

const columns = [
    { header: 'Name', accessor: (row: Widget) => row.name },
    { header: 'Description', accessor: (row: Widget) => row.description },
    { header: 'View Type', accessor: (row: Widget) => row.viewType },
    { header: 'Chart Type', accessor: (row: Widget) => row.chartType },
    { header: 'Created At', accessor: (row: Widget) => row.createdAt },
    { header: <div style={{display: 'flex', alignItems: 'center'}}>Updated At <ChevronDown size={14} /></div>, accessor: (row: Widget) => row.updatedAt },
];

export const WidgetsView: React.FC = () => {
  return (
    <DataTable
      columns={columns}
      data={[]} // 이미지와 같이 데이터가 비어있음
      keyField="name"
      renderEmptyState={() => <>No results.</>}
    />
  );
};