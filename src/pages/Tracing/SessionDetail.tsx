import { useParams } from 'react-router-dom';
import styles from './SessionDetail.module.css';
import { dummySessions } from '../../data/dummySessions';

export default function SessionDetail() {
  const { sessionId } = useParams();

  const session = dummySessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>⚠️ Session not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>👥 Session Detail</h1>
      <p className={styles.text}><strong>ID:</strong> {session.id}</p>
      <p className={styles.text}><strong>User:</strong> {session.user}</p>
      <p className={styles.text}><strong>Status:</strong> {session.status}</p>
      <p className={styles.text}><strong>Started At:</strong> {session.startedAt}</p>
    </div>
  );
}
