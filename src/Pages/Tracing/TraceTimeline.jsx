// src/Pages/Tracing/TraceTimeline.jsx
import React, { useState, useEffect } from 'react';
import styles from './TraceTimeline.module.css';
import { 
  MessageSquare, 
  Loader, 
  AlertTriangle, 
  ArrowRightLeft, 
  ChevronDown,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Download,
  GitBranch
} from 'lucide-react';
import { fetchObservationsForTrace } from './TraceTimelineApi';

// 재귀적으로 노드를 렌더링하는 컴포넌트
const ObservationNode = ({ node, allNodes, level, selectedId, onSelect }) => {
  const children = allNodes.filter(n => n.parentObservationId === node.id);
  const isSelected = selectedId === node.id;

  // 아이콘 결정 로직
  const getIcon = (type) => {
    switch (type) {
      case 'SPAN':
        return <ArrowRightLeft size={16} />;
      case 'GENERATION':
        return <GitBranch size={16} className={styles.generationIcon} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  return (
    <li className={styles.nodeContainer}>
      <div 
        className={`${styles.timelineItem} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${level * 24}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div className={styles.itemLineage}>
          {Array.from({ length: level }).map((_, i) => <div key={i} className={styles.lineSegment}></div>)}
        </div>
        <div className={styles.itemIcon}>{getIcon(node.type)}</div>
        <div className={styles.itemContent}>
          <div className={styles.itemHeader}>
            <span className={styles.itemName}>{node.name}</span>
            <span className={styles.latency}>{node.latency.toFixed(2)}s</span>
          </div>
          {node.scores && (
            <div className={styles.scoreTags}>
              {node.scores.map(score => (
                <span key={score.name} className={styles.scoreTag}>
                  {score.name}: {score.value.toFixed(2)} <MessageCircle size={12} />
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown size={16} className={styles.chevron} />
      </div>
      {children.length > 0 && (
        <ul className={styles.nodeChildren}>
          {children.map(child => (
            <ObservationNode 
              key={child.id} 
              node={child} 
              allNodes={allNodes} 
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TraceTimeline = ({ details, onObservationSelect }) => {
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedObservationId, setSelectedObservationId] = useState(null);

  useEffect(() => {
    if (!details?.id) {
      setIsLoading(false);
      return;
    }

    const loadObservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedObservations = await fetchObservationsForTrace(details.id);
        setObservations(fetchedObservations);
        
        // 첫 번째 Observation을 기본으로 선택
        if (fetchedObservations.length > 0) {
          setSelectedObservationId(fetchedObservations[0].id);
          onObservationSelect(fetchedObservations[0].id);
        } else {
          // Observation이 없으면 null 대신 trace 원본 데이터를 표시하도록 요청
          onObservationSelect(null); 
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadObservations();
  }, [details, onObservationSelect]);

  const handleSelect = (id) => {
    setSelectedObservationId(id);
    onObservationSelect(id);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.status}>
          <Loader size={16} className={styles.loaderIcon} />
          <span>Loading timeline...</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className={`${styles.status} ${styles.error}`}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      );
    }
    if (observations.length === 0) {
      // Observation이 없을 때 Trace 자체를 보여주기 위해 Trace 정보를 기본 아이템으로 표시
      return (
        <ul className={styles.timelineList}>
          <li className={`${styles.timelineItem} ${!selectedObservationId ? styles.selected : ''}`}
              onClick={() => handleSelect(null)}>
            <div className={styles.itemIcon}>
              <MessageSquare size={16} />
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemName}>{details?.name ?? 'Trace'}</span>
              <span className={styles.itemMeta}>{details?.timestamp ? new Date(details.timestamp).toLocaleString() : ''}</span>
            </div>
          </li>
        </ul>
      );
    }
    return (
      <ul className={styles.timelineList}>
        {observations.map((obs) => (
          <li
            key={obs.id}
            className={`${styles.timelineItem} ${selectedObservationId === obs.id ? styles.selected : ''}`}
            onClick={() => handleSelect(obs.id)}
          >
            <div className={styles.itemIcon}>
              <MessageSquare size={16} />
            </div>
            <div className={styles.itemContent}>
              <span className={styles.itemName}>{obs.name}</span>
              <span className={styles.itemMeta}>{obs.startTime}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.header}>
        <h3>Timeline</h3>
      </div>
      {renderContent()}
    </div>
  );
};

export default TraceTimeline;