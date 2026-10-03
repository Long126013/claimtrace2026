export type ClaimStatus = 'SUPPORTED' | 'STALE' | 'BROKEN';

export interface W3CSelector {
  exactQuote: string;
  prefix: string;
  suffix: string;
}

export interface ClaimEvidenceAssembly {
  claimId: string;
  figureArtifactId?: string;
  executionRunId?: string;
  codeScriptId?: string;
  aiPromptRecordId?: string;
  datasetArtifactIds: string[];
  notes?: string;
  updatedAt?: string;
}

export interface Claim {
  id: string;
  claimCode: string;
  selector: W3CSelector;
  status: ClaimStatus;
  manuscriptVersionId: string;
  evidenceRootNodeId: string;
  stalenessReason?: string;
  title?: string;
  boundAt?: string;
  confidenceScore?: number;
  section?: string;
  metric?: string;
  evidenceHash?: string;
  assembly?: ClaimEvidenceAssembly;
}

export interface ManuscriptVersion {
  id: string;
  versionTag: string; // e.g. "v1.0", "v2.0-revised"
  title: string;
  uploadedAt: string;
  content: string;
  contentHash: string;
  wordCount?: number;
  authors?: string;
  doi?: string;
}

export interface Artifact {
  id: string;
  type: 'DATASET' | 'CODE' | 'EXECUTION_RUN' | 'FIGURE';
  name: string;
  hash: string;
  version: string;
  upstreamId?: string;
  status: 'SYNCHRONIZED' | 'MISMATCH';
  registeredDate?: string;
  sizeOrDetail?: string;
  description?: string;
  canonicalHash?: string;
  mismatchHash?: string;
  relationship?: 'wasDerivedFrom' | 'used' | 'wasGeneratedBy' | 'wasInformedBy';
  roleTag?: string;
}

export interface LineageBranchNode {
  id: string;
  name: string;
  category: 'CLAIM' | 'FIGURE' | 'EXECUTION' | 'CODE' | 'DATASET' | 'MODEL_WEIGHTS' | 'CONFIG';
  relationship?: 'wasDerivedFrom' | 'wasGeneratedBy' | 'used' | 'wasInformedBy' | 'wasAttributedTo';
  hash?: string;
  version?: string;
  status: 'SYNCHRONIZED' | 'MISMATCH' | 'STALE' | 'HEALTHY';
  detail?: string;
  branchLabel?: string;
  isBroken?: boolean;
  brokenReason?: string;
  children?: LineageBranchNode[];
}

export interface AiInteractionRecord {
  id: string;
  model: string;
  temperature: number;
  promptHash: string;
  originalSuggestion: string;
  adoptedCode: string;
  decision: 'ACCEPTED' | 'MODIFIED' | 'REJECTED';
  rationale: string;
  auditorName: string;
  orcid: string;
  timestamp: string;
  targetArtifact?: string;
  copeVerified?: boolean;
}

export interface ProjectWorkspace {
  id: string;
  name: string;
  leadInvestigator: string;
  institution: string;
  activeManuscriptVersion: string;
  claimsCount: number;
  healthStatus: 'HEALTHY' | 'HAS_STALE_CLAIMS';
  description?: string;
  repositoryUrl?: string;
  domain?: string;
  lastUpdated?: string;
}

export interface RoCrateMetadata {
  "@context": string | Array<string | Record<string, string>>;
  "@graph": Array<Record<string, unknown>>;
}

// ==========================================
// NEW TYPES FROM REQUIREMENTS.md (UI-01 -> UI-10)
// ==========================================

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

export type AuthRole = 'ADMIN' | 'PRINCIPAL_INVESTIGATOR' | 'RESEARCHER' | 'REVIEWER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  orcid?: string;
  organization?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface AuthSuccessResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

