import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import styles from './Prompts.module.css';
import {
  Info,
  Plus,
  Search,
  ChevronDown,
  Folder,
  FileText,
  Copy,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

// 데이터 타입 정의
type Prompt = {
  id: string;
  isFolder: boolean;
  name: string;
  versions: number;
  type: 'chat' | 'text' | 'rhar';
  latestVersionCreatedAt: string;
  observations: number;
  tags: string[];
};

// 이미지와 유사한 더미 데이터
const dummyPromptsData: Prompt[] = [
  {
    id: 'folder-1', // 폴더는 고유 ID를 가짐
    isFolder: true,
    name: 'snippets',
    versions: 0,
    type: 'chat',
    latestVersionCreatedAt: '',
    observations: 0,
    tags: [],
  },
  {
    id: 'qa-answer-with-context-chat', // ID를 실제 이름으로 사용
    name: 'qa-answer-with-context-chat',
    isFolder: false,
    versions: 79,
    type: 'chat',
    latestVersionCreatedAt: '2025-08-07 19:27:29',
    observations: 10643,
    tags: ['core'],
  },
  {
    id: 'docx-qa',
    name: 'docx-qa',
    isFolder: false,
    versions: 1,
    type: 'rhar',
    latestVersionCreatedAt: '2025-07-28 17:08:11',
    observations: 0,
    tags: [],
  },
  {
    id: 'qa-answer-no-context-chat',
    name: 'qa-answer-no-context-chat',
    isFolder: false,
    versions: 1,
    type: 'rhar',
    latestVersionCreatedAt: '2025-07-11 20:25:50',
    observations: 14439,
    tags: [],
  },
  {
    id: 'qa-answer-with-context',
    name: 'qa-answer-with-context',
    isFolder: false,
    versions: 7,
    type: 'text',
    latestVersionCreatedAt: '2025-01-14 21:25:00',
    observations: 321,
    tags: [],
  },
  {
    id: 'agent',
    name: 'agent',
    isFolder: false,
    versions: 4,
    type: 'chat',
    latestVersionCreatedAt: '2025-04-08 21:54:53',
    observations: 0,
    tags: [],
  },
];

const Prompts: React.FC = () => {
  const [prompts] = useState<Prompt[]>(dummyPromptsData);

  const formatObservations = (num: number) => {
    if (num === 0) return null;
    if (num > 999) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };

  return (
    <div className={styles.container}>
      {/* 1. 페이지 헤더 */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Prompts</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton}>Automations 1</button>
          <button className={styles.primaryButton}>
            <Plus size={16} /> New prompt
          </button>
        </div>
      </div>

      {/* 2. 툴바 (검색, 필터) */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search..." />
        </div>
        <button className={styles.filterButton}>Filters</button>
      </div>

      {/* 3. 프롬프트 테이블 */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Versions</th>
              <th>Type</th>
              <th>
                Latest Version Created At <ChevronDown size={14} />
              </th>
              <th>Number of Observations</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt.id}>
                <td>
                  <div className={styles.nameCell}>
                    {prompt.isFolder ? <Folder size={18} /> : <FileText size={18} />}
                    {/* 폴더가 아닐 경우에만 Link 적용 */}
                    {prompt.isFolder ? (
                      <span>{prompt.name}</span>
                    ) : (
                      <Link to={`/prompts/${prompt.id}`} className={styles.promptLink}>
                        {prompt.name}
                      </Link>
                    )}
                  </div>
                </td>
                <td>{prompt.versions > 0 ? prompt.versions : ''}</td>
                <td>{prompt.isFolder ? 'folder' : prompt.type}</td>
                <td>{prompt.latestVersionCreatedAt}</td>
                <td>
                  {prompt.observations > 0 && (
                    <div className={styles.observationCell}>
                      {formatObservations(prompt.observations)}
                    </div>
                  )}
                </td>
                <td>
                  <div className={styles.tagsCell}>
                    {prompt.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.actionCell}>
                    <button className={styles.iconButton}>
                      <Copy size={16} />
                    </button>
                    <button className={styles.iconButton}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. 페이지네이션 */}
      <div className={styles.pagination}>
        <div className={styles.rowsPerPage}>
          <span>Rows per page</span>
          <select>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className={styles.pageInfo}>Page 1 of 1</div>
        <div className={styles.pageControls}>
          <button className={styles.iconButton} disabled><ChevronsLeft size={18} /></button>
          <button className={styles.iconButton} disabled><ChevronLeft size={18} /></button>
          <button className={styles.iconButton} disabled><ChevronRight size={18} /></button>
          <button className={styles.iconButton} disabled><ChevronsRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default Prompts;