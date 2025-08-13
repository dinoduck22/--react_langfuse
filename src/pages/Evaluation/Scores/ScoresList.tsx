// src/pages/Evaluation/Scores/ScoresList.tsx
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./ScoresList.module.css";
import { dummyEvaluations, type Evaluation } from "../../../data/dummyEvaluations";

type SortKey = keyof Pick<Evaluation, "name" | "model" | "score" | "updated">;
type SortDir = "asc" | "desc";
type SortState = { key: SortKey; dir: SortDir };

const defaultSort: SortState = { key: "updated", dir: "desc" };
const pageSizes = [5, 10, 20];

function scoreClass(score: number) {
  if (score >= 88) return styles.scoreGood;
  if (score >= 78) return styles.scoreOk;
  return styles.scoreBad;
}

// localStorage 병합 로더/삭제
const loadAll = (): Evaluation[] => {
  const overrides = JSON.parse(localStorage.getItem("scores_overrides") || "[]") as Evaluation[];
  const map = new Map<string, Evaluation>();
  [...dummyEvaluations, ...overrides].forEach((e) => map.set(e.id, e));
  return Array.from(map.values());
};
const removeFromLocal = (id: string) => {
  const overrides = (JSON.parse(localStorage.getItem("scores_overrides") || "[]") as Evaluation[]).filter(
    (e) => e.id !== id
  );
  localStorage.setItem("scores_overrides", JSON.stringify(overrides));
};

export default function ScoresList() {
  // ✅ 더미 + 로컬 오버라이드 병합 데이터로 초기화
  const [evaluations, setEvaluations] = useState<Evaluation[]>(loadAll());

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortState>(defaultSort);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const base = kw
      ? evaluations.filter((e) =>
          [e.name, e.model, e.description].some((v) => v.toLowerCase().includes(kw))
        )
      : evaluations.slice();

    base.sort((a, b) => {
      const { key, dir } = sort;
      const va = a[key];
      const vb = b[key];
      if (typeof va === "string" && typeof vb === "string") {
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return dir === "asc" ? va - vb : vb - va;
      }
      return 0;
    });

    return base;
  }, [q, sort, evaluations]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const pageData = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, clampedPage, pageSize]);

  const onSort = (key: SortKey) => {
    setPage(1);
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("정말로 이 평가를 삭제하시겠습니까?")) return;
    // ✅ localStorage에서도 삭제
    removeFromLocal(id);
    setEvaluations((prev) => prev.filter((e) => e.id !== id));
    setTimeout(() => {
      const newTotal = filtered.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
      setPage((p) => Math.min(p, newTotalPages));
    }, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.title}>🧪 Scores</div>

        <div className={styles.controls}>
          <select
            className={styles.select}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {pageSizes.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>

        <div className={styles.search}>
          <input
            placeholder="Search name / model / description..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* ✅ /scores/new 로 변경 */}
        <NavLink to="/scores/new" className={styles.addButton}>
          ➕ 새 평가 추가
        </NavLink>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} onClick={() => onSort("name")}>Name</th>
              <th className={styles.th} onClick={() => onSort("model")}>Model</th>
              <th className={styles.th} onClick={() => onSort("score")}>Score</th>
              <th className={styles.th} onClick={() => onSort("updated")}>Updated</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((e) => (
              <tr key={e.id} className={styles.row}>
                <td className={styles.td}>
                  {/* ✅ 상세 경로 /scores/:id */}
                  <NavLink to={`/scores/${e.id}`} className={styles.link}>
                    {e.name}
                  </NavLink>
                </td>
                <td className={styles.td}>
                  <span className={styles.badge}>{e.model}</span>
                </td>
                <td className={`${styles.td} ${scoreClass(e.score)}`}>{e.score}</td>
                <td className={styles.td}>{e.updated}</td>
                <td className={styles.td}>
                  <NavLink to={`/scores/${e.id}`} className={styles.link}>🔍 보기</NavLink>{" "}
                  |{" "}
                  {/* ✅ 수정 경로 /scores/:id/edit */}
                  <NavLink to={`/scores/${e.id}/edit`} className={styles.link}>✏️ 수정</NavLink>{" "}
                  |{" "}
                  <button className={styles.deleteButton} onClick={() => handleDelete(e.id)}>
                    🗑️ 삭제
                  </button>
                </td>
              </tr>
            ))}

            {pageData.length === 0 && (
              <tr>
                <td className={styles.td} colSpan={5}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.footer}>
          <div>
            Showing {(clampedPage - 1) * pageSize + 1}–{Math.min(clampedPage * pageSize, total)} of {total}
          </div>
          <div className={styles.pager}>
            <button className={styles.button} onClick={() => setPage(1)} disabled={clampedPage === 1}>
              « First
            </button>
            <button className={styles.button} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage === 1}>
              ‹ Prev
            </button>
            <button className={styles.button} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages}>
              Next ›
            </button>
            <button className={styles.button} onClick={() => setPage(totalPages)} disabled={clampedPage === totalPages}>
              Last »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
