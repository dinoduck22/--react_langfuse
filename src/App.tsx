// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';

import Home from './pages/Home/Home';

import Tracing from './pages/Tracing/Tracing';
import TraceDetail from './pages/Tracing/TraceDetail';
import SpanDetail from './pages/Tracing/SpanDetail';
import SessionDetail from './pages/Tracing/SessionDetail';

import Prompts from './pages/Prompts/Prompts';
import PromptsDetail from './pages/Prompts/PromptsDetail';

import Playground from './pages/Playground/Playground';

import ScoresList from './pages/Evaluation/Scores/ScoresList';
import ScoresDetail from './pages/Evaluation/Scores/ScoresDetail';
import ScoresNew from './pages/Evaluation/Scores/ScoresNew';
import ScoresEdit from './pages/Evaluation/Scores/ScoresEdit';

import JudgePage from './pages/Evaluation/Judge/JudgePage';
import HumanAnnotationPage from './pages/Evaluation/HumanAnnotation/HumanAnnotationPage';
import DatasetsList from './pages/Evaluation/DataSets/DatasetsList';

import LLMDashboard from './pages/Dashboard/LLMDashboard';

import SettingsPage from './pages/Settings/SettingsPage';
import General from './pages/Settings/General';
import ApiKeys from './pages/Settings/ApiKeys';
import LLMConnections from "./pages/Settings/LLMConnections";
import Models from './pages/Settings/Models';
import Members from './pages/Settings/Members';

// ---- 임시 플래이스홀더들 (파일이 아직 없거나 빈 페이지일 때 대비) ----
const Placeholder =
  (title: string) =>
  () =>
    <div style={{ color: 'white', padding: 24 }}>{title}</div>;

//const LLMConnections = Placeholder('LLM Connections');
const ScoresSettings = Placeholder('Scores (Settings)');
const Integrations = Placeholder('Integrations');
const Exports = Placeholder('Exports');
const AuditLogs = Placeholder('Audit Logs');

const Sessions = Placeholder('Sessions');  // 사이드바 링크용 (/sessions)
const Users = Placeholder('Users');        // 사이드바 링크용 (/users)
// const Playground = Placeholder('Playground');  // 사이드바 링크용 (/playground)
// const Datasets = Placeholder('Datasets');      // 사이드바 링크용 (/datasets)
// const LlmAsAJudge = Placeholder('LLM as a Judge'); // 사이드바 링크용 (/llm-as-a-judge)
// const HumanAnnotation = Placeholder('Human Annotation'); // (/human-annotation)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 홈 */}
        <Route index element={<Home />} />Pages/

        {/* 사이드바 링크 보완용 라우트들 */}
        <Route path="sessions" element={<Sessions />} />
        <Route path="users" element={<Users />} />

        {/* Tracing */}
        <Route path="tracing" element={<Tracing />} />
        <Route path="tracing/:id" element={<TraceDetail />} />
        <Route path="tracing/:traceId/spans/:spanId" element={<SpanDetail />} />
        <Route path="tracing/:traceId/sessions/:sessionId" element={<SessionDetail />} />

        {/* Prompts */}
        <Route path="prompts" element={<Prompts />} />
        <Route path="prompts/:id" element={<PromptsDetail />} />

        {/* Tracing */}

        {/* Playground */}
        <Route path="playground" element={<Playground />} />

        {/* Scores */}
        <Route path="scores" element={<ScoresList />} />
        <Route path="scores/new" element={<ScoresNew />} />
        <Route path="scores/:id" element={<ScoresDetail />} />
        <Route path="scores/:id/edit" element={<ScoresEdit />} />

        {/* ✅ 실제 페이지로 교체 */}
        <Route path="llm-as-a-judge" element={<JudgePage />} />
        <Route path="human-annotation" element={<HumanAnnotationPage />} />
        <Route path="datasets" element={<DatasetsList />} />

        {/* 구 /evaluation 경로 호환 */}
        <Route path="evaluation" element={<Navigate to="/scores" replace />} />
        <Route path="evaluation/new" element={<Navigate to="/scores/new" replace />} />
        <Route path="evaluation/:id" element={<Navigate to="/scores/:id" replace />} />
        <Route path="evaluation/:id/edit" element={<Navigate to="/scores/:id/edit" replace />} />

        {/* Dashboards */}
        <Route path="dashboards/llm" element={<LLMDashboard />} />

        {/* Settings (상대 경로로 선언) */}
        <Route path="settings" element={<SettingsPage />}>
          <Route index element={<General />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="llm-connections" element={<LLMConnections />} />
          <Route path="models" element={<Models />} />
          <Route path="scores" element={<ScoresSettings />} />
          <Route path="members" element={<Members />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="exports" element={<Exports />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>
    </Routes>
  );
}
