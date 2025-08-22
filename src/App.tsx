// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';

import Home from './pages/Home/Home';

import Tracing from './pages/Tracing/Tracing'; 
import Sessions from './pages/Tracing/Sessions/Sessions'; 
import SessionDetail from './pages/Tracing/Sessions/SessionDetail';

import Prompts from './pages/Prompts/Prompts';
import PromptsDetail from './pages/Prompts/PromptsDetail';
import PromptsNew from './pages/Prompts/PromptsNew';

import Playground from './pages/Playground/Playground';

import JudgePage from './pages/Evaluation/Judge/JudgePage';

import Dashboards from './pages/Dashboards/Dashboards';
import DashboardNew from './pages/Dashboards/DashboardNew';
import DashboardDetail from './pages/Dashboards/DashboardDetail';
import WidgetNew from './pages/Dashboards/WidgetNew';

import SettingsPage from './pages/Settings/SettingsPage';
import General from './pages/Settings/General';
import ApiKeys from './pages/Settings/ApiKeys';
import LLMConnections from "./pages/Settings/LLMConnections";
import Models from './pages/Settings/Models';
import Members from './pages/Settings/Members';
import Scores from './pages/Settings/Scores';

// const Sessions = Placeholder('Sessions');  // 사이드바 링크용 (/sessions)

export default function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 홈 */}
        <Route index element={<Home />} />Pages/

        {/* 사이드바 링크 보완용 라우트들 */}

        {/* Tracing */}
        <Route path="trace" element={<Tracing />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="sessions/:sessionId" element={<SessionDetail />} />

        {/* Prompts */}
        <Route path="prompts" element={<Prompts />} />
        <Route path="prompts/:id" element={<PromptsDetail />} />
        <Route path="prompts/new" element={<PromptsNew />} />

        {/* Playground */}
        <Route path="playground" element={<Playground />} />

        {/* Scores */}
        
        {/* 실제 페이지로 교체 */}
        <Route path="llm-as-a-judge" element={<JudgePage />} />
       
        {/* 구 /evaluation 경로 호환 */}
        <Route path="evaluation" element={<Navigate to="/scores" replace />} />
        <Route path="evaluation/new" element={<Navigate to="/scores/new" replace />} />
        <Route path="evaluation/:id" element={<Navigate to="/scores/:id" replace />} />
        <Route path="evaluation/:id/edit" element={<Navigate to="/scores/:id/edit" replace />} />

        {/* Dashboards */}
        <Route path="dashboards" element={<Dashboards />} />
        <Route path="dashboards/new" element={<DashboardNew />} /> {/* '/dashboards/new' 라우트 추가 */}
        <Route path="dashboards/widgets/new" element={<WidgetNew />} />
        <Route path="dashboards/:dashboardId" element={<DashboardDetail />} />

        {/* Settings (상대 경로로 선언) */}
        <Route path="settings" element={<SettingsPage/>}>
          <Route index element={<General/>}/>
          <Route path="api-keys" element={<ApiKeys/>}/>
          <Route path="llm-connections" element={<LLMConnections/>}/>
          <Route path="models" element={<Models/>}/>
          <Route path="scores" element={<Scores/>}/>
          <Route path="members" element={<Members/>}/>
      </Route>
      </Route>
    </Routes>
  );
}
