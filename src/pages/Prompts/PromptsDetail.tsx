import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './PromptsDetail.module.css';
import {
  Book,
  Clipboard,
  ChevronUp,
  ChevronDown,
  Search,
  Plus,
  Play,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';
import { dummyPromptDetails, type PromptDetailData, type Version } from '../../data/dummyPromptDetails'; // 수정된 데이터 import

export default function PromptsDetail() {
  const { id } = useParams<{ id: string }>(); // URL에서 id 파라미터 가져오기

  // URL id에 해당하는 프롬프트 데이터를 찾습니다.
  const promptData = useMemo((): PromptDetailData | undefined => {
    return dummyPromptDetails.find((p) => p.id === id);
  }, [id]);

  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'Versions' | 'Metrics'>('Versions');
  const [activeDetailTab, setActiveDetailTab] = useState<'Prompt' | 'Config' | 'Linked' | 'Use'>('Prompt');

  // 프롬프트 데이터가 로드되면, 최신 버전을 기본 선택으로 설정합니다.
  useEffect(() => {
    if (promptData?.versions && promptData.versions.length > 0) {
      const latestVersion = promptData.versions.find(v => v.status === 'latest') || promptData.versions[0];
      setSelectedVersionId(latestVersion.id);
    }
  }, [promptData]);

  // 선택된 버전의 상세 데이터를 찾습니다.
  const selectedVersionData = useMemo((): Version | undefined => {
    return promptData?.versions.find((v) => v.id === selectedVersionId);
  }, [selectedVersionId, promptData]);


  // 데이터가 없을 경우 처리
  if (!promptData) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.breadcrumbs}>
                    <Link to="/prompts" className={styles.promptLink}>Prompts</Link>
                    <span>/</span>
                    <span className={styles.promptName}>Not Found</span>
                </div>
            </div>
            <div className={styles.placeholder}>
                ⚠️ Prompt with ID "{id}" not found.
            </div>
        </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 1. 상단 헤더 & 탭 */}
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Book size={16} />
          <span>Prompt</span>
          <span>/</span>
          <span className={styles.promptName}>{promptData.name}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}><Clipboard size={14} /> Duplicate</button>
          <div className={styles.navButtons}>
            <button className={styles.navButton}><ChevronUp size={16} /></button>
            <button className={styles.navButton}><ChevronDown size={16} /></button>
          </div>
        </div>
      </div>
      <div className={styles.tabs}>
        <button className={`${styles.tabButton} ${activeTab === 'Versions' ? styles.active : ''}`} onClick={() => setActiveTab('Versions')}>Versions</button>
        <button className={`${styles.tabButton} ${activeTab === 'Metrics' ? styles.active : ''}`} onClick={() => setActiveTab('Metrics')}>Metrics</button>
      </div>

      {/* 2. 메인 콘텐츠 그리드 */}
      <div className={styles.mainGrid}>
        {/* 2a. 좌측 버전 목록 패널 */}
        <div className={styles.leftPanel}>
          <div className={styles.versionToolbar}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="Search versions" />
            </div>
            <button className={styles.newButton}><Plus size={16} /> New</button>
          </div>
          <ul className={styles.versionList}>
            {promptData.versions.map((v) => (
              <li key={v.id} className={`${styles.versionItem} ${selectedVersionId === v.id ? styles.selected : ''}`} onClick={() => setSelectedVersionId(v.id)}>
                <div className={styles.versionTitle}>
                  <span>#{v.id}</span>
                  <span className={styles.versionLabel}>{v.label}</span>
                  {v.status === 'latest' && <span className={styles.statusTagLatest}>latest</span>}
                  {v.status === 'production' && (<span className={styles.statusTagProd}><CheckCircle2 size={12} /> production</span>)}
                </div>
                <div className={styles.versionMeta}>
                  <p>{v.details}</p>
                  <span>by {v.author}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 2b. 우측 프롬프트 상세 패널 */}
        <div className={styles.rightPanel}>
          <div className={styles.detailTabs}>
            <div>
              <button className={`${styles.detailTabButton} ${activeDetailTab === 'Prompt' ? styles.active : ''}`} onClick={() => setActiveDetailTab('Prompt')}>Prompt</button>
              <button className={`${styles.detailTabButton} ${activeDetailTab === 'Config' ? styles.active : ''}`} onClick={() => setActiveDetailTab('Config')}>Config</button>
              <button className={`${styles.detailTabButton} ${activeDetailTab === 'Linked' ? styles.active : ''}`} onClick={() => setActiveDetailTab('Linked')}>Linked Generations</button>
              <button className={`${styles.detailTabButton} ${activeDetailTab === 'Use' ? styles.active : ''}`} onClick={() => setActiveDetailTab('Use')}>Use Prompt</button>
            </div>
            <div className={styles.detailActions}>
              <button className={styles.playgroundButton}><Play size={14} /> Playground</button>
              <button className={styles.iconButton}><MoreVertical size={18} /></button>
            </div>
          </div>

          <div className={styles.promptArea}>
            {!selectedVersionData ? (
              <div className={styles.placeholder}>Select a version to view its details.</div>
            ) : (
              <>
                {activeDetailTab === 'Prompt' && (
                  <>
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>System</div>
                      <div className={styles.promptBody}><pre>{selectedVersionData.prompt.system}</pre></div>
                    </div>
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>User</div>
                      <div className={styles.promptBody}>
                        <pre>{selectedVersionData.prompt.user}</pre>
                        {selectedVersionData.prompt.variables?.map(v => (<div key={v} className={styles.variableTag}>{v}</div>))}
                      </div>
                    </div>
                  </>
                )}

                {activeDetailTab === 'Config' && (
                  <div className={styles.promptCard}>
                    <div className={styles.promptHeader}>Config</div>
                    <div className={styles.promptBody}><pre>{JSON.stringify(selectedVersionData.config, null, 2)}</pre></div>
                  </div>
                )}

                {activeDetailTab === 'Linked' && (
                  <div className={styles.placeholder}>Content for "{activeDetailTab}" goes here. // Tracing lists needed</div>
                )}

                {activeDetailTab === 'Use' && (
                  <>
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>Python</div>
                      <div className={styles.promptBody}><pre>{selectedVersionData.useprompts.python}</pre></div>
                    </div>
                    <div className={styles.promptCard}>
                      <div className={styles.promptHeader}>Js/Ts</div>
                      <div className={styles.promptBody}><pre>{selectedVersionData.useprompts.jsTs}</pre></div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}