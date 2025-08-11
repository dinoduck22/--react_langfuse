import { useState } from "react";
import styles from "./HumanAnnotationPage.module.css";

type Task = {
  id: string;
  input: string;
  modelOutput: string;
  status: "pending" | "approved" | "rejected";
};

const initial: Task[] = [
  { id: "ha-101", input: "What is RAG?", modelOutput: "RAG is ...", status: "pending" },
  { id: "ha-102", input: "Explain embeddings", modelOutput: "Embeddings are ...", status: "pending" },
];

export default function HumanAnnotationPage() {
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [selected, setSelected] = useState<Task | null>(null);

  const approve = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "approved" } : t));
  const reject = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "rejected" } : t));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧑‍⚖️ Human Annotation</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Queue</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>Input</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td className={styles.mono}>{t.input}</td>
                  <td>
                    <span className={`${styles.badge} ${t.status === "approved" ? styles.good : t.status === "rejected" ? styles.bad : ""}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.link} onClick={() => setSelected(t)}>Open</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Annotator Panel</div>
          {selected ? (
            <div className={styles.panel}>
              <div className={styles.block}>
                <div className={styles.label}>Input</div>
                <div className={styles.value}>{selected.input}</div>
              </div>
              <div className={styles.block}>
                <div className={styles.label}>Model Output</div>
                <div className={styles.value}>{selected.modelOutput}</div>
              </div>
              <div className={styles.actions}>
                <button className={styles.approve} onClick={() => approve(selected.id)}>Approve</button>
                <button className={styles.reject} onClick={() => reject(selected.id)}>Reject</button>
              </div>
            </div>
          ) : (
            <div className={styles.empty}>Select a task from the queue.</div>
          )}
        </div>
      </div>
    </div>
  );
}
