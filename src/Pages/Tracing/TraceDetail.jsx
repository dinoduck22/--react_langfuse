// src/Pages/Tracing/TraceDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTraceDetails } from './TraceDetailApi';
import styles from './TraceDetail.module.css'; // 새로 만든 CSS 모듈 import
import { HardDrive, Edit, Plus, Annoyed } from 'lucide-react';

// API 데이터 구조에 기반한 TypeScript 타입 정의
/** @typedef {import('./types').TraceWithFullDetails} TraceWithFullDetails */

const TraceDetail = () => {
  const { traceId } = useParams();
  const navigate = useNavigate();
  /** @type {[TraceWithFullDetails | null, React.Dispatch<React.SetStateAction<TraceWithFullDetails | null>>]} */
  const [trace, setTrace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!traceId) return;

    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const traceDetails = await fetchTraceDetails(traceId);
        setTrace(traceDetails);
      } catch (err) {
        setError("Trace 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [traceId]);

  const renderJsonOrPrimitive = (title, data) => {
    const content = data === null || data === undefined ? 'null' :
                    typeof data === 'object' ? JSON.stringify(data, null, 2) :
                    String(data);
    return (
      <div className={styles.ioCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
        <div className={styles.cardBody}>
          <pre>{content}</pre>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className={styles.pageContainer}>Loading trace details...</div>;
  }
  if (error || !trace) {
    return <div className={styles.pageContainer}>Error: {error || "Trace not found."}</div>;
  }

  const metadata = trace.metadata ?? {};

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <HardDrive size={16} />
          <span>Trace</span>
          <span>{trace.id}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}><Plus size={14} /> Add to datasets</button>
          <button className={styles.actionButton}><Edit size={14} /> Annotate</button>
        </div>
      </header>

      <div className={styles.infoBar}>
        <div className={styles.infoLeft}>
          <span className={styles.traceName}>{trace.name}</span>
          <span className={styles.timestamp}>{new Date(trace.timestamp).toLocaleString()}</span>
        </div>
        <div className={styles.infoRight}>
          <div className={styles.infoPill}>
            <span>User ID:</span>
            <span>{trace.userId ?? 'N/A'}</span>
          </div>
          <div className={styles.infoPill}>
            <span>Env:</span>
            <span>{trace.environment ?? 'default'}</span>
          </div>
        </div>
      </div>

      <main className={styles.previewContainer}>
        {renderJsonOrPrimitive("Input", trace.input)}
        {renderJsonOrPrimitive("Output", trace.output)}
        
        {/* Metadata Card */}
        <div className={styles.ioCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Metadata</h3>
          </div>
          <div className={styles.cardBody}>
            {Object.keys(metadata).length > 0 ? (
              <table className={styles.metadataTable}>
                <tbody>
                  {Object.entries(metadata).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td><pre>{JSON.stringify(value, null, 2)}</pre></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No metadata available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TraceDetail;