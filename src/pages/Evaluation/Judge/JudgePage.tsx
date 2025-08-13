import styles from "./JudgePage.module.css";

type JudgeRun = {
  id: string;
  prompt: string;
  model: string;
  score: number;
  judgedAt: string; // YYYY-MM-DD
  comment: string;
};

const sample: JudgeRun[] = [
  { id: "jr-001", prompt: "Translate to French", model: "GPT-4", score: 0.92, judgedAt: "2025-08-06", comment: "Accurate translation." },
  { id: "jr-002", prompt: "Summarize article",   model: "Claude 2", score: 0.85, judgedAt: "2025-08-07", comment: "Good coverage, minor omissions." },
];

export default function JudgePage() {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>⚖️ LLM-as-a-Judge</h1>
        <button className={styles.primary}>Run Auto Evaluation</button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Judge Settings</div>
        <div className={styles.grid2}>
          <label className={styles.field}>
            <span>Scoring Prompt</span>
            <textarea placeholder="Explain your judging criteria..." />
          </label>
          <label className={styles.field}>
            <span>Target Models</span>
            <input placeholder="e.g., gpt-4, claude-3" />
          </label>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Recent Auto-Eval Results</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Prompt</th><th>Model</th><th>Score</th><th>Judged At</th><th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {sample.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td className={styles.mono}>{r.prompt}</td>
                <td><span className={styles.badge}>{r.model}</span></td>
                <td className={r.score >= 0.88 ? styles.good : r.score >= 0.78 ? styles.ok : styles.bad}>
                  {(r.score * 100).toFixed(0)}
                </td>
                <td>{r.judgedAt}</td>
                <td className={styles.dim}>{r.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
