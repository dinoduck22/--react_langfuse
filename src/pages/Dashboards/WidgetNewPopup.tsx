import React from 'react';
import styles from './WidgetNewPopup.module.css';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface WidgetNewPopupProps {
  startDate: Date;
  endDate: Date;
  onClose: () => void;
}

// 월 달력을 렌더링하는 내부 컴포넌트
const CalendarMonth: React.FC<{
  monthDate: dayjs.Dayjs;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}> = ({ monthDate, startDate, endDate }) => {
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const startOfMonth = monthDate.startOf('month');
  const endOfMonth = monthDate.endOf('month');
  const daysInMonth = monthDate.daysInMonth();
  const startDayOfWeek = startOfMonth.day();

  const days = [];
  // 이전 달의 날짜 채우기
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  // 현재 달의 날짜 채우기
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(startOfMonth.date(i));
  }

  const isDayInRange = (day: dayjs.Dayjs | null) =>
    day && day.isAfter(startDate.subtract(1, 'day')) && day.isBefore(endDate.add(1, 'day'));
  const isRangeStart = (day: dayjs.Dayjs | null) => day && day.isSame(startDate, 'day');
  const isRangeEnd = (day: dayjs.Dayjs | null) => day && day.isSame(endDate, 'day');

  return (
    <div className={styles.monthContainer}>
      <h3 className={styles.monthTitle}>{monthDate.format('MMMM YYYY')}</h3>
      <div className={styles.calendarGrid}>
        {daysOfWeek.map((day) => (
          <div key={`${monthDate.format('YYYY-MM')}-${day}`} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <button
            key={index}
            className={`
              ${styles.dayCell}
              ${isDayInRange(day) ? styles.selectedRange : ''}
              ${isRangeStart(day) ? styles.rangeStart : ''}
              ${isRangeEnd(day) ? styles.rangeEnd : ''}
            `}
            disabled={!day}
          >
            {day ? day.date() : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

// 메인 팝업 컴포넌트
const WidgetNewPopup: React.FC<WidgetNewPopupProps> = ({ startDate, endDate, onClose }) => {
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  // 시작 날짜와 그 다음 달을 표시
  const firstMonth = start;
  const secondMonth = start.add(1, 'month');

  return (
    <div className={styles.popupContainer} onClick={handlePopupClick}>
      <div className={styles.calendarsWrapper}>
        <button className={`${styles.navButton} ${styles.navLeft}`}><ChevronLeft size={18} /></button>
        <CalendarMonth monthDate={firstMonth} startDate={start} endDate={end} />
        <CalendarMonth monthDate={secondMonth} startDate={start} endDate={end} />
        <button className={`${styles.navButton} ${styles.navRight}`}><ChevronRight size={18} /></button>
      </div>
      <div className={styles.timeControls}>
        <div className={styles.timeGroup}>
          <label>Start time</label>
          <div className={styles.timeInput}>
            <Clock size={16} />
            <input type="text" value={start.format('hh')} readOnly /> :
            <input type="text" value={start.format('mm')} readOnly /> :
            <input type="text" value={start.format('ss')} readOnly />
            <select defaultValue={start.format('A')}>
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>
        <div className={styles.timeGroup}>
          <label>End time</label>
          <div className={styles.timeInput}>
            <Clock size={16} />
            <input type="text" value={end.format('hh')} readOnly /> :
            <input type="text" value={end.format('mm')} readOnly /> :
            <input type="text" value={end.format('ss')} readOnly />
            <select defaultValue={end.format('A')}>
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>
        <div className={styles.timezone}>GMT+9</div>
      </div>
    </div>
  );
};

export default WidgetNewPopup;