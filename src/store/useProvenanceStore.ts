import { create } from 'zustand';
import type { 
  ProjectWorkspace, 
  ManuscriptVersion, 
  Claim, 
  Artifact, 
  AiInteractionRecord, 
  W3CSelector,
  ClaimEvidenceAssembly 
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_MANUSCRIPTS, 
  INITIAL_CLAIMS, 
  INITIAL_ARTIFACTS, 
  INITIAL_AI_RECORDS,
  INITIAL_CLAIM_ASSEMBLIES 
} from '../services/mockData';

interface ProvenanceStore {
  // State
  projects: ProjectWorkspace[];
  activeProjectId: string;
  manuscripts: ManuscriptVersion[];
  activeManuscriptId: string;
  claims: Claim[];
  activeClaimId: string;
  artifacts: Artifact[];
  aiRecords: AiInteractionRecord[];
  isUpstreamChanged: boolean;
  claimAssemblies: Record<string, ClaimEvidenceAssembly>;

  // Modals & Temp States
  isRoCrateDialogOpen: boolean;
  isBindClaimModalOpen: boolean;
  isNewProjectModalOpen: boolean;
  isUploadDraftModalOpen: boolean;
  isRegisterArtifactModalOpen: boolean;
  isSimulateAiModalOpen: boolean;
  pendingBinding: W3CSelector | null;

  // Actions
  setActiveProjectId: (id: string) => void;
  setActiveManuscriptId: (id: string) => void;
  setActiveClaimId: (id: string) => void;
  toggleUpstreamChanged: () => void;
  reRunExecutionAndReVerify: () => void;
  
  // Entity Additions & Assembly
  bindNewClaim: (selector: W3CSelector, title?: string, evidenceRootNodeId?: string) => void;
  saveClaimAssembly: (assembly: ClaimEvidenceAssembly) => void;
  linkArtifactToClaim: (claimId: string, artifactId: string) => void;
  linkAiRecordToClaim: (claimId: string, aiRecordId: string) => void;
  addProject: (project: Omit<ProjectWorkspace, 'id' | 'claimsCount' | 'healthStatus'>) => string;
  uploadDraft: (title: string, versionTag: string, content: string, authors?: string) => void;
  registerArtifact: (artifact: Omit<Artifact, 'id' | 'status' | 'registeredDate'>) => void;
  addAiRecord: (record: Omit<AiInteractionRecord, 'id' | 'timestamp' | 'copeVerified'>) => void;

  // Modal Toggles
  setRoCrateDialogOpen: (open: boolean) => void;
  setBindClaimModalOpen: (open: boolean) => void;
  setNewProjectModalOpen: (open: boolean) => void;
  setUploadDraftModalOpen: (open: boolean) => void;
  setRegisterArtifactModalOpen: (open: boolean) => void;
  setSimulateAiModalOpen: (open: boolean) => void;
  setPendingBinding: (selector: W3CSelector | null) => void;

  // Reset
  resetAll: () => void;
}

export const useProvenanceStore = create<ProvenanceStore>((set) => ({
  projects: INITIAL_PROJECTS,
  activeProjectId: 'proj-oncogen-01',
  manuscripts: INITIAL_MANUSCRIPTS,
  activeManuscriptId: 'draft-v2',
  claims: INITIAL_CLAIMS,
  activeClaimId: 'claim-1',
  artifacts: INITIAL_ARTIFACTS,
  aiRecords: INITIAL_AI_RECORDS,
  isUpstreamChanged: false,
  claimAssemblies: INITIAL_CLAIM_ASSEMBLIES,

  isRoCrateDialogOpen: false,
  isBindClaimModalOpen: false,
  isNewProjectModalOpen: false,
  isUploadDraftModalOpen: false,
  isRegisterArtifactModalOpen: false,
  isSimulateAiModalOpen: false,
  pendingBinding: null,

  setActiveProjectId: (id: string) => set({ activeProjectId: id }),
  setActiveManuscriptId: (id: string) => set({ activeManuscriptId: id }),
  setActiveClaimId: (id: string) => set({ activeClaimId: id }),

  toggleUpstreamChanged: () =>
    set((state) => {
      const nextChanged = !state.isUpstreamChanged;

      // Update artifacts (cohort_clinical_raw.csv hash and status)
      const updatedArtifacts = state.artifacts.map((art) => {
        if (art.id === 'art-dataset-raw') {
          return {
            ...art,
            hash: nextChanged ? (art.mismatchHash || 'sha256_99b0f1a839e248b19283401bcda90192309124801b92013890a817bca8912') : (art.canonicalHash || art.hash),
            status: (nextChanged ? 'MISMATCH' : 'SYNCHRONIZED') as Artifact['status']
          };
        }
        return art;
      });

      // Update claim 1 status
      const updatedClaims = state.claims.map((claim) => {
        if (claim.id === 'claim-1') {
          return {
            ...claim,
            status: (nextChanged ? 'STALE' : 'SUPPORTED') as Claim['status'],
            stalenessReason: nextChanged
              ? 'Raw dataset cohort_clinical_raw.csv altered (hash mismatch sha256_99b0f1...). Claim #1 is now STALE.'
              : undefined
          };
        }
        return claim;
      });

      // Update projects health status
      const updatedProjects = state.projects.map((proj) => {
        if (proj.id === state.activeProjectId) {
          return {
            ...proj,
            healthStatus: (nextChanged ? 'HAS_STALE_CLAIMS' : 'HEALTHY') as ProjectWorkspace['healthStatus']
          };
        }
        return proj;
      });

      return {
        isUpstreamChanged: nextChanged,
        artifacts: updatedArtifacts,
        claims: updatedClaims,
        projects: updatedProjects
      };
    }),

  reRunExecutionAndReVerify: () =>
    set((state) => {
      const updatedArtifacts = state.artifacts.map((art) => {
        if (art.id === 'art-dataset-raw') {
          return {
            ...art,
            hash: art.canonicalHash || 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            status: 'SYNCHRONIZED' as Artifact['status']
          };
        }
        return art;
      });

      const updatedClaims = state.claims.map((claim) => ({
        ...claim,
        status: 'SUPPORTED' as Claim['status'],
        stalenessReason: undefined
      }));

      const updatedProjects = state.projects.map((proj) => ({
        ...proj,
        healthStatus: 'HEALTHY' as ProjectWorkspace['healthStatus']
      }));

      return {
        isUpstreamChanged: false,
        artifacts: updatedArtifacts,
        claims: updatedClaims,
        projects: updatedProjects
      };
    }),

  bindNewClaim: (selector: W3CSelector, title?: string, evidenceRootNodeId: string = 'art-cohort-clean') =>
    set((state) => {
      const index = state.claims.length + 1;
      const codeNum = String(index).padStart(3, '0');
      const newClaimId = `claim-${Date.now().toString(36)}`;
      const newClaim: Claim = {
        id: newClaimId,
        claimCode: `CLM-${codeNum}`,
        title: title || `Claim ${codeNum}: "${selector.exactQuote.slice(0, 30)}..."`,
        selector,
        status: 'SUPPORTED',
        manuscriptVersionId: state.activeManuscriptId,
        evidenceRootNodeId,
        boundAt: new Date().toISOString(),
        confidenceScore: 0.95
      };

      // Default assembly for new claim
      const defaultAssembly: ClaimEvidenceAssembly = {
        claimId: newClaimId,
        figureArtifactId: 'art-fig2',
        executionRunId: 'art-eval-run',
        codeScriptId: 'art-script-preprocess',
        datasetArtifactIds: ['art-cohort-clean', 'art-dataset-raw'],
        notes: `Initial evidence assembly for ${newClaim.claimCode}`,
        updatedAt: new Date().toISOString()
      };

      const updatedClaims = [...state.claims, newClaim];
      const updatedProjects = state.projects.map((p) => {
        if (p.id === state.activeProjectId) {
          return { ...p, claimsCount: updatedClaims.length };
        }
        return p;
      });

      return {
        claims: updatedClaims,
        activeClaimId: newClaimId,
        isBindClaimModalOpen: false,
        pendingBinding: null,
        projects: updatedProjects,
        claimAssemblies: {
          ...state.claimAssemblies,
          [newClaimId]: defaultAssembly
        }
      };
    }),

  saveClaimAssembly: (assembly: ClaimEvidenceAssembly) =>
    set((state) => {
      const updatedAssemblies = {
        ...state.claimAssemblies,
        [assembly.claimId]: {
          ...assembly,
          updatedAt: new Date().toISOString()
        }
      };

      // Update claim's evidenceRootNodeId if figure is selected
      const updatedClaims = state.claims.map((c) => {
        if (c.id === assembly.claimId) {
          return {
            ...c,
            evidenceRootNodeId: assembly.figureArtifactId || c.evidenceRootNodeId,
            assembly
          };
        }
        return c;
      });

      return {
        claimAssemblies: updatedAssemblies,
        claims: updatedClaims
      };
    }),

  linkArtifactToClaim: (claimId: string, artifactId: string) =>
    set((state) => {
      const current = state.claimAssemblies[claimId] || {
        claimId,
        datasetArtifactIds: [],
        updatedAt: new Date().toISOString()
      };

      const exists = current.datasetArtifactIds.includes(artifactId);
      const updatedDatasetIds = exists ? current.datasetArtifactIds : [...current.datasetArtifactIds, artifactId];

      return {
        claimAssemblies: {
          ...state.claimAssemblies,
          [claimId]: {
            ...current,
            datasetArtifactIds: updatedDatasetIds,
            updatedAt: new Date().toISOString()
          }
        }
      };
    }),

  linkAiRecordToClaim: (claimId: string, aiRecordId: string) =>
    set((state) => {
      const current = state.claimAssemblies[claimId] || {
        claimId,
        datasetArtifactIds: [],
        updatedAt: new Date().toISOString()
      };

      return {
        claimAssemblies: {
          ...state.claimAssemblies,
          [claimId]: {
            ...current,
            aiPromptRecordId: aiRecordId,
            updatedAt: new Date().toISOString()
          }
        }
      };
    }),

  addProject: (projectData) => {
    const newId = `proj-${Date.now().toString(36)}`;
    const newProject: ProjectWorkspace = {
      ...projectData,
      id: newId,
      claimsCount: 0,
      healthStatus: 'HEALTHY',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
      activeProjectId: newId,
      isNewProjectModalOpen: false
    }));

    return newId;
  },

  uploadDraft: (title, versionTag, content, authors = 'Dr. Alice Vance et al.') =>
    set((state) => {
      const newDraftId = `draft-${Date.now().toString(36)}`;
      const randomHash = `sha256_${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const newDraft: ManuscriptVersion = {
        id: newDraftId,
        title,
        versionTag,
        uploadedAt: 'Just now',
        content,
        contentHash: randomHash,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        authors
      };

      const updatedProjects = state.projects.map((p) => {
        if (p.id === state.activeProjectId) {
          return { ...p, activeManuscriptVersion: versionTag };
        }
        return p;
      });

      return {
        manuscripts: [newDraft, ...state.manuscripts],
        activeManuscriptId: newDraftId,
        isUploadDraftModalOpen: false,
        projects: updatedProjects
      };
    }),

  registerArtifact: (artifactData) =>
    set((state) => {
      const newArtifact: Artifact = {
        ...artifactData,
        id: `art-${Date.now().toString(36)}`,
        status: 'SYNCHRONIZED',
        registeredDate: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };

      return {
        artifacts: [...state.artifacts, newArtifact],
        isRegisterArtifactModalOpen: false
      };
    }),

  addAiRecord: (recordData) =>
    set((state) => {
      const newRecord: AiInteractionRecord = {
        ...recordData,
        id: `ai-rec-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        copeVerified: true
      };

      return {
        aiRecords: [newRecord, ...state.aiRecords],
        isSimulateAiModalOpen: false
      };
    }),

  setRoCrateDialogOpen: (open) => set({ isRoCrateDialogOpen: open }),
  setBindClaimModalOpen: (open) => set({ isBindClaimModalOpen: open }),
  setNewProjectModalOpen: (open) => set({ isNewProjectModalOpen: open }),
  setUploadDraftModalOpen: (open) => set({ isUploadDraftModalOpen: open }),
  setRegisterArtifactModalOpen: (open) => set({ isRegisterArtifactModalOpen: open }),
  setSimulateAiModalOpen: (open) => set({ isSimulateAiModalOpen: open }),
  setPendingBinding: (selector) => set({ pendingBinding: selector, isBindClaimModalOpen: selector !== null }),

  resetAll: () =>
    set({
      projects: INITIAL_PROJECTS,
      activeProjectId: 'proj-oncogen-01',
      manuscripts: INITIAL_MANUSCRIPTS,
      activeManuscriptId: 'draft-v2',
      claims: INITIAL_CLAIMS,
      activeClaimId: 'claim-1',
      artifacts: INITIAL_ARTIFACTS,
      aiRecords: INITIAL_AI_RECORDS,
      isUpstreamChanged: false,
      claimAssemblies: INITIAL_CLAIM_ASSEMBLIES,
      isRoCrateDialogOpen: false,
      isBindClaimModalOpen: false,
      isNewProjectModalOpen: false,
      isUploadDraftModalOpen: false,
      isRegisterArtifactModalOpen: false,
      isSimulateAiModalOpen: false,
      pendingBinding: null
    })
}));
