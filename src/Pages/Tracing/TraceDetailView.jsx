// src/Pages/Tracing/TraceDetailView.jsx
import React, { useState } from 'react';
import styles from './TraceDetailView.module.css';
import { Copy, List, Clipboard, Plus, SquarePen, ChevronDown, MessageSquare } from 'lucide-react';
import Toast from '../../components/Toast/Toast';

const TraceDetailView = ({ details, isLoading, error }) => {
  const [viewFormat, setViewFormat] = useState('Formatted');
  const [toastInfo, setToastInfo] = useState({ isVisible: false, message: '' });

  const handleCopy = (text, type) => {
    const textToCopy = typeof text === 'object' ? JSON.stringify(text, null, 2) : String(text);
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setToastInfo({ isVisible: true, message: `${type}이(가) 클립보드에 복사되었습니다.` });
      })
      .catch(err => {
        console.error("복사에 실패했습니다.", err);
        setToastInfo({ isVisible: true, message: '복사에 실패했습니다.' });
      });
  };

  const renderContent = (title, data, type = 'default') => {
    const content = viewFormat === 'JSON'
      ? JSON.stringify(data, null, 2)
      : (data === null || data === undefined ? 'null' : typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data));
    
    const cardStyle = type === 'output' ? styles.outputCard : '';

    return (
      <div className={`${styles.contentCard} ${cardStyle}`}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <button className={styles.copyButton} onClick={() => handleCopy(content, title)} title="Copy content">
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

  // 데이터가 Observation인지 Trace인지 확인 (type 필드 유무로 구분)
  const isObservation = 'type' in details && ('traceId' in details);

  const metadata = details.metadata ?? {};
  const name = details.name ?? 'N/A';
  const id = details.id;

  return (
    <div className={styles.body}>
      <Toast
        message={toastInfo.message}
        isVisible={toastInfo.isVisible}
        onClose={() => setToastInfo({ isVisible: false, message: '' })}
      />
      <div className={styles.infoBar}>
        <div className={styles.infoBarTop}>
          <div className={styles.infoBarTitle}>
            <List size={20} />
            <h2 className={styles.traceName}>{name}</h2>
            <button 
              className={styles.idButton} 
              title="Copy ID" 
              onClick={() => handleCopy(id, 'ID')}
            >
              <Clipboard size={12} /> ID
            </button>
          </div>
          <div className={styles.infoBarActions}>
            <button className={styles.actionButton}>
              <Plus size={14} /> Add to datasets
            </button>
            <div className={styles.annotateButton}>
              <button>
                <SquarePen size={14} /> Annotate
              </button>
              <div className={styles.annotateButtonChevron}>
                <ChevronDown size={16} />
              </div>
            </div>
            <button className={`${styles.iconButton} ${styles.actionButtonSecondary}`}>
              <MessageSquare size={16} />
            </button>
          </div>
        </div>
        <div className={styles.infoBarBottom}>
          <span className={styles.timestamp}>
            {isObservation 
              ? new Date(details.startTime).toISOString()
              : new Date(details.timestamp).toISOString()
            }
          </span>
          <div className={styles.pills}>
            <div className={`${styles.pill} ${styles.pillUser}`}>
              User ID: {details.userId ?? 'N/A'}
            </div>
            <div className={`${styles.pill} ${styles.pillEnv}`}>
              Env: {details.environment ?? 'default'}
            </div>
          </div>
        </div>
      </div>

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
      
      {/* Observation일 경우 모델 파라미터 추가 표시 */}
      {isObservation && details.modelParameters && renderContent("Model Parameters", details.modelParameters)}

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