import React from 'react';
import styles from './FilterButton.module.css';

interface FilterButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ children, onClick }) => {
  return (
    <button className={styles.filterButton} onClick={onClick}>
      {children}
    </button>
  );
};

export default FilterButton;