// src/Pages/Tracing/TraceDetailView.jsx
import React from 'react';
import styles from './TraceDetailPanel.module.css'; // 패널 스타일을 공통으로 사용

// 상세 뷰를 렌더링하는 공통 UI 컴포넌트
const TraceDetailView = ({ details, isLoading, error }) => {
  
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

export default TraceDetailView;
