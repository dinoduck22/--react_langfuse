import React, { useState } from 'react';
import styles from './Dashboards.module.css';
import { Info, Plus } from 'lucide-react';
import { DashboardsView } from './DashboardsView'; // 아래에서 생성할 컴포넌트
import { WidgetsView } from './WidgetsView';   // 아래에서 생성할 컴포넌트

const Dashboards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Dashboards' | 'Widgets'>('Dashboards');

  // 탭에 따라 동적으로 변하는 헤더 정보
  const { title, buttonText } = activeTab === 'Dashboards'
    ? { title: 'Dashboards', buttonText: 'New dashboard' }
    : { title: 'Widgets', buttonText: 'New widget' };

  return (
    <div className={styles.container}>
      {/* 1. 페이지 헤더 (동적) */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{title}</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        <button className={styles.primaryButton}>
          <Plus size={16} /> {buttonText}
        </button>
      </div>

      {/* 2. 탭 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'Dashboards' ? styles.active : ''}`}
          onClick={() => setActiveTab('Dashboards')}
        >
          Dashboards
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'Widgets' ? styles.active : ''}`}
          onClick={() => setActiveTab('Widgets')}
        >
          Widgets
        </button>
      </div>

      {/* 3. 탭에 따른 컨텐츠 렌더링 */}
      <div className={styles.contentArea}>
        {activeTab === 'Dashboards' ? <DashboardsView /> : <WidgetsView />}
      </div>
    </div>
  );
};

export default Dashboards;