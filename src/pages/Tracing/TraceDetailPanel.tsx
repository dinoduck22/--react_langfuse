import React, { useState } from 'react';
import { X, Tag, Copy, Download, MessageSquare } from 'lucide-react';
import { Trace } from '../../data/dummyTraces';
import styles from './TraceDetailPanel.module.css';

interface TraceDetailPanelProps {
  trace: Trace;
  onClose: () => void;
}

const TraceDetailPanel: React.FC<TraceDetailPanelProps> = ({ trace, onClose }) => {
  const [activeTab, setActiveTab] = useState<'Input' | 'Output'>('Output');

  return (
    <div className={styles.panel}>
      {/* 1. 헤더 */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Trace</h3>
          <span className={styles.traceId}>{trace.id}</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionButton}><Tag size={14} /> Add to dataset</button>
          <button className={styles.iconButton}><Copy size={16} /></button>
          <button className={styles.iconButton}><Download size={16} /></button>
          <button className={styles.iconButton} onClick={onClose}><X size={18} /></button>
        </div>
      </div>

      <div className={styles.body}>
        {/* 2. 타임라인 (단순화) */}
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <MessageSquare size={16} />
            <span>{trace.name}</span>
            <span className={styles.duration}>{(trace.latency / 1000).toFixed(2)}s</span>
          </div>
        </div>

        {/* 3. 메타데이터 */}
        <div className={styles.metadataGrid}>
          <div><span>Session</span><span className={styles.link}>{trace.sessionId}</span></div>
          <div><span>User ID</span><span className={styles.link}>{trace.userId}</span></div>
          <div><span>Env</span><span>{trace.env}</span></div>
          <div><span>Latency</span><span>{trace.latency}ms</span></div>
          <div><span>Total Cost</span><span>${trace.cost.toFixed(6)}</span></div>
          <div><span>Release</span><span>{trace.release || 'N/A'}</span></div>
        </div>

        {/* 4. Input/Output 탭 */}
        <div className={styles.ioSection}>
          <div className={styles.tabs}>
            <button
              className={activeTab === 'Input' ? styles.active : ''}
              onClick={() => setActiveTab('Input')}
            >
              Input
            </button>
            <button
              className={activeTab === 'Output' ? styles.active : ''}
              onClick={() => setActiveTab('Output')}
            >
              Output
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'Input' && <pre>{trace.input}</pre>}
            {activeTab === 'Output' && <pre>{trace.output}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceDetailPanel;