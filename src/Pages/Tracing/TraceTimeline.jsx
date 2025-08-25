// src/Pages/Tracing/TraceTimeline.jsx
import React, { useState, useEffect } from 'react';
import styles from './TraceTimeline.module.css';
import { MessageSquare, Loader, AlertTriangle } from 'lucide-react';
import { fetchObservationsForTrace } from './TraceTimelineApi';

const TraceTimeline = ({ details, onObservationSelect }) => {
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedObservationId, setSelectedObservationId] = useState(null);

  useEffect(() => {
    if (!details?.id) {
      setIsLoading(false);
      return;
    }

    const loadObservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedObservations = await fetchObservationsForTrace(details.id);
        setObservations(fetchedObservations);
        
        // 첫 번째 Observation을 기본으로 선택
        if (fetchedObservations.length > 0) {
          setSelectedObservationId(fetchedObservations[0].id);
          onObservationSelect(fetchedObservations[0].id);
        } else {
          // Observation이 없으면 null 대신 trace 원본 데이터를 표시하도록 요청
          onObservationSelect(null); 
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadObservations();
  }, [details, onObservationSelect]);

  const handleSelect = (id) => {
    setSelectedObservationId(id);
    onObservationSelect(id);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.status}>
          <Loader size={16} className={styles.loaderIcon} />
          <span>Loading timeline...</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className={`${styles.status} ${styles.error}`}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      );
    }
    if (observations.length === 0) {
      // Observation이 없을 때 Trace 자체를 보여주기 위해 Trace 정보를 기본 아이템으로 표시
      return (
        <ul className={styles.timelineList}>
          <li className={`${styles.timelineItem} ${!selectedObservationId ? styles.selected : ''}`}
              onClick={() => handleSelect(null)}>
            <div className={styles.itemIcon}>
              <MessageSquare size={16} />
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemName}>{details?.name ?? 'Trace'}</span>
              <span className={styles.itemMeta}>{details?.timestamp ? new Date(details.timestamp).toLocaleString() : ''}</span>
            </div>
          </li>
        </ul>
      );
    }
    return (
      <ul className={styles.timelineList}>
        {observations.map((obs) => (
          <li
            key={obs.id}
            className={`${styles.timelineItem} ${selectedObservationId === obs.id ? styles.selected : ''}`}
            onClick={() => handleSelect(obs.id)}
          >
            <div className={styles.itemIcon}>
              <MessageSquare size={16} />
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemName}>{obs.name}</span>
              <span className={styles.itemMeta}>{obs.startTime}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.header}>
        <h3>Timeline</h3>
      </div>
      {renderContent()}
    </div>
  );
};

export default TraceTimeline;