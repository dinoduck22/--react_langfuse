import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Prompts.module.css';
import {
  Info,
  Plus,
  Search,
  ChevronDown,
  Bookmark,
  FileText,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import { langfuse } from 'lib/langfuse';
import { AxiosError } from 'axios'

interface PromptMeta {
  name: string;
  tags: string[];
  updatedAt?: string;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [promptToDelete, setPromptToDelete] = useState<DisplayPrompt | null>(null);
  

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await langfuse.api.promptsList({});
        const formattedPrompts = response.data.map((prompt: PromptMeta): DisplayPrompt => {
          const latestVersionCreatedAt = prompt.updatedAt
            ? new Date(prompt.updatedAt).toLocaleString()
            : '-';

          return {
            id: prompt.name,
            name: prompt.name,
            versions: 1,
            type: 'text',
            latestVersionCreatedAt: latestVersionCreatedAt,
            observations: 0,
            tags: prompt.tags || [],
          };
        });
        setPrompts(formattedPrompts);
      } catch (err) {
        console.error("Failed to fetch prompts:", err);
        // --- 오류 분석 로직 추가 ---
        if (err instanceof AxiosError) {
          if (!err.response) {
            // 응답 자체가 없는 네트워크 오류 -> CORS 문제일 확률이 매우 높음
            setError(
              "Network Error: Failed to fetch. This might be a CORS issue. " +
              "Please check if your Langfuse project's 'Allowed Origins' includes your development URL (e.g., http://localhost:5173)."
            );
          } else if (err.response.status === 401 || err.response.status === 403) {
            // 401/403: 인증/권한 오류
            setError(
              "Authentication Failed: The provided API Keys or Base URL are incorrect. " +
              "Please verify your .env file."
            );
          } else {
            // 그 외 서버 응답 오류
            setError(`An API error occurred: ${err.response.status} ${err.response.statusText}`);
          }
        } else {
          // Axios 오류가 아닌 경우
          setError("An unexpected error occurred. Please check the console.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    if (!searchQuery) {
      return prompts;
    }
    return prompts.filter(prompt =>
      prompt.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [prompts, searchQuery]);

  const navigateToNewPrompts = () => {
    navigate("/prompts/new");
  };

  const formatObservations = (num: number) => {
    if (num > 999) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };

  // 삭제 아이콘 클릭 핸들러
  const handleDeleteClick = (prompt: DisplayPrompt) => {
    // 이미 열려있는 팝업을 다시 클릭하면 닫고, 아니면 새로 엶
    setPromptToDelete(prev => (prev?.id === prompt.id ? null : prompt));
  };

  // 실제 삭제를 처리하는 함수
  const confirmDelete = () => {
    if (!promptToDelete) return;

    // 실제 API 호출 대신 상태에서만 제거
    setPrompts(currentPrompts => currentPrompts.filter(p => p.id !== promptToDelete.id));
    
    console.log(`프롬프트 "${promptToDelete.name}"가 삭제되었습니다.`);
    
    // 확인 팝업 닫기
    setPromptToDelete(null);
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
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              <th>Latest Version Created At <ChevronDown size={14} /></th>
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
              filteredPrompts.map((prompt) => (
                <React.Fragment key={prompt.id}>
                  <tr>
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
                    <td><div className={styles.observationCell}>{formatObservations(prompt.observations)}</div></td>
                    <td>
                      <div className={styles.tagsCell}>
                        <button className={styles.iconButton}><Bookmark size={16} /></button>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button className={styles.iconButton} onClick={() => handleDeleteClick(prompt)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* 삭제 확인 팝업을 위한 행 */}
                  {promptToDelete && promptToDelete.id === prompt.id && (
                    <tr className={styles.confirmationRow}>
                      <td colSpan={7}>
                        <div className={styles.confirmationContainer}>
                          <div className={styles.confirmationContent}>
                            <h4 className={styles.confirmationTitle}>Please confirm</h4>
                            <p className={styles.confirmationText}>
                              This action permanently deletes this prompt. All requests to fetch prompt
                              <strong> {prompt.name} </strong> will error.
                            </p>
                          </div>
                          <button className={styles.deleteConfirmButton} onClick={confirmDelete}>
                            Delete Prompt
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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