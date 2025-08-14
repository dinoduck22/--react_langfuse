import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import styles from './DateRangePicker.module.css';
import DateRangePopup from './DateRangePopup';
import { dateRangeOptions, DateRangePreset } from './dateRangeOptions';

const DateRangePicker: React.FC = () => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('7d');

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

  const buttonLabel = useMemo(() => {
    const activePreset = dateRangeOptions.find(o => o.value === dateRangePreset);
    if (activePreset) return activePreset.label;
    return `${dayjs(startDate).format('MMM D')} - ${dayjs(endDate).format('MMM D, YYYY')}`;
  }, [startDate, endDate, dateRangePreset]);

  return (
    <>
      <button ref={buttonRef} className={styles.filterButton} onClick={() => setIsPickerOpen(p => !p)}>
        <Calendar size={16} />
        <span>{buttonLabel}</span>
      </button>

      {isPickerOpen && ReactDOM.createPortal(
          <DateRangePopup
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            dateRangePreset={dateRangePreset}
            setDateRangePreset={setDateRangePreset}
            triggerRef={buttonRef}
            onClose={() => setIsPickerOpen(false)}
          />,
          document.body
        )}
    </>
  );
};

export default DateRangePicker;