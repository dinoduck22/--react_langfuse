import { useState } from 'react';
import { useParams } from 'react-router-dom';
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

// 타입 정의
type Version = {
  id: number;
  label: string;
  status: 'latest' | 'production' | null;
  details: string;
  author: string;
};

// 더미 데이터
const dummyVersions: Version[] = [
  {
    id: 5,
    label: 'test',
    status: 'latest',
    details: '7/17/2025, 8:57:50 PM',
    author: 'Marc Klingen',
  },
  {
    id: 4,
    label: 'production',
    status: 'production',
    details: 'chore: fix typo\n3/1/2025, 7:17:20 AM',
    author: 'Marcus Mayerhofer',
  },
  {
    id: 3,
    label: 'marc-testing',
    status: null,
    details: '11/22/2024, 9:10:05 AM',
    author: 'Marc Klingen',
  },
  {
    id: 2,
    label: 'customer-2',
    status: null,
    details: '4/26/2024, 5:22:53 AM',
    author: 'Marc Klingen',
  },
  {
    id: 1,
    label: 'staging',
    status: null,
    details: '4/9/2024, 8:27:29 AM',
    author: 'Marc Klingen',
  },
];

// 프롬프트 및 설정 템플릿
const systemPrompt = `You are a very enthusiastic Langfuse representative who loves to help people! Langfuse is an open source observability tool for developers of applications that use Large Language Models (LLMs).

Answer with "Sorry, I don't know how to help with that." if the question is not related to Langfuse or if you are unable to answer it based on the context.`;

const userPrompt = `{{question}}

The following variables are available:`;

const configContent = `{
  "temperature": 1,
  "max_tokens": 256,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}`;

export default function PromptsDetail() {
  const { id } = useParams();
  const [selectedVersion, setSelectedVersion] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'Versions' | 'Metrics'>('Versions');
  const [activeDetailTab, setActiveDetailTab] = useState<'Prompt' | 'Config' | 'Linked' | 'Use'>('Prompt');

  const promptName = id || 'qa-answer-no-context-chat';

  return (
    <div className={styles.container}>
      {/* 1. 상단 헤더 & 탭 */}
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Book size={16} />
          <span>Prompt</span>
          <span>/</span>
          <span className={styles.promptName}>{promptName}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>
            <Clipboard size={14} /> Duplicate
          </button>
          <div className={styles.navButtons}>
            <button className={styles.navButton}>
              <ChevronUp size={16} />
            </button>
            <button className={styles.navButton}>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'Versions' ? styles.active : ''}`}
          onClick={() => setActiveTab('Versions')}
        >
          Versions
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'Metrics' ? styles.active : ''}`}
          onClick={() => setActiveTab('Metrics')}
        >
          Metrics
        </button>
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
            <button className={styles.newButton}>
              <Plus size={16} /> New
            </button>
          </div>
          <ul className={styles.versionList}>
            {dummyVersions.map((v) => (
              <li
                key={v.id}
                className={`${styles.versionItem} ${selectedVersion === v.id ? styles.selected : ''}`}
                onClick={() => setSelectedVersion(v.id)}
              >
                <div className={styles.versionTitle}>
                  <span>#{v.id}</span>
                  <span className={styles.versionLabel}>{v.label}</span>
                  {v.status === 'latest' && <span className={styles.statusTagLatest}>latest</span>}
                  {v.status === 'production' && (
                    <span className={styles.statusTagProd}>
                      <CheckCircle2 size={12} /> production
                    </span>
                  )}
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
              <button
                className={`${styles.detailTabButton} ${activeDetailTab === 'Prompt' ? styles.active : ''}`}
                onClick={() => setActiveDetailTab('Prompt')}
              >
                Prompt
              </button>
              <button
                className={`${styles.detailTabButton} ${activeDetailTab === 'Config' ? styles.active : ''}`}
                onClick={() => setActiveDetailTab('Config')}
              >
                Config
              </button>
              <button
                className={`${styles.detailTabButton} ${activeDetailTab === 'Linked' ? styles.active : ''}`}
                onClick={() => setActiveDetailTab('Linked')}
              >
                Linked Generations
              </button>
              <button
                className={`${styles.detailTabButton} ${activeDetailTab === 'Use' ? styles.active : ''}`}
                onClick={() => setActiveDetailTab('Use')}
              >
                Use Prompt
              </button>
            </div>
            <div className={styles.detailActions}>
              <button className={styles.playgroundButton}>
                <Play size={14} /> Playground
              </button>
              <button className={styles.iconButton}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* 탭 콘텐츠 조건부 렌더링 */}
          <div className={styles.promptArea}>
            {activeDetailTab === 'Prompt' && (
              <>
                <div className={styles.promptCard}>
                  <div className={styles.promptHeader}>System</div>
                  <div className={styles.promptBody}>
                    <pre>{systemPrompt}</pre>
                  </div>
                </div>
                <div className={styles.promptCard}>
                  <div className={styles.promptHeader}>User</div>
                  <div className={styles.promptBody}>
                    <pre>{userPrompt}</pre>
                    <div className={styles.variableTag}>question</div>
                  </div>
                </div>
              </>
            )}

            {activeDetailTab === 'Config' && (
              <div className={styles.promptCard}>
                 <div className={styles.promptHeader}>Config</div>
                  <div className={styles.promptBody}>
                    <pre>{configContent}</pre>
                  </div>
              </div>
            )}
             {/* 다른 탭들에 대한 플레이스홀더 */}
            {activeDetailTab === 'Linked' && (
              <div className={styles.placeholder}>
                정양수가 Tracing 페이지를 아직 안만듦...
              </div>
            )}
            {activeDetailTab === 'Use' && (
                <>
                    <div className={styles.promptCard}>
                        <div className={styles.promptHeader}>Python</div>
                        <div className={styles.promptBody}>
                        <pre> example python </pre>
                        </div>
                    </div>
                    <div className={styles.promptCard}>
                        <div className={styles.promptHeader}>JS/TS</div>
                        <div className={styles.promptBody}>
                        <pre> example js/ts </pre>
                        </div>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}