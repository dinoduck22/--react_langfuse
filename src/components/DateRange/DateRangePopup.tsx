import React, { useLayoutEffect, useEffect, useRef, useState, useMemo} from 'react';
import ReactDOM from 'react-dom';
import styles from './DateRangePopup.module.css';
import { ChevronLeft, ChevronRight, Clock, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';

interface DateRangePopupProps {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
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
const DateRangePopup: React.FC<DateRangePopupProps> = ({ startDate, endDate, setStartDate, setEndDate, onClose, triggerRef }) => {  
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 }); // 초기에 화면 밖으로
  const [opacity, setOpacity] = useState(0); // 투명 상태로 시작

  // ▼▼▼ 팝업 위치 계산 로직 수정 ▼▼▼
  useLayoutEffect(() => {
    if (!triggerRef.current || !popupRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const margin = 8;

    // 1. 기본적으로 팝업을 버튼 위에 위치시키도록 계산
    let topPosition = triggerRect.top - popupRect.height - margin;

    // 2. 만약 위로 띄웠을 때 팝업이 화면 상단을 벗어난다면,
    if (topPosition < 0) {
      // 위치를 버튼 아래로 재조정
      topPosition = triggerRect.bottom + margin;
    }

    setPosition({
      top: topPosition,
      left: triggerRect.left,
    });
    
    // 3. 위치 계산이 완료된 후 팝업을 보이게 처리
    setOpacity(1);

  }, [triggerRef]);

  const [startTime, setStartTime] = useState({ hh: '', mm: '', ss: '', ampm: 'AM' });
  const [endTime, setEndTime] = useState({ hh: '', mm: '', ss: '', ampm: 'AM' });


  // 2. 팝업이 처음 열릴 때 한번만 현재 시간으로 초기화
  useEffect(() => {
    const now = dayjs(); // 현재 시간 ( timezone 자동 적용 )
    const currentTime = {
        hh: now.format('hh'),
        mm: now.format('mm'),
        ss: now.format('ss'),
        ampm: now.format('A'),
    };
    setStartTime(currentTime);
    setEndTime(currentTime);

    // 부모의 날짜 상태에도 현재 시간을 반영
    setStartDate(dayjs(startDate).hour(now.hour()).minute(now.minute()).second(now.second()).toDate());
    setEndDate(dayjs(endDate).hour(now.hour()).minute(now.minute()).second(now.second()).toDate());
  }, []); // 빈 배열로 설정하여 최초 1회만 실행

  // 시간 입력 필드 변경 핸들러
  const handleTimeChange = (type: 'start' | 'end', part: 'hh' | 'mm' | 'ss', value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const setter = type === 'start' ? setStartTime : setEndTime;
    setter(prev => ({ ...prev, [part]: sanitizedValue }));
  };

  // AM/PM 변경 핸들러
  const handleAmPmChange = (type: 'start' | 'end', value: string) => {
      const setter = type === 'start' ? setStartTime : setEndTime;
      setter(prev => ({...prev, ampm: value}));
  };

  // 입력 필드에서 포커스가 벗어났을 때 값 보정
  const handleTimeBlur = (type: 'start' | 'end', part: 'hh' | 'mm' | 'ss', value: string) => {
    const numericValue = parseInt(value, 10);
    let finalValue = isNaN(numericValue) ? '00' : value;

    if (numericValue < 10 && value.length < 2) {
      finalValue = `0${numericValue}`;
    }
    if (value === '') {
      finalValue = '00';
    }

    const setter = type === 'start' ? setStartTime : setEndTime;
    setter(prev => ({ ...prev, [part]: finalValue }));
  };

  // 로컬 시간 state가 변경될 때마다 부모의 Date 객체 업데이트
  useEffect(() => {
    const updateDate = (originalDate: Date, time: typeof startTime) => {
      let hour = parseInt(time.hh, 10) || 0;
      if (time.ampm === 'PM' && hour < 12) hour += 12;
      if (time.ampm === 'AM' && hour === 12) hour = 0;
      return dayjs(originalDate)
        .hour(hour)
        .minute(parseInt(time.mm, 10) || 0)
        .second(parseInt(time.ss, 10) || 0)
        .toDate();
    };
    setStartDate(updateDate(startDate, startTime));
    setEndDate(updateDate(endDate, endTime));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  // 4. Timezone 자동 계산
  const timezone = useMemo(() => {
    const offset = dayjs().format('Z');
    return `GMT${offset}`;
  }, []);

  // 팝업의 위치를 트리거 요소 기준으로 동적으로 계산합니다.
  useEffect(() => {
    if (triggerRef.current && popupRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect(); // 팝업 자신의 크기를 가져옵니다.
      setPosition({
        top: triggerRect.top - popupRect.height - 8, // 버튼의 상단에서 팝업 높이만큼 위로 이동
        left: triggerRect.left,
      });
    }
  }, [triggerRef]);

  // props로 받은 startDate와 endDate를 dayjs 객체로 변환합니다.
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  // props로 받은 시작 날짜와 그 다음 달을 렌더링합니다.
  const firstMonth = end.subtract(1, 'month');
  const secondMonth = end;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        ref={popupRef}
        className={styles.popupContainer} 
        style={{ 
          top: `${position.top}px`, 
          left: `${position.left}px`,
          opacity: opacity, // state에 따라 투명도 조절
          transition: 'opacity 0.1s ease-in-out', // 부드러운 전환 효과
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.calendarsWrapper}>
          <button className={`${styles.navButton} ${styles.navLeft}`}><ChevronLeft size={18} /></button>
          <CalendarMonth monthDate={firstMonth} startDate={start} endDate={end} />
          <CalendarMonth monthDate={secondMonth} startDate={start} endDate={end} />
          <button className={`${styles.navButton} ${styles.navRight}`}><ChevronRight size={18} /></button>
        </div>
        {/* ▼▼▼ 시간 조절 UI 수정 ▼▼▼ */}
        <div className={styles.timeControls}>
            <div className={styles.timeGroup}>
              <label>Start time</label>
              <div className={styles.timeInput}>
                <Clock size={16} className={styles.timeIcon} />
                <input type="text" value={startTime.hh} onChange={(e) => handleTimeChange('start', 'hh', e.target.value)} onBlur={(e) => handleTimeBlur('start', 'hh', e.target.value)} maxLength={2} />
                <span>:</span>
                <input type="text" value={startTime.mm} onChange={(e) => handleTimeChange('start', 'mm', e.target.value)} onBlur={(e) => handleTimeBlur('start', 'mm', e.target.value)} maxLength={2} />
                <span>:</span>
                <input type="text" value={startTime.ss} onChange={(e) => handleTimeChange('start', 'ss', e.target.value)} onBlur={(e) => handleTimeBlur('start', 'ss', e.target.value)} maxLength={2} />
                <div className={styles.selectWrapper}>
                  <select value={startTime.ampm} onChange={(e) => handleAmPmChange('start', e.target.value)}>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <span className={styles.timezone}>{timezone}</span>
              </div>
            </div>
            <div className={styles.timeGroup}>
              <label>End time</label>
              <div className={styles.timeInput}>
                <Clock size={16} className={styles.timeIcon} />
                <input type="text" value={endTime.hh} onChange={(e) => handleTimeChange('end', 'hh', e.target.value)} onBlur={(e) => handleTimeBlur('end', 'hh', e.target.value)} maxLength={2} />
                <span>:</span>
                <input type="text" value={endTime.mm} onChange={(e) => handleTimeChange('end', 'mm', e.target.value)} onBlur={(e) => handleTimeBlur('end', 'mm', e.target.value)} maxLength={2} />
                <span>:</span>
                <input type="text" value={endTime.ss} onChange={(e) => handleTimeChange('end', 'ss', e.target.value)} onBlur={(e) => handleTimeBlur('end', 'ss', e.target.value)} maxLength={2} />
                <div className={styles.selectWrapper}>
                  <select value={endTime.ampm} onChange={(e) => handleAmPmChange('end', e.target.value)}>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                  <ChevronDown size={14} className={styles.selectArrow} />
                </div>
                <span className={styles.timezone}>{timezone}</span>
              </div>
            </div>
          </div>
      </div>
    </div>,
    document.body
  );
};

export default DateRangePopup;