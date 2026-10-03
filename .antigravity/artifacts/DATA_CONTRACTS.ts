/**
 * DATA_CONTRACTS.ts - Unified Data Models & Contracts for ClaimTrace Frontend
 * Author: requirements_analyst
 * Target: UI-01 to UI-10 from REQUIREMENTS.md
 */

export type UserRole = 'ADMIN' | 'RESEARCHER' | 'PI' | 'REVIEWER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  institution: string;
  orcid?: string;
  avatarUrl?: string;
}

export interface AiModelApproval {
  modelId: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google Vertex AI' | 'Local Ollama' | 'Custom';
  approvedStatus: 'APPROVED' | 'SUSPENDED' | 'PENDING_REVIEW';
  maxContextTokens: number;
  costPer1kTokensUsd: number;
  description: string;
}

export interface AiQuotaConfig {
  projectId: string;
  projectName: string;
  monthlyTokenLimit: number;
  usedTokens: number;
  monthlyBudgetLimitUsd: number;
  usedBudgetUsd: number;
  requestCount: number;
  providerEndpoints: {
    primary: string;
    backup?: string;
  };
  approvedModels: AiModelApproval[];
}

export interface AiSuggestionTriage {
  id: string;
  prompt: string;
  model: string;
  temperature: number;
  originalContent: string;
  suggestedContent: string;
  diffSummary: string;
  decision: 'PENDING' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED';
  modifiedContent?: string;
  rejectionReason?: string;
  syncStatus: 'OFFLINE_BUFFERED' | 'RECONCILED_SYNC';
  timestamp: string;
  targetArtifact: string;
}

export interface UnmatchedAnchor {
  claimId: string;
  claimCode: string;
  exactQuote: string;
  section: string;
  oldOffset: number;
  suggestedNewOffset: number;
  status: 'UNMATCHED' | 'REALIGNED';
  confidence: number;
}

export interface ManuscriptDiffSnapshot {
  baseVersion: string;
  targetVersion: string;
  diffContent: string;
  unmatchedAnchors: UnmatchedAnchor[];
  additionsCount: number;
  deletionsCount: number;
}

export type BitemporalTimelineMode = 'MANUSCRIPT_SNAPSHOT' | 'CURRENT_SYSTEM_STATE';

export type ClaimHealth = 'SUPPORTED' | 'STALE' | 'BROKEN';

export interface ClaimHealthItem {
  id: string;
  claimCode: string;
  text: string;
  section: string;
  metric?: string;
  status: ClaimHealth;
  stalenessReason?: string;
  lastVerifiedDate: string;
  confidenceScore: number;
}

export interface AuditObservation {
  id: string;
  claimId: string;
  auditorName: string;
  orcid: string;
  timestamp: string;
  severity: 'COMPLIANT' | 'MINOR_CONCERN' | 'MAJOR_DISCREPANCY';
  notes: string;
}

export type CreditRole =
  | 'Conceptualization'
  | 'Data Curation'
  | 'Formal Analysis'
  | 'Funding Acquisition'
  | 'Investigation'
  | 'Methodology'
  | 'Project Administration'
  | 'Resources'
  | 'Software'
  | 'Supervision'
  | 'Validation'
  | 'Visualization'
  | 'Writing – Original Draft'
  | 'Writing – Review & Editing';

export interface CreditContributor {
  id: string;
  name: string;
  email: string;
  orcid?: string;
  isAi: boolean;
  institution: string;
  roles: CreditRole[];
  aiDisclosureDetail?: string;
}

export interface RoCrateExportProgress {
  step: 'IDLE' | 'HASHING_ENTITIES' | 'BUILDING_JSONLD' | 'PACKAGING_ZIP' | 'READY';
  percentage: number;
  message: string;
  downloadUrl?: string;
}
