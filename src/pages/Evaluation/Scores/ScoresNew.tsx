import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ScoresNew.module.css";
import { dummyEvaluations, type Evaluation } from "../../../data/dummyEvaluations";

// 기존 더미 + 로컬 오버라이드 병합해서 저장하는 헬퍼
function loadAll(): Evaluation[] {
  const overrides = JSON.parse(localStorage.getItem("scores_overrides") || "[]") as Evaluation[];
  const map = new Map<string, Evaluation>();
  [...dummyEvaluations, ...overrides].forEach((e) => map.set(e.id, e));
  return Array.from(map.values());
}
function saveOverrides(nextList: Evaluation[]) {
  // dummy에 없는 것 + dummy와 동일 id여도 수정본을 오버라이드로 기록
  localStorage.setItem("scores_overrides", JSON.stringify(nextList));
}

export default function ScoresNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    model: "",
    score: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.model.trim() || form.score === "") {
      setError("Name / Model / Score는 필수입니다.");
      return;
    }
    const n = Number(form.score);
    if (Number.isNaN(n) || n < 0 || n > 100) {
      setError("Score는 0~100 사이 숫자여야 합니다.");
      return;
    }

    const now = new Date();
    const newItem: Evaluation = {
      id: `eval-${now.getTime()}`,            // 자동 ID
      name: form.name.trim(),
      model: form.model.trim(),
      score: Math.round(n),
      updated: now.toISOString().slice(0, 10),
      description: form.description.trim(),
    };

    const all = loadAll();
    const next = [newItem, ...all];
    saveOverrides(next);

    navigate("/scores");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>➕ 새 평가 추가</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <label className={styles.label}>
          이름 *
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Evaluation name"
            required
          />
        </label>

        <label className={styles.label}>
          모델 *
          <input
            className={styles.input}
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="e.g., GPT-4"
            required
          />
        </label>

        <label className={styles.label}>
          점수 (0–100) *
          <input
            className={styles.input}
            name="score"
            type="number"
            min={0}
            max={100}
            value={form.score}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.label}>
          설명
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Memo, notes, etc."
          />
        </label>

        <button type="submit" className={styles.submitButton}>
          제출하기
        </button>
      </form>
    </div>
  );
}
