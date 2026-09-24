import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspaceLayout } from './pages/workspace/WorkspaceLayout';
import { SourcesView } from './pages/workspace/SourcesView';
import { EvidenceView } from './pages/workspace/EvidenceView';
import { AiGovernanceView } from './pages/workspace/AiGovernanceView';
import { CurationView } from './pages/workspace/CurationView';
import { LineageTreesView } from './pages/workspace/LineageTreesView';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Workspace Sub-Routes */}
      <Route path="/workspace/:projectId" element={<WorkspaceLayout />}>
        <Route index element={<Navigate to="sources" replace />} />
        <Route path="sources" element={<SourcesView />} />
        <Route path="evidence" element={<EvidenceView />} />
        <Route path="ai-governance" element={<AiGovernanceView />} />
        <Route path="curation" element={<CurationView />} />
        <Route path="lineage-trees" element={<LineageTreesView />} />
      </Route>

      {/* Fallback to Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
