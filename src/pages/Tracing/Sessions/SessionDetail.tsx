// src/pages/Tracing/SessionDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SessionDetail.module.css';
import { Star } from 'lucide-react';
import { DUMMY_SESSION_DETAILS, SessionDetailData, TraceItem } from 'data/dummySessionDetailData';

// 보기 모드 타입을 정의합니다.
type ViewMode = 'Formatted' | 'JSON';

// 단일 트레이스 카드를 렌더링하는 내부 컴포넌트
// viewMode와 setViewMode를 props로 전달받습니다.
const TraceCard: React.FC<{ trace: TraceItem; viewMode: ViewMode; setViewMode: (mode: ViewMode) => void }> = ({ trace, viewMode, setViewMode }) => {
    const statusClass = trace.status === 'positive' ? styles.positiveBar : styles.neutralBar;

    // Input과 Output 컨텐츠를 viewMode에 따라 동적으로 렌더링하는 함수
    const renderContent = () => {
        if (viewMode === 'JSON') {
            return (
                <>
                    <div className={styles.contentBox}>
                        <h4>Input</h4>
                        <pre>{JSON.stringify(trace.input, null, 2)}</pre>
                    </div>
                    <div className={styles.contentBox}>
                        <h4>Output</h4>
                        {/* Output은 문자열이므로 JSON 객체로 감싸서 표시합니다. */}
                        <pre>{JSON.stringify({ output: trace.output }, null, 2)}</pre>
                    </div>
                </>
            );
        }

        // Formatted (기본) 뷰
        return (
            <>
                <div className={styles.contentBox}>
                    <h4>Input</h4>
                    <pre>{Object.keys(trace.input).length > 0 ? JSON.stringify(trace.input, null, 2) : 'No Input'}</pre>
                </div>
                <div className={styles.contentBox}>
                    <h4>Output</h4>
                    <p className={styles.outputText}>
                       <span className={styles.highlight}>{trace.output.split(' ')[0]}</span> {trace.output.substring(trace.output.indexOf(' ') + 1)}
                    </p>
                </div>
            </>
        );
    };

    return (
        <div className={styles.traceCard}>
            <div className={`${styles.summaryBar} ${statusClass}`}>
                <p className={styles.summaryText}>{trace.summary}</p>
                <div className={styles.summaryScores}>
                    {trace.scores.slice(0, 5).map(score => (
                        <div key={score.name} className={styles.scorePill}>
                            {score.name.substring(0, 10)}...: {score.value.toFixed(2)}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.traceBody}>
                <div className={styles.ioSection}>
                    <div className={styles.ioTabs}>
                        <button 
                          className={`${styles.ioTab} ${viewMode === 'Formatted' ? styles.active : ''}`}
                          onClick={() => setViewMode('Formatted')}
                        >
                          Formatted
                        </button>
                        <button 
                          className={`${styles.ioTab} ${viewMode === 'JSON' ? styles.active : ''}`}
                          onClick={() => setViewMode('JSON')}
                        >
                          JSON
                        </button>
                    </div>
                    {renderContent()}
                </div>
                <div className={styles.metadataSection}>
                    <div className={styles.metaHeader}>
                        <span>Trace: {trace.id}</span>
                        <span>{trace.timestamp.toLocaleString()}</span>
                    </div>
                     <div className={styles.scoresGrid}>
                        <h4 className={styles.scoresTitle}>Scores</h4>
                        {trace.scores.map(score => (
                            <div key={score.name} className={styles.scoreItem}>
                                <span>{score.name}</span>
                                <span className={styles.scoreValue}>{score.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SessionDetail: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [session, setSession] = useState<SessionDetailData | null>(null);
    // 보기 모드 상태를 부모 컴포넌트에서 관리합니다.
    const [viewMode, setViewMode] = useState<ViewMode>('Formatted');

    useEffect(() => {
        if (sessionId === DUMMY_SESSION_DETAILS.id) {
            setSession(DUMMY_SESSION_DETAILS);
        }
    }, [sessionId]);

    if (!session) {
        return <div className={styles.container}>Loading or session not found...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.sessionId}>{session.id}</h1>
                <div className={styles.headerActions}>
                    <Star size={18} className={styles.starIcon} />
                    <button className={styles.actionButton}>Annotate</button>
                </div>
            </div>
            
            <div className={styles.timeline}>
                {session.traces.map(trace => (
                    <TraceCard 
                      key={trace.id} 
                      trace={trace} 
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                    />
                ))}
            </div>
        </div>
    );
};

export default SessionDetail;