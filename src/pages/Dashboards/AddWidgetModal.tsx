// src/pages/Dashboards/AddWidgetModal.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { DataTable } from 'components/DataTable/DataTable';
import styles from './AddWidgetModal.module.css';

// 🔽 새로 만든 데이터 파일에서 Widget 타입과 데이터를 import 합니다.
import { DUMMY_WIDGETS, type Widget } from 'data/dummyAddWidgetModal';

// 모달 Props 타입 정의 (기존과 동일)
interface AddWidgetModalProps {
  onClose: () => void;
  onAddWidget: (widgetId: string) => void;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ onClose, onAddWidget }) => {
  const navigate = useNavigate();
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const columns = [
    { header: 'Name', accessor: (row: Widget) => row.name },
    { header: 'Description', accessor: (row: Widget) => row.description },
    { header: 'View Type', accessor: (row: Widget) => row.viewType },
    { header: 'Chart Type', accessor: (row: Widget) => row.chartType },
  ];

  const handleCreateNew = () => {
    navigate('/dashboards/widgets/new');
    onClose();
  };

  const handleAddSelected = () => {
    if (selectedWidgetId) {
      onAddWidget(selectedWidgetId);
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Select widget to add</h2>
          <button onClick={onClose} className={styles.closeButton}><X size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          <DataTable
            columns={columns}
            data={DUMMY_WIDGETS} // 🔽 import한 데이터를 사용
            keyField="id"
            selectedRowKey={selectedWidgetId}
            onRowClick={(row) => setSelectedWidgetId(row.id)}
            renderEmptyState={() => (
              <div className={styles.emptyState}>
                <p>No widgets found. Create a new widget to get started.</p>
              </div>
            )}
          />
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={handleCreateNew}>
            <Plus size={16} /> Create New Widget
          </button>
          <div className={styles.footerActions}>
            <button className={styles.secondaryButton} onClick={onClose}>Cancel</button>
            <button
              className={styles.primaryButton}
              onClick={handleAddSelected}
              disabled={!selectedWidgetId}
            >
              Add Selected Widget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;