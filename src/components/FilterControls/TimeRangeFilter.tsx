// 시간범위 선택기
// src/components/FilterControls/TimeRangeFilter.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import FilterButton from '../FilterButton/FilterButton';
import styles from './TimeRangeFilter.module.css';

const timeOptions = [
  '30 min', '1 hour', '6 hours', '24 hours',
  '3 days', '7 days', '14 days',
  '1 month', '3 months', 'All time'
];

const TimeRangeFilter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Past 24 hours');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleTimeSelect = (time: string) => {
    const displayValue = time === 'All time' ? time : `Past ${time}`;
    setSelectedTime(displayValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <FilterButton onClick={() => setIsOpen(!isOpen)}>
        {selectedTime} <ChevronDown size={16} />
      </FilterButton>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {timeOptions.map((option) => (
            <div
              key={option}
              className={`${styles.dropdownItem} ${selectedTime.includes(option) ? styles.selected : ''}`}
              onClick={() => handleTimeSelect(option)}
            >
              {selectedTime.includes(option) && <span className={styles.checkmark}>✓</span>}
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeRangeFilter;