// src/pages/Tracing/SessionDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SessionDetail.module.css';
import { Star } from 'lucide-react';
import { fetchSessionDetails } from './SessionDetailApi';
import { UiSessionData, UiTrace } from './sessionDetailTypes';

type ViewMode = 'Formatted' | 'JSON';

const TraceCard: React.FC<{ trace: UiTrace; viewMode: ViewMode; setViewMode: (mode: ViewMode) => void }> = ({ trace, viewMode, setViewMode }) => {
    const statusClass = trace.status === 'positive' ? styles.positiveBar : styles.neutralBar;

    const renderContent = () => {
        // ▼▼▼ 오류 수정 ▼▼▼
        // trace.input이 null이 아니고, 배열이 아닌 객체이며, 비어있지 않은지 확인합니다.
        const hasInput = trace.input && typeof trace.input === 'object' && !Array.isArray(trace.input) && Object.keys(trace.input).length > 0;
        
        const inputJson = JSON.stringify(trace.input, null, 2);
        const outputJson = JSON.stringify({ output: trace.output }, null, 2);

        if (viewMode === 'JSON') {
            return (
                <>
                    <div className={styles.contentBox}>
                        <h4>Input</h4>
                        <pre>{inputJson}</pre>
                    </div>
                    <div className={styles.contentBox}>
                        <h4>Output</h4>
                        <pre>{outputJson}</pre>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className={styles.contentBox}>
                    <h4>Input</h4>
                    {/* 수정된 확인 로직을 적용합니다. */}
                    <pre>{hasInput ? inputJson : 'No Input'}</pre>
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
    const [session, setSession] = useState<UiSessionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('Formatted');

    useEffect(() => {
        if (!sessionId) return;
        
        const loadSessionDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchSessionDetails(sessionId);
                setSession(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        loadSessionDetails();
    }, [sessionId]);

    if (isLoading) {
        return <div className={styles.container}>Loading session details...</div>;
    }
    if (error) {
        return <div className={styles.container} style={{ color: 'red' }}>Error: {error}</div>;
    }
    if (!session) {
        return <div className={styles.container}>Session not found.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.sessionId}>Session {session.id}</h1>
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