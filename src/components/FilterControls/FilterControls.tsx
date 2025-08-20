import React from 'react';
import { ChevronDown, Filter, Columns } from 'lucide-react';
import FilterButton from '../FilterButton/FilterButton';
import styles from './FilterControls.module.css';

// ✅ Props 타입 정의
interface FilterControlsProps {
  onColumnsClick: () => void;
  visibleColumnsCount: number;
  totalColumnsCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  onColumnsClick, 
  visibleColumnsCount, 
  totalColumnsCount 
}) => {
  return (
    <div className={styles.filterControls}>
      <FilterButton>Timestamp: Past 24 hours <ChevronDown size={16} /></FilterButton>
      <FilterButton>Env: default <ChevronDown size={16} /></FilterButton>
      <FilterButton><Filter size={14} /> Filters</FilterButton>
      <FilterButton>Table View <ChevronDown size={16} /></FilterButton>
      {/* ✅ onClick 핸들러와 동적 텍스트 추가 */}
      <FilterButton onClick={onColumnsClick}>
        <Columns size={16} /> Columns ({visibleColumnsCount}/{totalColumnsCount})
      </FilterButton>
    </div>
  );
};

export default FilterControls;