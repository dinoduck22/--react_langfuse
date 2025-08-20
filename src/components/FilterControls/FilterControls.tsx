import React from 'react';
import { ChevronDown, Filter, Columns } from 'lucide-react';
import FilterButton from '../FilterButton/FilterButton';
import styles from './FilterControls.module.css';

const FilterControls: React.FC = () => {
  return (
    <div className={styles.filterControls}>
      <FilterButton>Timestamp: Past 24 hours <ChevronDown size={16} /></FilterButton>
      <FilterButton>Env: default <ChevronDown size={16} /></FilterButton>
      <FilterButton><Filter size={14} /> Filters</FilterButton>
      <FilterButton>Table View <ChevronDown size={16} /></FilterButton>
      <FilterButton><Columns size={16} /> Columns (24/36)</FilterButton>
    </div>
  );
};

export default FilterControls;