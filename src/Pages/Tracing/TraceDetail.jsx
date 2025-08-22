// src/Pages/Tracing/TraceDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchTraceDetails } from './TraceDetailApi';
import styles from './TraceDetailPanel.module.css'; // Panel 스타일 재사용
import pageStyles from './Sessions/SessionDetail.module.css'; // SessionDetail 페이지 스타일 재사용
import { Tag, Copy, Download, MessageSquare, ExternalLink, ArrowLeft } from 'lucide-react';

const TraceDetail = () => {
  const { traceId } = useParams();
  const navigate = useNavigate();
  const [trace, setTrace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Output');

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

  if (isLoading) {
    return <div className={pageStyles.container}>Loading trace details...</div>;
  }
  if (error) {
    return <div className={pageStyles.container} style={{ color: 'red' }}>Error: {error}</div>;
  }
  if (!trace) {
    return <div className={pageStyles.container}>Trace not found.</div>;
  }

  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/trace')} className={pageStyles.actionButton}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className={pageStyles.sessionId}>Trace {trace.id}</h1>
        </div>
        <div className={pageStyles.headerActions}>
           {trace.htmlPath && (
            <a href={trace.htmlPath} target="_blank" rel="noopener noreferrer" className={pageStyles.actionButton}>
              <ExternalLink size={14} /> View in Langfuse
            </a>
          )}
          <button className={pageStyles.actionButton}><Tag size={14} /> Add to dataset</button>
          <button className={pageStyles.actionButton}><Copy size={16} /></button>
          <button className={pageStyles.actionButton}><Download size={16} /></button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <MessageSquare size={16} />
            <span>{trace.name}</span>
            <span className={styles.duration}>{(trace.latency).toFixed(2)}s</span>
          </div>
        </div>

        <div className={styles.metadataGrid}>
          <div><span>Session</span>{trace.sessionId ? <Link to={`/sessions/${trace.sessionId}`} className={styles.link}>{trace.sessionId}</Link> : 'N/A'}</div>
          <div><span>User ID</span><span className={styles.link}>{trace.userId || 'N/A'}</span></div>
          <div><span>Env</span><span>{trace.environment || 'default'}</span></div>
          <div><span>Latency</span><span>{(trace.latency * 1000).toFixed(0)}ms</span></div>
          <div><span>Total Cost</span><span>${(trace.cost ?? 0).toFixed(6)}</span></div>
          <div><span>Release</span><span>{trace.release || 'N/A'}</span></div>
          <div><span>Tags</span><span>{(trace.tags ?? []).join(', ') || 'N/A'}</span></div>
          <div><span>Public</span><span>{String(trace.public)}</span></div>
        </div>

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
            {activeTab === 'Input' && <pre>{JSON.stringify(trace.input, null, 2)}</pre>}
            {activeTab === 'Output' && <pre>{JSON.stringify(trace.output, null, 2)}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceDetail;