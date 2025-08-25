// src/Pages/Tracing/TraceTimeline.jsx
import React, { useState, useEffect } from 'react';
import styles from './TraceTimeline.module.css';
import { MessageSquare, Loader, AlertTriangle } from 'lucide-react';
import { fetchObservationsForTrace } from './TraceTimelineApi';

const TraceTimeline = ({ details }) => {
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadObservations();
  }, [details]);

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
      return <div className={styles.status}>No observations found for this trace.</div>;
    }
    return (
      <ul className={styles.timelineList}>
        {observations.map((obs, index) => (
          <li
            key={obs.id}
            className={`${styles.timelineItem} ${index === 0 ? styles.selected : ''}`}
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