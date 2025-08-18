import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import { Calendar, ChevronDown } from 'lucide-react';
import styles from './DateRangePicker.module.css';
import DateRangePopup from './DateRangePopup';
import { dateRangeOptions, DateRangePreset } from './dateRangeOptions';

const DateRangePicker: React.FC = () => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').toDate());
  const [endDate, setEndDate] = useState(new Date());
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
  }, [dateRangePreset]);

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
        {/* 1. 달력 팝업을 여는 버튼 */}
        <button
          ref={calendarButtonRef}
          className={styles.filterButton}
          onClick={() => setIsPickerOpen(true)}
        >
          <Calendar size={16} />
          <span>{formattedDateRange}</span>
        </button>

        {/* 2. 프리셋을 선택하는 드롭다운 버튼 */}
        <div className={styles.presetContainer}>
          <span className={styles.presetDisplay}>{activePresetLabel}</span>
          <ChevronDown size={16} className={styles.presetArrow} />
          <select
            className={styles.presetSelect}
            value={dateRangePreset || ''}
            onChange={(e) => {
              setDateRangePreset(e.target.value as DateRangePreset);
            }}
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
              setDateRangePreset(null); // 직접 날짜를 바꾸면 프리셋 선택은 해제
            }}
            setEndDate={(date) => {
              setEndDate(date);
              setDateRangePreset(null); // 직접 날짜를 바꾸면 프리셋 선택은 해제
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