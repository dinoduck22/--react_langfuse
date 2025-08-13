import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './WidgetNewPopup.module.css';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface WidgetNewPopupProps {
  startDate: Date;
  endDate: Date;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

// 단일 월 달력을 렌더링하는 내부 컴포넌트
const CalendarMonth: React.FC<{
  monthDate: dayjs.Dayjs;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}> = ({ monthDate, startDate, endDate }) => {
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const startOfMonth = monthDate.startOf('month');
  const daysInMonth = monthDate.daysInMonth();
  const startDayOfWeek = startOfMonth.day();

  const days: (dayjs.Dayjs | null)[] = [];
  // 달력의 시작 부분에 이전 달의 날짜를 null로 채웁니다.
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  // 현재 달의 날짜를 채웁니다.
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(startOfMonth.date(i));
  }

  // props로 받은 날짜를 기준으로 각종 상태(범위 내, 시작, 끝)를 동적으로 확인하는 함수들
  const isDayInRange = (day: dayjs.Dayjs | null) =>
    day && day.isAfter(startDate.subtract(1, 'day')) && day.isBefore(endDate);
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
const WidgetNewPopup: React.FC<WidgetNewPopupProps> = ({ startDate, endDate, onClose, triggerRef }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // 팝업의 위치를 트리거 요소 기준으로 동적으로 계산합니다.
  useEffect(() => {
    if (triggerRef.current && popupRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      setPosition({
        top: triggerRect.top - popupRect.height - 8,
        left: triggerRect.left,
      });
    }
  }, [triggerRef]);

  // props로 받은 startDate와 endDate를 dayjs 객체로 변환합니다.
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  // props로 받은 시작 날짜와 그 다음 달을 렌더링합니다.
  const firstMonth = start;
  const secondMonth = start.add(1, 'month');

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        ref={popupRef}
        className={styles.popupContainer} 
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
        onClick={(e) => e.stopPropagation()}
      >
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
    </div>,
    document.body
  );
};

export default WidgetNewPopup;