import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dummyPrompts } from '../../data/dummyPrompts';
import styles from './Prompts.module.css';

export default function Prompts() {
  const [prompts, setPrompts] = useState(dummyPrompts); // state로 관리

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const updated = prompts.filter((prompt) => prompt.id !== id);
    setPrompts(updated);

    console.log(`🗑️ 삭제된 프롬프트 ID: ${id}`);
  };

  return (
    <div className={styles.container}>
      {/* 🔷 제목 + 추가 버튼을 함께 담는 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>💬 Prompts</h1>
        <Link to="/prompts/new" className={styles.addButton}>
          ➕ 새 프롬프트 추가
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => (
            <tr key={prompt.id}>
              <td>{prompt.id}</td>
              <td>
                <Link className={styles.link} to={`/prompts/${prompt.id}`}>
                  {prompt.name}
                </Link>
              </td>
              <td>{prompt.updated}</td>
              <td>
                <Link className={styles.link} to={`/prompts/${prompt.id}/edit`}>
                  ✏️ 수정
                </Link>{' '}
                |{' '}
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(prompt.id)}
                >
                  🗑️ 삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
