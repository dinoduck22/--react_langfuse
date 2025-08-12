import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Prompts.module.css';
import {
  Info,
  Plus,
  Search,
  ChevronDown,
  FileText,
  Copy,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import { langfuse } from 'lib/langfuse'; // Langfuse 클라이언트 import

// 화면 표시용 데이터 타입
type DisplayPrompt = {
  id: string;
  name: string;
  versions: number;
  type: 'chat' | 'text';
  latestVersionCreatedAt: string;
  observations: number;
  tags: string[];
};

const Prompts: React.FC = () => {
  const [prompts, setPrompts] = useState<DisplayPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await langfuse.api.promptsList({});
        
        // API 응답을 DisplayPrompt 타입으로 변환
        const formattedPrompts = response.data.map((prompt): DisplayPrompt => {
          // 반환 타입을 명시하여 TypeScript 타입 오류 해결
          return {
            id: prompt.name,
            name: prompt.name,
            versions: 1,
            type: 'text', // API 응답에 type 정보가 없으므로 'text'로 고정
            latestVersionCreatedAt: '-', // API 응답에 updatedAt 정보가 없으므로 '-'로 고정
            observations: 0,
            tags: prompt.tags || [],
          };
        });

        setPrompts(formattedPrompts);
      } catch (err) {
        console.error("Failed to fetch prompts:", err);
        setError("Failed to load prompts. Please check your API keys and network connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);


  const navigateToNewPrompts = () => {
      navigate("/prompts/new");
  };

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
          <button className={styles.primaryButton} onClick={navigateToNewPrompts}>
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
              <th>Version</th>
              <th>Type</th>
              <th>
                Last updated At <ChevronDown size={14} />
              </th>
              <th>Number of Observations</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>Loading prompts...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'red' }}>{error}</td></tr>
            ) : (
              prompts.map((prompt) => (
                <tr key={prompt.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <FileText size={18} />
                      <Link to={`/prompts/${prompt.id}`} className={styles.promptLink}>
                        {prompt.name}
                      </Link>
                    </div>
                  </td>
                  <td>{prompt.versions}</td>
                  <td>{prompt.type}</td>
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
              ))
            )}
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