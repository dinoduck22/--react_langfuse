// src/pages/Tracing/TraceDetailPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Edit, Plus, HardDrive, Maximize, ExternalLinkIcon } from 'lucide-react';
import { fetchTraceDetails } from './TraceDetailApi';
import styles from './TraceDetailPanel.module.css';

const TraceDetailPanel = ({ trace, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const renderContent = (title, data) => {
    const content = data === null || data === undefined ? 'null' :
                    typeof data === 'object' ? JSON.stringify(data, null, 2) :
                    String(data);
    return (
      <div className={styles.contentCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
        <div className={styles.cardBody}>
          <pre>{content}</pre>
        </div>
      </div>
    );
  };

  const renderBody = () => {
    if (isLoading) return <div className={styles.body}>Loading details...</div>;
    if (error) return <div className={styles.body} style={{ color: 'red' }}>{error}</div>;
    if (!details) return <div className={styles.body}>No details available.</div>;

    const metadata = details.metadata ?? {};

    return (
      <div className={styles.body}>
        <div className={styles.infoBar}>
          <div className={styles.infoRow}>
            <span className={styles.traceName}>{details.name}</span>
            <span className={styles.timestamp}>{new Date(details.timestamp).toLocaleString()}</span>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.pills}>
              <div className={styles.infoPill}>
                <span>User ID:</span>
                <span>{details.userId ?? 'N/A'}</span>
              </div>
              <div className={styles.infoPill}>
                <span>Env:</span>
                <span>{details.environment ?? 'default'}</span>
              </div>
            </div>
          </div>
        </div>

        {renderContent("Input", details.input)}
        {renderContent("Output", details.output)}

        <div className={styles.contentCard}>
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
      </div>
    );
  };

  return (
    <div ref={panelRef} className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {/* 2. 'Trace' 텍스트 대신 아이콘과 텍스트를 포함하는 pill 컴포넌트로 변경합니다. */}
          <div className={styles.tracePill}>
            <HardDrive size={14} />
            <span>Trace</span>
          </div>
          <span className={styles.traceId}>{trace.id}</span>
        </div>
        {/* 3. headerRight의 버튼들을 이미지와 같이 수정합니다. */}
        <div className={styles.headerRight}>
          <button className={styles.iconButton} title="Maximize">
            <Maximize size={16} />
          </button>
          <button className={styles.iconButton} title="Maximize">
            <ExternalLinkIcon size={16} />
          </button>
          <button className={styles.iconButton} onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>
      </div>
      {renderBody()}
    </div>
  );
};

export default TraceDetailPanel;
