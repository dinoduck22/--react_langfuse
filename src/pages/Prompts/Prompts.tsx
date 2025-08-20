import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Prompts.module.css';
import {
  Info,
  Plus,
  ChevronDown,
  FileText,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Tag, // ✅ Tag 아이콘 import 추가
} from 'lucide-react';
import { AxiosError } from 'axios';
// 새로 만든 API 파일에서 fetchPrompts 함수와 DisplayPrompt 타입을 가져옵니다.
import { fetchPrompts } from './promptsApi';
import {type DisplayPrompt } from './promptTypes'
import SearchInput from '../../components/SearchInput/SearchInput'; // ✅ SearchInput 컴포넌트 import
import { useSearch } from '../../hooks/useSearch'; // ✅ useSearch 훅 import


const Prompts: React.FC = () => {
  const [prompts, setPrompts] = useState<DisplayPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [promptToDelete, setPromptToDelete] = useState<DisplayPrompt | null>(null);
  
  // ✅ useSearch 훅을 사용하여 검색 로직 적용
  const { searchQuery, setSearchQuery, filteredData: filteredPrompts } = useSearch(prompts);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const formattedPrompts = await fetchPrompts();
        setPrompts(formattedPrompts);
      } catch (err) {
        console.error("Failed to fetch prompts:", err);
        if (err instanceof AxiosError) {
          if (!err.response) {
            setError(
              "Network Error: Failed to fetch. This might be a CORS issue. " +
              "Please check if your Langfuse project's 'Allowed Origins' includes your development URL (e.g., http://localhost:5173)."
            );
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError(
              "Authentication Failed: The provided API Keys or Base URL are incorrect. " +
              "Please verify your .env file."
            );
          } else {
            setError(`An API error occurred: ${err.response.status} ${err.response.statusText}`);
          }
        } else {
          setError("An unexpected error occurred. Please check the console.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPrompts();
  }, []);

  const navigateToNewPrompts = () => {
    navigate("/prompts/new");
  };

  const formatObservations = (num: number) => {
    if (num > 999) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };

  const handleDeleteClick = (prompt: DisplayPrompt) => {
    setPromptToDelete(prev => (prev?.id === prompt.id ? null : prompt));
  };

  const confirmDelete = () => {
    if (!promptToDelete) return;
    setPrompts(currentPrompts => currentPrompts.filter(p => p.id !== promptToDelete.id));
    console.log(`프롬프트 "${promptToDelete.name}"가 삭제되었습니다.`);
    setPromptToDelete(null);
  };

  return (
    <div className={styles.container}>
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

      <div className={styles.toolbar}>
        {/* ✅ 기존 div를 SearchInput 컴포넌트로 교체 */}
        <SearchInput
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className={styles.filterButton}>Filters</button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Versions</th>
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
                    {/* ✅ 이 부분을 수정하여 태그가 없을 때 아이콘 버튼을 표시합니다. */}
                    <td>
                      <div className={styles.tagsCell}>
                        {prompt.tags && prompt.tags.length > 0 ? (
                          prompt.tags.map(tag => (
                            <span key={tag} className={styles.tagPill}>
                              {tag}
                            </span>
                          ))
                        ) : (
                          <button className={styles.iconButton} onClick={() => alert('Add tags!')}>
                            <Tag size={16} />
                          </button>
                        )}
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