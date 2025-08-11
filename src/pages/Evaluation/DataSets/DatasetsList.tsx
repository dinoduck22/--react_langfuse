import styles from "./Datasets.module.css";

type Dataset = {
  id: string;
  name: string;
  samples: number;
  updated: string;
};

const sets: Dataset[] = [
  { id: "ds-001", name: "QA Benchmark v1", samples: 500, updated: "2025-08-05" },
  { id: "ds-002", name: "Instruction-Following", samples: 320, updated: "2025-08-07" },
];

export default function DatasetsList() {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>📚 Datasets</h1>
        <button className={styles.primary}>Upload CSV</button>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Samples</th><th>Updated</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sets.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.samples}</td>
                <td>{d.updated}</td>
                <td><button className={styles.link}>Preview</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
