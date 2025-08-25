// src/pages/Tracing/TraceDetailPanel.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Maximize, Minimize, HardDrive } from 'lucide-react';
import { fetchTraceDetails } from './TraceDetailApi';
import { fetchObservationDetails } from './ObservationDetailApi'; // Observation API import
import styles from './TraceDetailPanel.module.css';
import TraceDetailView from './TraceDetailView';
import TraceTimeline from './TraceTimeline';

const TraceDetailPanel = ({ trace, onClose }) => {
  const [traceDetails, setTraceDetails] = useState(null);
  const [viewData, setViewData] = useState(null); // 표시될 데이터 (Trace 또는 Observation)
  const [selectedObservationId, setSelectedObservationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const panelRef = useRef(null);

  // Trace 기본 정보 로드
  useEffect(() => {
    if (!trace.id) return;
    const loadTrace = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await fetchTraceDetails(trace.id);
        setTraceDetails(details);
        setViewData(details); // 처음에는 Trace 정보를 보여줌
      } catch (err) {
        setError("Trace 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTrace();
  }, [trace.id]);

  // 선택된 Observation이 변경되면 해당 상세 정보를 로드
  useEffect(() => {
    const loadObservation = async () => {
      if (!selectedObservationId) {
        setViewData(traceDetails); // Observation 선택 해제 시 Trace 정보로 복귀
        return;
      }
      setIsLoading(true);
      try {
        const obsDetails = await fetchObservationDetails(selectedObservationId);
        setViewData(obsDetails);
      } catch (err) {
        setError("Observation 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadObservation();
  }, [selectedObservationId, traceDetails]);
  
  const handleObservationSelect = useCallback((observationId) => {
    setSelectedObservationId(observationId);
  }, []);

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
      <div className={styles.panelBody}>
        <div className={styles.timelineSection}>
          <TraceTimeline details={traceDetails} onObservationSelect={handleObservationSelect} />
        </div>
        <div className={styles.detailSection}>
          <TraceDetailView details={viewData} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default TraceDetailPanel;