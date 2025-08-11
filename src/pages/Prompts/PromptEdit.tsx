import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dummyPrompts } from '../../data/dummyPrompts';
import styles from './PromptEdit.module.css';

export default function PromptEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const prompt = dummyPrompts.find((p) => p.id === id);
    if (prompt) {
      setName(prompt.name);
      setDescription(prompt.description);
    } else {
      alert('프롬프트를 찾을 수 없습니다.');
      navigate('/prompts');
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 수정된 프롬프트:', { id, name, description });
    navigate('/prompts');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>✏️ Edit Prompt</h1>
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
