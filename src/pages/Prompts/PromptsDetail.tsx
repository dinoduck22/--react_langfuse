import { useState, useMemo } from 'react';
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

// --- 데이터 타입 및 더미 데이터 확장 ---

type PromptContent = {
  system: string;
  user: string;
  variables?: string[];
};

type ConfigContent = {
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
};

type UseContent = {
    python: string;
    jsTs: string;
}

type Version = {
  id: number;
  label: string;
  status: 'latest' | 'production' | null;
  details: string;
  author: string;
  prompt: PromptContent;
  config: ConfigContent;
  useprompts: UseContent;
};

// 각 버전에 맞는 프롬프트와 설정이 포함된 더미 데이터
const dummyVersionsData: Version[] = [
  {
    id: 5,
    label: 'test',
    status: 'latest',
    details: '7/17/2025, 8:57:50 PM',
    author: 'Marc Klingen',
    prompt: {
      system: `You are a very enthusiastic Langfuse representative who loves to help people! Langfuse is an open source observability tool. This is for the 'test' version.`,
      user: `My question is: {{question}}. Please provide a detailed answer.`,
      variables: ['question'],
    },
    config: { temperature: 0.9, max_tokens: 512, top_p: 0.9, frequency_penalty: 0.1, presence_penalty: 0.1 },
    useprompts: {
        python: 'python Example',
        jsTs: 'jsTs Example'
    }
  },
  {
    id: 4,
    label: 'production',
    status: 'production',
    details: 'chore: fix typo\n3/1/2025, 7:17:20 AM',
    author: 'Marcus Mayerhofer',
    prompt: {
      system: `You are a professional Langfuse assistant. This is the 'production' version.`,
      user: `Question: {{question}}`,
      variables: ['question'],
    },
    config: { temperature: 1, max_tokens: 256, top_p: 1, frequency_penalty: 0, presence_penalty: 0 },
    useprompts: {
        python: 'python Example',
        jsTs: 'jsTs Example'
    }
},
  {
    id: 3,
    label: 'marc-testing',
    status: null,
    details: '11/22/2024, 9:10:05 AM',
    author: 'Marc Klingen',
    prompt: {
      system: `This is a test by Marc. Answer concisely.`,
      user: `{{question}}`,
      variables: ['question'],
    },
    config: { temperature: 0.7, max_tokens: 128, top_p: 1, frequency_penalty: 0, presence_penalty: 0 },
    useprompts: {
        python: 'python Example',
        jsTs: 'jsTs Example'
    }
  },
  {
    id: 2,
    label: 'customer-2',
    status: null,
    details: '4/26/2024, 5:22:53 AM',
    author: 'Marc Klingen',
    prompt: {
      system: `Hello customer! I am here to help.`,
      user: `I need help with {{question}}.`,
      variables: ['question'],
    },
    config: { temperature: 0.8, max_tokens: 1024, top_p: 1, frequency_penalty: 0.5, presence_penalty: 0.5 },
    useprompts: {
        python: 'python Example',
        jsTs: 'jsTs Example'
    }
  },
  {
    id: 1,
    label: 'staging',
    status: null,
    details: '4/9/2024, 8:27:29 AM',
    author: 'Marc Klingen',
    prompt: {
      system: `Staging environment prompt. Behave as a staging bot.`,
      user: `Test query: {{question}}`,
      variables: ['question'],
    },
    config: { temperature: 1.2, max_tokens: 256, top_p: 0.8, frequency_penalty: 0, presence_penalty: 0.2 },
    useprompts: {
        python: 'python Example',
        jsTs: 'jsTs Example'
    }
  },
];


export default function PromptsDetail() {
  const { id } = useParams();
  const [selectedVersionId, setSelectedVersionId] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'Versions' | 'Metrics'>('Versions');
  const [activeDetailTab, setActiveDetailTab] = useState<'Prompt' | 'Config' | 'Linked' | 'Use'>('Prompt');

  const promptName = id || 'qa-answer-no-context-chat';

  // 선택된 버전의 전체 데이터를 찾습니다.
  const selectedVersionData = useMemo(
    () => dummyVersionsData.find(v => v.id === selectedVersionId),
    [selectedVersionId]
  );

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
            <button className={styles.navButton}><ChevronUp size={16} /></button>
            <button className={styles.navButton}><ChevronDown size={16} /></button>
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
            <button className={styles.newButton}><Plus size={16} /> New</button>
          </div>
          <ul className={styles.versionList}>
            {dummyVersionsData.map((v) => (
              <li
                key={v.id}
                className={`${styles.versionItem} ${selectedVersionId === v.id ? styles.selected : ''}`}
                onClick={() => setSelectedVersionId(v.id)}
              >
                <div className={styles.versionTitle}>
                  <span>#{v.id}</span>
                  <span className={styles.versionLabel}>{v.label}</span>
                  {v.status === 'latest' && <span className={styles.statusTagLatest}>latest</span>}
                  {v.status === 'production' && (
                    <span className={styles.statusTagProd}><CheckCircle2 size={12} /> production</span>
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

          {/* 🔷 선택된 버전에 따라 콘텐츠 렌더링 */}
          <div className={styles.promptArea}>
            {!selectedVersionData ? (
              <div className={styles.placeholder}>Version not found.</div>
            ) : (
              <>
                {activeDetailTab === 'Prompt' && (
                    <>
                        <div className={styles.promptCard}>
                        <div className={styles.promptHeader}>System</div>
                        <div className={styles.promptBody}>
                            <pre>{selectedVersionData.prompt.system}</pre>
                        </div>
                        </div>
                        <div className={styles.promptCard}>
                        <div className={styles.promptHeader}>User</div>
                        <div className={styles.promptBody}>
                            <pre>{selectedVersionData.prompt.user}</pre>
                            {selectedVersionData.prompt.variables?.map(v => (
                            <div key={v} className={styles.variableTag}>{v}</div>
                            ))}
                        </div>
                        </div>
                    </>
                )}

                {activeDetailTab === 'Config' && (
                  <div className={styles.promptCard}>
                    <div className={styles.promptHeader}>Config</div>
                    <div className={styles.promptBody}>
                      <pre>{JSON.stringify(selectedVersionData.config, null, 2)}</pre>
                    </div>
                  </div>
                )}

                {activeDetailTab === 'Linked' && (
                  <div className={styles.placeholder}>Content for "{activeDetailTab}" goes here.
                    정양수씨가 Tracing을 아직 안만듦...
                  </div>
                )}

                {activeDetailTab === 'Use' && (
                    <>
                        <div className={styles.promptCard}>
                        <div className={styles.promptHeader}>Python</div>
                        <div className={styles.promptBody}>
                            <pre>{selectedVersionData.useprompts.python}</pre>
                        </div>
                        </div>
                        <div className={styles.promptCard}>
                        <div className={styles.promptHeader}>Js/Ts</div>
                        <div className={styles.promptBody}>
                            <pre>{selectedVersionData.useprompts.jsTs}</pre>
                        </div>
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