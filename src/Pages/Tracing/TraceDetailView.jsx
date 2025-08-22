// src/Pages/Tracing/TraceDetailView.jsx
import React, { useState } from 'react';
import styles from './TraceDetailPanel.module.css';
import { Copy } from 'lucide-react';
import Toast from '../../components/Toast/Toast';

const TraceDetailView = ({ details, isLoading, error }) => {
  // 1. 'Formatted'와 'JSON' 뷰 상태를 관리하는 State입니다.
  const [viewFormat, setViewFormat] = useState('Formatted');
  const [toastInfo, setToastInfo] = useState({ isVisible: false, message: '' });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setToastInfo({ isVisible: true, message: '클립보드에 복사되었습니다.' });
      })
      .catch(err => {
        console.error("복사에 실패했습니다.", err);
        setToastInfo({ isVisible: true, message: '복사에 실패했습니다.' });
      });
  };

  // 2. viewFormat 상태에 따라 콘텐츠를 다르게 렌더링하는 함수입니다.
  const renderContent = (title, data, type = 'default') => {
    // 'JSON' 버튼이 활성화되면 JSON.stringify를 사용해 데이터를 보기 좋게 변환합니다.
    const content = viewFormat === 'JSON'
      ? JSON.stringify(data, null, 2)
      : (data === null || data === undefined ? 'null' : String(data));
    
    const cardStyle = type === 'output' ? styles.outputCard : '';

    return (
      <div className={`${styles.contentCard} ${cardStyle}`}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <button className={styles.copyButton} onClick={() => handleCopy(content)} title="Copy content">
            <Copy size={14} />
          </button>
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
      <Toast
        message={toastInfo.message}
        isVisible={toastInfo.isVisible}
        onClose={() => setToastInfo({ isVisible: false, message: '' })}
      />
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

      {/* 3. 이 버튼들이 클릭될 때 setViewFormat이 호출되어 viewFormat 상태를 변경합니다. */}
      <div className={styles.formatToggle}>
        <button
          className={`${styles.toggleButton} ${viewFormat === 'Formatted' ? styles.active : ''}`}
          onClick={() => setViewFormat('Formatted')}
        >
          Formatted
        </button>
        <button
          className={`${styles.toggleButton} ${viewFormat === 'JSON' ? styles.active : ''}`}
          onClick={() => setViewFormat('JSON')}
        >
          JSON
        </button>
      </div>

      {renderContent("Input", details.input, 'input')}
      {renderContent("Output", details.output, 'output')}

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