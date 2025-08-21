// src/pages/Tracing/SessionDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SessionDetail.module.css';
import { Star, ChevronsUpDown, Copy } from 'lucide-react';
import { DUMMY_SESSION_DETAIL, SessionDetailData, TraceItem } from 'data/dummySessionDetailData';

const SessionDetail: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionDetailData | null>(null);
  const [selectedTrace, setSelectedTrace] = useState<TraceItem | null>(null);

  useEffect(() => {
    // 실제 앱에서는 API를 통해 sessionId에 해당하는 데이터를 가져옵니다.
    // 여기서는 임시 데이터를 사용합니다.
    if (sessionId === DUMMY_SESSION_DETAIL.id) {
      setSession(DUMMY_SESSION_DETAIL);
      setSelectedTrace(DUMMY_SESSION_DETAIL.traces[0]);
    }
  }, [sessionId]);

  if (!session || !selectedTrace) {
    return <div className={styles.container}>Loading session details or session not found...</div>;
  }

  return (
    <div className={styles.container}>
      {/* --- 헤더 --- */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.sessionLabel}>Session</span>
          <h1 className={styles.sessionId}>{session.id}</h1>
          <Star size={18} className={styles.starIcon} />
        </div>
        <div className={styles.headerRight}>
          <button className={styles.actionButton}>Annotate</button>
        </div>
      </div>

      {/* --- 메타 정보 --- */}
      <div className={styles.metaBar}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>User ID:</span>
          <span className={styles.metaValue}>{session.userId}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Traces:</span>
          <span className={styles.metaValue}>{session.traceCount}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Total cost:</span>
          <span className={styles.metaValue}>${session.totalCost.toFixed(6)}</span>
        </div>
      </div>

      {/* --- 메인 컨텐츠 --- */}
      <div className={styles.mainContent}>
        {/* 왼쪽: 트레이스 목록 */}
        <div className={styles.traceList}>
          <div className={styles.listHeader}>
            <span>Traces</span>
            <ChevronsUpDown size={16} />
          </div>
          {session.traces.map((trace) => (
            <div
              key={trace.id}
              className={`${styles.traceItem} ${trace.id === selectedTrace.id ? styles.selected : ''}`}
              onClick={() => setSelectedTrace(trace)}
            >
              <div className={styles.traceItemInfo}>
                <span className={styles.traceName}>{trace.name}</span>
                <span className={styles.traceTime}>{trace.timestamp.toLocaleTimeString()}</span>
              </div>
              <span className={styles.traceDuration}>{trace.duration}</span>
            </div>
          ))}
        </div>

        {/* 오른쪽: 상세 정보 */}
        <div className={styles.detailView}>
          <div className={styles.ioPanels}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.tabs}>
                  <button className={`${styles.tab} ${styles.active}`}>Formatted</button>
                  <button className={styles.tab}>JSON</button>
                </div>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.ioSection}>
                  <h3 className={styles.ioTitle}>Input</h3>
                  <pre>{JSON.stringify(selectedTrace.input, null, 2)}</pre>
                </div>
                <div className={styles.ioSection}>
                  <h3 className={styles.ioTitle}>Output</h3>
                  <div className={styles.outputContent} dangerouslySetInnerHTML={{ __html: selectedTrace.output.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.scoresPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.traceInfo}>
                Trace: {selectedTrace.id}
                <Copy size={14} className={styles.copyIcon} />
              </div>
              <span className={styles.timestamp}>{selectedTrace.timestamp.toLocaleString()}</span>
            </div>
            <div className={styles.panelBody}>
              <h3 className={styles.scoresTitle}>Scores</h3>
              <div className={styles.scoresGrid}>
                {selectedTrace.scores.map(score => (
                  <div key={score.name} className={styles.scoreItem}>
                    <span>{score.name}</span>
                    <span className={styles.scoreValue}>{score.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;