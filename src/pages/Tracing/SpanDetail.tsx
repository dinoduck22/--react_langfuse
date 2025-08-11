// src/pages/Tracing/SpanDetail.tsx
import { useParams } from 'react-router-dom';
import styles from './SpanDetail.module.css';
import { dummySpans } from '../../data/dummySpans';

export default function SpanDetail() {
  const { spanId } = useParams();

  const span = dummySpans.find((s) => s.id === spanId);

  if (!span) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>⚠️ Span not found</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📌 Span Detail</h1>
      <p className={styles.text}><strong>ID:</strong> {span.id}</p>
      <p className={styles.text}><strong>Name:</strong> {span.name}</p>
      <p className={styles.text}><strong>Duration:</strong> {span.duration}</p>
      <p className={styles.text}><strong>Timestamp:</strong> {span.timestamp}</p>
      <p><strong>Description:</strong> {span.description}</p>
    </div>
  );
}
