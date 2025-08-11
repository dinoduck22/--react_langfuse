import { useParams } from 'react-router-dom';
import { dummyPrompts } from '../../data/dummyPrompts';
import styles from './PromptsDetail.module.css';

export default function PromptDetail() {
  const { id } = useParams();
  const prompt = dummyPrompts.find((p) => p.id === id);

  if (!prompt) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>❌ Prompt Not Found</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 Prompt Detail</h1>
      <p><strong>ID:</strong> {prompt.id}</p>
      <p><strong>Name:</strong> {prompt.name}</p>
      <p><strong>Last Updated:</strong> {prompt.updated}</p>
    </div>
  );
}
