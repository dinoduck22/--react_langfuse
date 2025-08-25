// src/pages/Tracing/TraceDetailPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize, Minimize, HardDrive } from 'lucide-react';
import { fetchTraceDetails } from './TraceDetailApi';
import styles from './TraceDetailPanel.module.css';
import TraceDetailView from './TraceDetailView';
import TraceTimeline from './TraceTimeline'; // Timeline 컴포넌트 import

const TraceDetailPanel = ({ trace, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
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
      {/* 2단 그리드 레이아웃으로 변경 */}
      <div className={styles.panelBody}>
        <div className={styles.timelineSection}>
          <TraceTimeline details={details} isLoading={isLoading} error={error} />
        </div>
        <div className={styles.detailSection}>
          <TraceDetailView details={details} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default TraceDetailPanel;