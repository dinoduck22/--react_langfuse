// src/pages/Tracing/TraceDetailPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
// 1. Link를 제거하고, Maximize와 Minimize 아이콘을 import 합니다.
import { X, Maximize, Minimize, HardDrive } from 'lucide-react';
import { fetchTraceDetails } from './TraceDetailApi';
import styles from './TraceDetailPanel.module.css';
import TraceDetailView from './TraceDetailView';

const TraceDetailPanel = ({ trace, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false); // 2. 패널 크기 상태 추가
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (!trace.id) return;
    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const traceDetails = await fetchTraceDetails(trace.id);
        setDetails(traceDetails);
      } catch (err) {
        setError("상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [trace.id]);

  return (
    // 3. isMaximized 상태에 따라 'maximized' 클래스를 동적으로 추가합니다.
    <div ref={panelRef} className={`${styles.panel} ${isMaximized ? styles.maximized : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.tracePill}>
            <HardDrive size={14} />
            <span>Trace</span>
          </div>
          <span className={styles.traceId}>{trace.id}</span>
        </div>
        <div className={styles.headerRight}>
          {/* 4. Maximize/Minimize 토글 버튼으로 변경합니다. */}
          <button 
            className={styles.iconButton} 
            onClick={() => setIsMaximized(!isMaximized)} 
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button className={styles.iconButton} onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>
      </div>
      <TraceDetailView details={details} isLoading={isLoading} error={error} />
    </div>
  );
};

export default TraceDetailPanel;
