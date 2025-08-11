import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Tracing.module.css';
import { dummyTraces } from '../../data/dummyTraces';

export default function Tracing() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');

  const filteredTraces = dummyTraces.filter(trace =>
    trace.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧪 Tracing</h1>

      <input
        type="text"
        className={styles.filter}
        placeholder="🔍 Filter traces..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredTraces.map((trace) => (
            <tr
              key={trace.id}
              className={styles.row}
              onClick={() => navigate(`/tracing/${trace.id}`)}
            >
              <td>{trace.id}</td>
              <td>{trace.name}</td>
              <td>{trace.timestamp}</td>
            </tr>
          ))}
          {filteredTraces.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                ❌ No matching traces
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
