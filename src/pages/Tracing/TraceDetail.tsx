import { useParams } from 'react-router-dom';
import styles from './TraceDetail.module.css';
import { dummyTraces } from '../../data/dummyTraces';
import { dummySpans } from '../../data/dummySpans';
import { dummySessions } from '../../data/dummySessions';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function TraceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const trace = dummyTraces.find((t) => t.id === id);
  const spans = dummySpans.filter((s) => s.traceId === id);
  const sessions = dummySessions.filter((s) => s.traceId === id);

  if (!trace) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>🧪 Trace Detail</h1>
        <p className={styles.text}>❌ Trace not found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧪 Trace Detail</h1>
      <p className={styles.text}><strong>ID:</strong> {trace.id}</p>
      <p className={styles.text}><strong>Name:</strong> {trace.name}</p>
      <p className={styles.text}><strong>Timestamp:</strong> {trace.timestamp}</p>

      {/* 🔷 Span 목록 */}
      <h2 className={styles.subtitle}>📌 Spans</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Duration</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {spans.map((span) => (
            <tr key={span.id} className={styles.row}>
              <td>{span.id}</td>
              <td>
                <Link to={`/tracing/${trace.id}/spans/${span.id}`} className={styles.link}>
                  {span.name}
                </Link>
              </td>
              <td>{span.duration}</td>
              <td>{span.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔷 Session 목록 */}
      <h2 className={styles.subtitle}>👥 Sessions</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Started At</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr
              key={session.id}
              className={styles.row}
              onClick={() => navigate(`/tracing/${trace.id}/sessions/${session.id}`)}
            >
              <td>{session.id}</td>
              <td>{session.user}</td>
              <td>{session.status}</td>
              <td>{session.startedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
