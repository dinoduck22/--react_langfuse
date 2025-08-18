// src/components/DateRange/DateRangePicker.tsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import { Calendar, ChevronDown } from 'lucide-react';
import styles from './DateRangePicker.module.css';
import DateRangePopup from './DateRangePopup';
import { dateRangeOptions, DateRangePreset } from './dateRangeOptions';

// 🔽 Props 타입 정의 수정
interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  
  // 🔽 내부에서 관리하던 startDate, endDate 상태 제거
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset | null>('7d');

  useEffect(() => {
    if (!dateRangePreset) return;

    const newEndDate = new Date();
    let newStartDate: Date;
    const valueStr = dateRangePreset.slice(0, -1);
    const unit = dateRangePreset.slice(-1);
    const value = parseInt(valueStr) || 1;

    switch (unit) {
      case 'm': newStartDate = dayjs(newEndDate).subtract(value, 'minute').toDate(); break;
      case 'h': newStartDate = dayjs(newEndDate).subtract(value, 'hour').toDate(); break;
      case 'd': newStartDate = dayjs(newEndDate).subtract(value, 'day').toDate(); break;
      case 'M': newStartDate = dayjs(newEndDate).subtract(value, 'month').toDate(); break;
      case 'y': newStartDate = dayjs(newEndDate).subtract(value, 'year').toDate(); break;
      default: newStartDate = new Date();
    }
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, [dateRangePreset, setStartDate, setEndDate]); // 🔽 의존성 배열에 setStartDate, setEndDate 추가

  const formattedDateRange = useMemo(() => {
    const start = dayjs(startDate).format('MMM D, YY HH:mm');
    const end = dayjs(endDate).format('MMM D, YY HH:mm');
    return `${start} - ${end}`;
  }, [startDate, endDate]);

  const activePresetLabel = useMemo(() => {
    return dateRangeOptions.find(o => o.value === dateRangePreset)?.label || 'Custom';
  }, [dateRangePreset]);

  return (
    <>
      <div className={styles.container}>
        <button
          ref={calendarButtonRef}
          className={styles.filterButton}
          onClick={() => setIsPickerOpen(true)}
        >
          <Calendar size={16} />
          <span>{formattedDateRange}</span>
        </button>

        <div className={styles.presetContainer}>
          <span className={styles.presetDisplay}>{activePresetLabel}</span>
          <ChevronDown size={16} className={styles.presetArrow} />
          <select
            className={styles.presetSelect}
            value={dateRangePreset || ''}
            onChange={(e) => setDateRangePreset(e.target.value as DateRangePreset)}
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPickerOpen &&
        ReactDOM.createPortal(
          <DateRangePopup
            startDate={startDate}
            endDate={endDate}
            setStartDate={(date) => {
              setStartDate(date);
              setDateRangePreset(null);
            }}
            setEndDate={(date) => {
              setEndDate(date);
              setDateRangePreset(null);
            }}
            onClose={() => setIsPickerOpen(false)}
            triggerRef={calendarButtonRef}
          />,
          document.body
        )}
    </>
  );
};

export default DateRangePicker;