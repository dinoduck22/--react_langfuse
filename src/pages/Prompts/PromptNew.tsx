import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PromptEdit.module.css'; // 기존 스타일 재사용

export default function PromptNew() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrompt = {
      id: `prompt-${Date.now()}`, // 임의 ID
      name,
      description,
      updated: new Date().toISOString().split('T')[0],
    };
    console.log('➕ 새 프롬프트:', newPrompt);
    navigate('/prompts');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>➕ 새 프롬프트 추가</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Prompt Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </label>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
