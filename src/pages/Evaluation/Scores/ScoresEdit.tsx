import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ScoresEdit.module.css";
import { dummyEvaluations, type Evaluation } from "../../../data/dummyEvaluations";

function loadAll(): Evaluation[] {
  const overrides = JSON.parse(localStorage.getItem("scores_overrides") || "[]") as Evaluation[];
  const map = new Map<string, Evaluation>();
  [...dummyEvaluations, ...overrides].forEach((e) => map.set(e.id, e));
  return Array.from(map.values());
}
function upsert(updated: Evaluation) {
  const all = loadAll();
  const merged = [updated, ...all.filter((e) => e.id !== updated.id)];
  localStorage.setItem("scores_overrides", JSON.stringify(merged));
}

export default function ScoresEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const current = useMemo(() => loadAll().find((e) => e.id === id), [id]);

  const [form, setForm] = useState({
    name: current?.name ?? "",
    model: current?.model ?? "",
    score: current?.score?.toString() ?? "",
    description: current?.description ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (current) {
      setForm({
        name: current.name,
        model: current.model,
        score: current.score.toString(),
        description: current.description,
      });
    }
  }, [current?.id]); // id 바뀌면 폼 리셋

  if (!current) {
    return <div className={styles.container}>⚠️ 평가 정보를 찾을 수 없습니다.</div>;
  }

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

    const updated: Evaluation = {
      ...current,
      name: form.name.trim(),
      model: form.model.trim(),
      score: Math.round(n),
      description: form.description.trim(),
      updated: new Date().toISOString().slice(0, 10),
    };

    upsert(updated);
    navigate("/scores");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>✏️ 평가 수정</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <label className={styles.label}>
          ID
          <input className={styles.input} value={current.id} readOnly />
        </label>

        <label className={styles.label}>
          이름
          <input className={styles.input} name="name" value={form.name} onChange={handleChange} />
        </label>

        <label className={styles.label}>
          모델
          <input className={styles.input} name="model" value={form.model} onChange={handleChange} />
        </label>

        <label className={styles.label}>
          점수 (0–100)
          <input
            className={styles.input}
            name="score"
            type="number"
            min={0}
            max={100}
            value={form.score}
            onChange={handleChange}
          />
        </label>

        <label className={styles.label}>
          설명
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className={styles.saveButton}>저장하기</button>
      </form>
    </div>
  );
}
