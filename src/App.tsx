import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspaceLayout } from './pages/workspace/WorkspaceLayout';
import { SourcesView } from './pages/workspace/SourcesView';
import { EvidenceView } from './pages/workspace/EvidenceView';
import { AiGovernanceView } from './pages/workspace/AiGovernanceView';
import { CurationView } from './pages/workspace/CurationView';
import { LineageTreesView } from './pages/workspace/LineageTreesView';
import { AiTriageView } from './pages/workspace/AiTriageView';
import { ManuscriptDiffView } from './pages/workspace/ManuscriptDiffView';
import { AuditLineageView } from './pages/workspace/AuditLineageView';
import { CreditDashboardView } from './pages/workspace/CreditDashboardView';
import { AdminUsersView } from './pages/admin/AdminUsersView';
import { AiQuotasView } from './pages/admin/AiQuotasView';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Center (ADMIN only) */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'ROLE_ADMIN']}>
              <AdminUsersView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quotas"
          element={
            <ProtectedRoute requiredRoles={['ADMIN', 'ROLE_ADMIN']}>
              <AiQuotasView />
            </ProtectedRoute>
          }
        />

        {/* Protected Workspace Sub-Routes */}
        <Route
          path="/workspace/:projectId"
          element={
            <ProtectedRoute>
              <WorkspaceLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="sources" replace />} />
          <Route path="sources" element={<SourcesView />} />
          <Route path="evidence" element={<EvidenceView />} />
          <Route path="ai-governance" element={<AiGovernanceView />} />
          <Route path="triage" element={<AiTriageView />} />
          <Route path="diff" element={<ManuscriptDiffView />} />
          <Route path="curation" element={<CurationView />} />
          <Route path="lineage-trees" element={<LineageTreesView />} />
          <Route path="audit" element={<AuditLineageView />} />
          <Route path="credit" element={<CreditDashboardView />} />
        </Route>

        {/* Fallback to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
