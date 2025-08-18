import React from 'react';
import styles from './DataTable.module.css';
import {
  MoreVertical,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

// 컬럼 정의를 위한 인터페이스
interface Column<T> {
  header: React.ReactNode;
  accessor: (row: T) => React.ReactNode;
}

// DataTable 컴포넌트 Props 타입
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderEmptyState: () => React.ReactNode;
  // 각 행의 고유 key로 사용할 속성 이름을 받습니다.
  keyField: keyof T;
  // 🔽 아래 2개 props 추가
  selectedRowKey?: string | null;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  renderEmptyState,
  keyField,
  selectedRowKey, // 🔽 추가
  onRowClick,     // 🔽 추가
}: DataTableProps<T>) {
  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => {
                const rowKey = String(row[keyField]);
                const isSelected = selectedRowKey === rowKey;

                return (
                  <tr 
                    key={rowKey}
                    // 🔽 클릭 이벤트와 선택 클래스 적용
                    onClick={() => onRowClick?.(row)}
                    className={`${onRowClick ? styles.clickableRow : ''} ${isSelected ? styles.selectedRow : ''}`}
                  >
                    {columns.map((col, index) => (
                      <td key={index}>{col.accessor(row)}</td>
                    ))}
                    <td>
                      <div className={styles.actionsCell}>
                        <button className={styles.iconButton}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className={styles.emptyCell}>
                  {renderEmptyState()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 페이지네이션 */}
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
    </>
  );
}