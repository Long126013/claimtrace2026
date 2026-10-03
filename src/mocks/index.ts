import type {
  AdminUser,
  AiQuotaConfig,
  AiSuggestionTriage,
  ManuscriptDiffSnapshot,
  AuditObservation,
  CreditContributor
} from '../types';

import adminUsersData from './adminUsers.json';
import aiQuotasData from './aiQuotas.json';
import aiTriageData from './aiTriage.json';
import manuscriptDiffData from './manuscriptDiff.json';
import auditObservationsData from './auditObservations.json';
import creditContributorsData from './creditContributors.json';

export const MOCK_ADMIN_USERS: AdminUser[] = adminUsersData as AdminUser[];
export const MOCK_AI_QUOTAS: AiQuotaConfig = aiQuotasData as unknown as AiQuotaConfig;
export const MOCK_AI_TRIAGE: AiSuggestionTriage[] = aiTriageData as unknown as AiSuggestionTriage[];
export const MOCK_MANUSCRIPT_DIFF: ManuscriptDiffSnapshot = manuscriptDiffData as unknown as ManuscriptDiffSnapshot;
export const MOCK_AUDIT_OBSERVATIONS: AuditObservation[] = auditObservationsData as unknown as AuditObservation[];
export const MOCK_CREDIT_CONTRIBUTORS: CreditContributor[] = creditContributorsData as unknown as CreditContributor[];
