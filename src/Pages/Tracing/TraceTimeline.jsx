// src/Pages/Tracing/TraceTimeline.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styles from './TraceTimeline.module.css';
import {
  MessageSquare,
  Loader,
  AlertTriangle,
  ArrowRightLeft,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Download,
  GitBranch,
  ListTree // 아이콘 추가
} from 'lucide-react';
import { fetchObservationsForTrace } from './TraceTimelineApi';

// 재귀적으로 노드를 렌더링하는 컴포넌트
const ObservationNode = ({ node, allNodes, level, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const children = useMemo(() => allNodes.filter(n => n.parentObservationId === node.id), [allNodes, node.id]);

  // 아이콘 결정 로직
  const getIcon = (type) => {
    switch (type) {
      case 'SPAN':
        return <ArrowRightLeft size={16} className={styles.spanIcon} />;
      case 'GENERATION':
        return <GitBranch size={16} className={styles.generationIcon} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const hasChildren = children.length > 0;

  return (
    <li className={styles.nodeContainer}>
      <div
        className={`${styles.timelineItem} ${selectedId === node.id ? styles.selected : ''}`}
        style={{ paddingLeft: `${level * 24}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div className={styles.itemIcon}>
          {hasChildren ? (
            <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className={styles.chevron}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          ) : <div className={styles.chevronPlaceholder}></div>}
          {getIcon(node.type)}
        </div>

        <div className={styles.itemContent}>
          <div className={styles.itemHeader}>
            <span className={styles.itemName}>{node.name}</span>
            {node.latency && <span className={styles.latency}>{node.latency.toFixed(2)}s</span>}
          </div>
          {node.scores && node.scores.length > 0 && (
            <div className={styles.scoreTags}>
              {node.scores.map(score => (
                <span key={score.name} className={styles.scoreTag}>
                  {score.name}: {score.value.toFixed(2)} <MessageCircle size={12} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {isOpen && hasChildren && (
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

// 메인 컴포넌트
const TraceTimeline = ({ details, onObservationSelect }) => {
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedObservationId, setSelectedObservationId] = useState(null);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  // API 응답 데이터에 점수(scores)와 지연 시간(latency) 추가
  const processObservations = (fetchedObservations) => {
    return fetchedObservations.map(obs => ({
      ...obs,
      scores: obs.scores || [],
      latency: obs.endTime && obs.startTime ? (new Date(obs.endTime).getTime() - new Date(obs.startTime).getTime()) / 1000 : null
    }));
  };

  const rootObservations = useMemo(() =>
    observations.filter(obs => !obs.parentObservationId),
    [observations]
  );

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
        const processedData = processObservations(fetchedObservations);

        // startTime 기준으로 오름차순 정렬
        processedData.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        setObservations(processedData);

        // Trace 자체를 기본 선택으로 설정
        setSelectedObservationId(null);
        onObservationSelect(null);

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
    return (
      <ul className={styles.timelineList}>
        {/* Trace 자체를 루트 노드로 렌더링 */}
        <li className={styles.nodeContainer}>
           <div
              className={`${styles.timelineItem} ${selectedObservationId === null ? styles.selected : ''}`}
              onClick={() => handleSelect(null)}
            >
              <div className={styles.itemIcon}>
                <div className={styles.chevronPlaceholder}></div>
                <ListTree size={16} />
              </div>
              <div className={styles.itemContent}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemName}>{details?.name ?? 'Trace'}</span>
                  {details.latency && <span className={styles.latency}>{details.latency.toFixed(2)}s</span>}
                </div>
                {details.scores && details.scores.length > 0 && (
                  <div className={styles.scoreTags}>
                    {details.scores.map(score => (
                      <span key={score.name} className={styles.scoreTag}>
                        {score.name}: {score.value.toFixed(2)} <MessageCircle size={12} />
                      </span>
                    ))}
                  </div>
                )}
              </div>
          </div>
          <ul className={styles.nodeChildren}>
            {rootObservations.map((obs) => (
              <ObservationNode
                key={obs.id}
                node={obs}
                allNodes={observations}
                level={1}
                selectedId={selectedObservationId}
                onSelect={handleSelect}
              />
            ))}
          </ul>
        </li>
      </ul>
    );
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={14} />
          <input type="text" placeholder="Search..." />
        </div>
        <div className={styles.headerControls}>
          <button className={styles.controlButton}><SlidersHorizontal size={14} /></button>
          <button className={styles.controlButton}><Download size={14} /></button>
        </div>
        <div className={styles.headerToggle}>
          <input
            type="checkbox"
            id="timelineToggle"
            className={styles.toggleSwitch}
            checked={isTimelineVisible}
            onChange={() => setIsTimelineVisible(!isTimelineVisible)}
          />
          <label htmlFor="timelineToggle" className={styles.toggleLabel}></label>
          <span>Timeline</span>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default TraceTimeline;