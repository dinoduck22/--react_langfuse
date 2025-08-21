// src/components/FilterControls/FilterControls.tsx
import React from 'react';
import styles from './FilterControls.module.css';

// 분리된 컴포넌트들을 import
import TimeRangeFilter from './TimeRangeFilter';
import EnvironmentFilter from './EnvironmentFilter';
import FilterBuilder from './FilterBuilder';

// Columns 버튼 관련 props 제거
const FilterControls: React.FC = () => {
  return (
    <div className={styles.filterControls}>
      <TimeRangeFilter />
      <EnvironmentFilter />
      <FilterBuilder />
    </div>
  );
};

export default FilterControls;