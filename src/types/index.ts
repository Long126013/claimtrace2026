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
