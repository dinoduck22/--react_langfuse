import React, { useEffect, useRef, useState } from 'react';
import styles from './WidgetNewPopup.module.css';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface WidgetNewPopupProps {
  onClose: () => void;
  // 팝업의 위치를 계산하기 위해 트리거 요소의 ref를 받습니다.
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
    // 이전 달의 날짜 채우기 (렌더링은 비활성화)
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
const WidgetNewPopup: React.FC<WidgetNewPopupProps> = ({ onClose, triggerRef }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // 팝업의 위치를 트리거 요소 기준으로 동적으로 계산합니다.
  useEffect(() => {
    if (triggerRef.current && popupRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      setPosition({
        top: triggerRect.top - popupRect.height - 8, // 8px 간격
        left: triggerRect.left,
      });
    }
  }, [triggerRef]);
  
  // 현재 날짜를 기준으로 달력을 생성합니다.
  const today = dayjs();
  const startDate = today;
  const endDate = today.add(7, 'day');
  const firstMonth = today;
  const secondMonth = today.add(1, 'month');

  return (
    // Portal을 통해 body 최상단에 렌더링될 오버레이와 팝업
    <div className={styles.overlay} onClick={onClose}>
      <div 
        ref={popupRef}
        className={styles.popupContainer} 
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.calendarsWrapper}>
          <button className={`${styles.navButton} ${styles.navLeft}`}><ChevronLeft size={18} /></button>
          <CalendarMonth monthDate={firstMonth} startDate={startDate} endDate={endDate} />
          <CalendarMonth monthDate={secondMonth} startDate={startDate} endDate={endDate} />
          <button className={`${styles.navButton} ${styles.navRight}`}><ChevronRight size={18} /></button>
        </div>
        <div className={styles.timeControls}>
            {/* ... 시간 입력 부분은 이전과 동일 ... */}
            <div className={styles.timeGroup}>
                <label>Start time</label>
                <div className={styles.timeInput}>
                    <Clock size={16} />
                    <input type="text" value={startDate.format('hh')} readOnly /> :
                    <input type="text" value={startDate.format('mm')} readOnly /> :
                    <input type="text" value={startDate.format('ss')} readOnly />
                    <select defaultValue={startDate.format('A')}>
                    <option>AM</option>
                    <option>PM</option>
                    </select>
                </div>
            </div>
            <div className={styles.timeGroup}>
                <label>End time</label>
                <div className={styles.timeInput}>
                    <Clock size={16} />
                    <input type="text" value={endDate.format('hh')} readOnly /> :
                    <input type="text" value={endDate.format('mm')} readOnly /> :
                    <input type="text" value={endDate.format('ss')} readOnly />
                    <select defaultValue={endDate.format('A')}>
                    <option>AM</option>
                    <option>PM</option>
                    </select>
                </div>
            </div>
            <div className={styles.timezone}>GMT+9</div>
        </div>
      </div>
    </div>
  );
};

export default WidgetNewPopup;