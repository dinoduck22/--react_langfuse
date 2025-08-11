import { useMemo } from "react";
import { useParams, NavLink } from "react-router-dom";
import { dummyEvaluations, type Evaluation } from "../../../data/dummyEvaluations";
import styles from "./ScoresDetail.module.css";

export default function EvaluationDetail() {
  // useParams 제네릭으로 id 타입 명시
  const { id } = useParams<{ id: string }>();

  // id 변할 때만 재계산
  const evalItem = useMemo<Evaluation | undefined>(
    () => dummyEvaluations.find((e) => e.id === id),
    [id]
  );

  if (!evalItem) {
    return (
      <div className={styles.container}>
        <div style={{ marginBottom: 12 }}>
          <NavLink to="/evaluation" className={styles.backLink}>
            ← Back to list
          </NavLink>
        </div>
        <div className={styles.empty}>⚠️ 평가를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavLink to="/evaluation" className={styles.backLink}>
        ← Back to list
      </NavLink>

      <h1 className={styles.title}>📄 {evalItem.name}</h1>

      <div className={styles.panel}>
        <div className={styles.row}>
          <span className={styles.label}>모델</span>
          <span className={styles.value}>{evalItem.model}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>점수</span>
          <span className={styles.value}>{evalItem.score}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>업데이트</span>
          <span className={styles.value}>{evalItem.updated}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>설명</span>
          <span className={styles.value}>{evalItem.description}</span>
        </div>
      </div>
    </div>
  );
}
