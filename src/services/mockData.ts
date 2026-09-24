import type { 
  ProjectWorkspace, 
  ManuscriptVersion, 
  Claim, 
  Artifact, 
  AiInteractionRecord, 
  RoCrateMetadata,
  LineageBranchNode,
  ClaimEvidenceAssembly
} from '../types';


export const INITIAL_PROJECTS: ProjectWorkspace[] = [
  {
    id: "proj-oncogen-01",
    name: "OncoGen AI Study: Chemo-Immunotherapy Response in NSCLC",
    leadInvestigator: "Dr. Alice Vance",
    institution: "Oncology Research Institute / Harvard Medical School",
    activeManuscriptVersion: "draft_v2.0.md",
    claimsCount: 4,
    healthStatus: "HEALTHY",
    description: "Deep multi-omic representation learning for predicting chemo-immunotherapy resistance in non-small cell lung carcinoma (NSCLC).",
    repositoryUrl: "https://github.com/oncogen-consortium/chemo-resistance-ml",
    domain: "Computational Oncology & Genomics",
    lastUpdated: "2025-05-20"
  },
  {
    id: "proj-crispr-02",
    name: "High-Throughput Single-Cell Perturbation Phenotyping",
    leadInvestigator: "Dr. Alice Vance",
    institution: "Broad Institute of MIT and Harvard",
    activeManuscriptVersion: "manuscript_preflight_v1.2.pdf",
    claimsCount: 3,
    healthStatus: "HEALTHY",
    description: "Transformer representations for predicting single-cell transcriptome shifts under combinatorial CRISPR guide perturbations.",
    repositoryUrl: "https://github.com/vance-lab/crispr-transformer-bench",
    domain: "Functional Genomics",
    lastUpdated: "2025-05-15"
  },
  {
    id: "proj-immuno-03",
    name: "Predictive Biomarkers of Checkpoint Inhibitor Failure",
    leadInvestigator: "Dr. Alice Vance",
    institution: "Oncology Research Institute",
    activeManuscriptVersion: "tnbc_final_submission.tex",
    claimsCount: 5,
    healthStatus: "HEALTHY",
    description: "Clinical predictive markers of neoadjuvant immune checkpoint failure in triple-negative breast cancer biopsies.",
    repositoryUrl: "https://github.com/vance-lab/tnbc-checkpoint-audit",
    domain: "Clinical Oncology",
    lastUpdated: "2025-05-02"
  },
  {
    id: "proj-spatial-04",
    name: "Spatial Transcriptomic Niche Deconvolution in Glioblastoma",
    leadInvestigator: "Dr. Alice Vance & Dr. Erik Lindqvist",
    institution: "Dana-Farber Cancer Institute",
    activeManuscriptVersion: "gbm_spatial_v1.0.md",
    claimsCount: 4,
    healthStatus: "HEALTHY",
    description: "Graph neural networks resolving sub-cellular spatial cellular neighborhoods and invasive hypoxic fronts in resected glioblastoma.",
    repositoryUrl: "https://github.com/vance-lab/gbm-spatial-graph",
    domain: "Spatial Biology & Pathology",
    lastUpdated: "2025-04-28"
  },
  {
    id: "proj-proteo-05",
    name: "Deep Proteogenomic Screening for Early Ovarian Carcinoma",
    leadInvestigator: "Dr. Alice Vance",
    institution: "Oncology Research Institute",
    activeManuscriptVersion: "ovarian_proteo_audit.md",
    claimsCount: 3,
    healthStatus: "HEALTHY",
    description: "Mass-spectrometry proteomics combined with cfDNA methylation classifiers for stage I high-grade serous ovarian cancer.",
    repositoryUrl: "https://github.com/vance-lab/ovarian-proteogenomics",
    domain: "Proteomics & Liquid Biopsy",
    lastUpdated: "2025-04-19"
  },
  {
    id: "proj-radiogen-06",
    name: "Multimodal Foundation Model for Colorectal Liver Metastases",
    leadInvestigator: "Dr. Alice Vance",
    institution: "Memorial Sloan Kettering / Harvard Med",
    activeManuscriptVersion: "radiomics_draft_v2.1.tex",
    claimsCount: 4,
    healthStatus: "HEALTHY",
    description: "Vision-language foundation models combining contrast CT volumetric scans with targeted NGS panel mutations.",
    repositoryUrl: "https://github.com/vance-lab/radiomics-multimodal-foundation",
    domain: "Radiogenomics & AI Imaging",
    lastUpdated: "2025-04-10"
  }
];

export const INITIAL_MANUSCRIPTS: ManuscriptVersion[] = [
  {
    id: "draft-v1",
    versionTag: "draft_v1.0.md",
    title: "Initial Exploratory Model for Chemo-Immunotherapy Response in NSCLC",
    uploadedAt: "Uploaded 10 days ago (2025-05-10)",
    wordCount: 4210,
    authors: "Alice Vance, Ph.D.¹, Erik Lindqvist, M.D.²",
    contentHash: "sha256_b10a4f8921e03948190391ab92401829310ab291039102830192830192830192",
    doi: "10.1101/2025.04.12.589104",
    content: `## 1. Introduction and Preliminary Cohort
In this preliminary exploration, clinical covariates were directly ingested without explicit variance stabilization. The preliminary AUROC measured was 0.84 prior to batch harmonization.`
  },
  {
    id: "draft-v2",
    versionTag: "draft_v2.0.md",
    title: "Robust Cross-Platform Multi-Omic Representation Learning for Predicting Chemo-Immunotherapy Response in Non-Small Cell Lung Carcinoma",
    uploadedAt: "Active • 2 days ago (2025-05-18)",
    wordCount: 6140,
    authors: "Alice Vance, Ph.D.¹, Erik Lindqvist, M.D.², Kai Zhao, Ph.D.¹",
    contentHash: "sha256_a93f8b02d9198642a8b9415c43d78901b0f5e3b0c44298fc1c149afbf4c8996",
    doi: "10.1101/2025.04.12.589104",
    content: `Prior to deep latent feature extraction, raw transcriptomic expression matrices and matched clinical covariate tables underwent rigorous batch correction. Initial quality control excluded patient records with more than 15% missing clinical annotations or mean sequencing depth below 25 million paired-end reads. To account for systemic platform variance between Illumina NovaSeq 6000 and HiSeq 4000 instruments, we applied an audited variance-stabilizing transformation pipeline orchestrated via deterministic containerized workflows.

Across five-fold repeated cross-validation stratified by treatment arm, our non-linear attention architecture significantly outperformed regularized ridge regression and standard gradient-boosted decision trees. Specifically, The normalization cohort yielded a verified AUROC of 0.92 (95% CI: 0.89-0.95). In comparative stress-testing against non-harmonized inputs, Baseline models degraded by 14% under batch effect perturbation. These quantitative findings demonstrate the necessity of verifiable preprocessing chains when deploying deep genomic classifiers.

To evaluate cross-center robustness, the frozen feature representation model was evaluated blindly on an external retrospective cohort from the Memorial Sloan Kettering (MSK-IMPACT) archive (n = 312). Model calibration curves exhibited an expected calibration error (ECE) of 0.041 across MSK-IMPACT validation, indicating strong probability fidelity across demographic subgroups without secondary fine-tuning.

Post-hoc explainability analysis using integrated gradients and SHAP values identified specific immunogenic expression drivers. Notably, SHAP feature attribution ranked CD274 and CXCL9 as the top invariant predictors across sequencing centers. This biologic concordance confirms that our batch harmonization preserved genuine checkpoint pathway signals rather than artifactual technical noise.`
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: "claim-1",
    claimCode: "CLM-001",
    title: "Normalization Cohort AUROC",
    selector: {
      exactQuote: "The normalization cohort yielded a verified AUROC of 0.92 (95% CI: 0.89-0.95).",
      prefix: "decision trees. Specifically, ",
      suffix: " In comparative stress-testing"
    },
    status: "SUPPORTED",
    manuscriptVersionId: "draft-v2",
    evidenceRootNodeId: "art-fig2",
    boundAt: "2025-05-18T14:22:10Z",
    confidenceScore: 0.98,
    section: "Section 3.1 Predictive Performance"
  },
  {
    id: "claim-2",
    claimCode: "CLM-002",
    title: "Batch Perturbation Degradation Rate",
    selector: {
      exactQuote: "Baseline models degraded by 14% under batch effect perturbation.",
      prefix: "comparative stress-testing against non-harmonized inputs, ",
      suffix: " These quantitative findings"
    },
    status: "SUPPORTED",
    manuscriptVersionId: "draft-v2",
    evidenceRootNodeId: "art-benchmark-perturbation",
    boundAt: "2025-05-18T14:25:44Z",
    confidenceScore: 0.95,
    section: "Section 3.1 Robustness Benchmarks"
  },
  {
    id: "claim-3",
    claimCode: "CLM-003",
    title: "MSK-IMPACT External Replication Calibration",
    selector: {
      exactQuote: "Model calibration curves exhibited an expected calibration error (ECE) of 0.041 across MSK-IMPACT validation",
      prefix: "Memorial Sloan Kettering (MSK-IMPACT) archive (n = 312). ",
      suffix: ", indicating strong probability fidelity across demographic"
    },
    status: "SUPPORTED",
    manuscriptVersionId: "draft-v2",
    evidenceRootNodeId: "art-msk-calibration",
    boundAt: "2025-05-19T09:12:00Z",
    confidenceScore: 0.94,
    section: "Section 3.2 Generalizability"
  },
  {
    id: "claim-4",
    claimCode: "CLM-004",
    title: "Biomarker Feature Attribution (CD274 & CXCL9)",
    selector: {
      exactQuote: "SHAP feature attribution ranked CD274 and CXCL9 as the top invariant predictors across sequencing centers.",
      prefix: "gradients and SHAP values identified specific immunogenic expression drivers. Notably, ",
      suffix: " This biologic concordance confirms"
    },
    status: "SUPPORTED",
    manuscriptVersionId: "draft-v2",
    evidenceRootNodeId: "art-shap-summary",
    boundAt: "2025-05-19T11:40:15Z",
    confidenceScore: 0.99,
    section: "Section 3.3 Explainability"
  }
];

export const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: "art-dataset-raw",
    type: "DATASET",
    name: "cohort_clinical_raw.csv",
    hash: "sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    version: "v1.0.4",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-15 08:30:12",
    sizeOrDetail: "418.3 MB (48,290 records)",
    description: "Raw multi-omic patient transcriptomics and clinical annotation tables",
    canonicalHash: "sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    mismatchHash: "sha256_99b0f1a839e248b19283401bcda90192309124801b92013890a817bca8912",
    roleTag: "Root Dataset"
  },
  {
    id: "art-rna-matrix",
    type: "DATASET",
    name: "gene_expression_counts.tsv",
    hash: "sha256_7fa2810a4891bca09214bcda9019283019284019283019283019283019283019",
    version: "v2.0-aligned",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-15 09:15:00",
    sizeOrDetail: "1.24 GB (20,440 Ensembl genes)",
    description: "STAR-aligned TPM normalized transcriptomic expression matrices from Illumina NovaSeq",
    canonicalHash: "sha256_7fa2810a4891bca09214bcda9019283019284019283019283019283019283019",
    roleTag: "RNA-Seq Raw Matrix"
  },
  {
    id: "art-batch-meta",
    type: "DATASET",
    name: "batch_metadata.json",
    hash: "sha256_b319028401bca09124801b92013890a817bca891290391029301920391029301",
    version: "release-v1",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-16 11:20:00",
    sizeOrDetail: "245 KB (Instrument Logs)",
    description: "Sequencer serial numbers, flowcell lanes, and library prep date coordinates",
    roleTag: "Sequencing Instrument Metadata"
  },
  {
    id: "art-script-preprocess",
    type: "CODE",
    name: "preprocess.py",
    hash: "sha256_8f93b29c4021a003e87d3298bfd198302194b0d9124019283401c91039b201a0",
    version: "commit #8f93b2",
    upstreamId: "art-dataset-raw",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 09:50:00",
    sizeOrDetail: "14.2 KB (Python 3.11)",
    description: "Standard z-score batch normalization script with logged AI co-authorship",
    relationship: "used",
    roleTag: "Data Harmonization Script"
  },
  {
    id: "art-run-preprocess",
    type: "EXECUTION_RUN",
    name: "run_preprocess_001",
    hash: "sha256_5a17e089d71a4f02931a293c33390c88392019ab921bdfc029391039b8219401",
    version: "Command: python preprocess.py --norm zscore --harmonize batch",
    upstreamId: "art-script-preprocess",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 10:14:02",
    sizeOrDetail: "Docker python:3.11-slim (3m 42s)",
    description: "Deterministic containerized workflow run executing multi-omic harmonization",
    relationship: "wasGeneratedBy",
    roleTag: "Preprocessing Activity"
  },
  {
    id: "art-cohort-clean",
    type: "DATASET",
    name: "cohort_clean.parquet",
    hash: "sha256_118fa390c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852",
    version: "v2.1",
    upstreamId: "art-run-preprocess",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 10:18:15",
    sizeOrDetail: "142.8 MB (48,290 rows x 1,280 features)",
    description: "Harmonized and z-score normalized patient multi-omic dataset",
    relationship: "wasDerivedFrom",
    roleTag: "Harmonized Tensor"
  },
  {
    id: "art-train-script",
    type: "CODE",
    name: "train_pipeline.py",
    hash: "sha256_c910283019284019283019284019283019284019283019284019283019284019",
    version: "commit #3d4f19",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 11:30:00",
    sizeOrDetail: "28.5 KB (PyTorch 2.3)",
    description: "Self-attention cross-modal representation learning architecture with gradient clipping",
    relationship: "used",
    roleTag: "Training Script"
  },
  {
    id: "art-train-run",
    type: "EXECUTION_RUN",
    name: "run_train_001",
    hash: "sha256_e109283019284019283019284019283019284019283019284019283019284019",
    version: "Command: torchrun train_pipeline.py --epochs 100 --seed 42",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 15:45:00",
    sizeOrDetail: "NVIDIA A100 SXM4 (4h 12m)",
    description: "Distributed data parallel model convergence run with deterministic seed",
    relationship: "wasGeneratedBy",
    roleTag: "Deep Learning Activity"
  },
  {
    id: "art-model-weights",
    type: "CODE",
    name: "model_weights.pt",
    hash: "sha256_f901928301928401928301928401928301928401928301928401928301928401",
    version: "checkpoint_epoch_100.pt",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 15:48:00",
    sizeOrDetail: "840.4 MB (State Dict)",
    description: "Frozen neural network weights after 100 epochs of training on harmonized tensor",
    relationship: "wasGeneratedBy",
    roleTag: "Model Artifact"
  },
  {
    id: "art-eval-script",
    type: "CODE",
    name: "evaluate.py",
    hash: "sha256_a401928301928401928301928401928301928401928301928401928301928401",
    version: "commit #9c2b41",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 16:00:00",
    sizeOrDetail: "12.1 KB (Python 3.11)",
    description: "Repeated cross-validation evaluator with 1,000 bootstrap iterations",
    relationship: "used",
    roleTag: "Validation Script"
  },
  {
    id: "art-eval-run",
    type: "EXECUTION_RUN",
    name: "run_eval_002",
    hash: "sha256_7a01928301928401928301928401928301928401928301928401928301928401",
    version: "Command: python evaluate.py --model model_weights.pt --bootstraps 1000",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 16:15:00",
    sizeOrDetail: "Docker evaluation harness (1m 18s)",
    description: "Statistical inference run computing AUROC and bootstrap confidence intervals",
    relationship: "wasGeneratedBy",
    roleTag: "Evaluation Activity"
  },
  {
    id: "art-fig2",
    type: "FIGURE",
    name: "fig2_auc_roc.png",
    hash: "sha256_44ca18a02c9198642a8b9415c43d78901b0f5e3b0c44298fc1c149afbf4c8996",
    version: "release-2",
    upstreamId: "art-eval-run",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 16:20:00",
    sizeOrDetail: "Vector Plot (300 DPI)",
    description: "Multi-fold cross-validation ROC curve plot yielding verified AUROC 0.92 (95% CI: 0.89-0.95)",
    relationship: "wasDerivedFrom",
    roleTag: "Paper Figure 2"
  },
  {
    id: "art-benchmark-perturbation",
    type: "DATASET",
    name: "perturbation_benchmark.json",
    hash: "sha256_3102948190391ab92401829310ab291039102830192830192830192830192830",
    version: "benchmark_v1",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-18 17:00:00",
    sizeOrDetail: "8.4 MB (JSON Matrix)",
    description: "Batch effect perturbation degradation benchmarks comparing attention vs baseline ridge",
    relationship: "wasDerivedFrom",
    roleTag: "Stress Benchmark Table"
  },
  {
    id: "art-msk-calibration",
    type: "FIGURE",
    name: "msk_impact_calibration.pdf",
    hash: "sha256_55102948190391ab92401829310ab29103910283019283019283019283019283",
    version: "v1.2",
    status: "SYNCHRONIZED",
    registeredDate: "2025-05-19 09:30:00",
    sizeOrDetail: "Vector PDF (312 Patients)",
    description: "Blinded cross-center calibration reliability curves on MSK-IMPACT cohort (ECE: 0.041)",
    relationship: "wasDerivedFrom",
    roleTag: "Replication Figure 4"
  }
];

export const INITIAL_AI_RECORDS: AiInteractionRecord[] = [
  {
    id: "ai-rec-001",
    targetArtifact: "preprocess.py",
    model: "GPT-4o (Temperature: 0.2, Seed: 42)",
    temperature: 0.2,
    promptHash: "sha256_prompt_3829ad4102948291039c91f4a9b201e82847c293041a9e88b20",
    originalSuggestion: "def norm(x):\n    return x / 100",
    adoptedCode: "def norm(x):\n    return (x - np.mean(x)) / np.std(x)",
    decision: "MODIFIED",
    rationale: "Model suggested arbitrary division by 100; replaced with z-score standard normalization to eliminate batch effect skew across disparate sequencing centers.",
    auditorName: "Dr. Alice Vance",
    orcid: "0000-0002-1825-0097",
    timestamp: "2025-05-18T09:48:12Z",
    copeVerified: true
  },
  {
    id: "ai-rec-002",
    targetArtifact: "train_pipeline.py",
    model: "Claude 3.5 Sonnet (Temperature: 0.1, Seed: 101)",
    temperature: 0.1,
    promptHash: "sha256_prompt_5b102948190391ab92401829310ab29103910283019283019283",
    originalSuggestion: "loss.backward()\noptimizer.step()",
    adoptedCode: "loss.backward()\ntorch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)\noptimizer.step()",
    decision: "MODIFIED",
    rationale: "Added gradient clipping (max_norm=1.0) to prevent exploding gradients when learning cross-attention weights between transcriptomic and clinical tables.",
    auditorName: "Dr. Alice Vance",
    orcid: "0000-0002-1825-0097",
    timestamp: "2025-05-18T11:22:04Z",
    copeVerified: true
  },
  {
    id: "ai-rec-003",
    targetArtifact: "evaluate.py",
    model: "DeepSeek-Coder-V2 (Temperature: 0.0, Seed: 7)",
    temperature: 0.0,
    promptHash: "sha256_prompt_7c102948190391ab92401829310ab29103910283019283019283",
    originalSuggestion: "from sklearn.metrics import roc_auc_score\nauc = roc_auc_score(y_true, y_pred)",
    adoptedCode: "from sklearn.metrics import roc_auc_score\nauc = roc_auc_score(y_true, y_pred)",
    decision: "ACCEPTED",
    rationale: "Standard Scikit-Learn ROC calculation accepted without modification after confirming identical tie-breaking behavior with Wilcoxon-Mann-Whitney U statistics.",
    auditorName: "Dr. Alice Vance",
    orcid: "0000-0002-1825-0097",
    timestamp: "2025-05-18T15:58:30Z",
    copeVerified: true
  },
  {
    id: "ai-rec-004",
    targetArtifact: "impute_missing.py",
    model: "Gemini 1.5 Pro (Temperature: 0.4, Seed: 88)",
    temperature: 0.4,
    promptHash: "sha256_prompt_9d102948190391ab92401829310ab29103910283019283019283",
    originalSuggestion: "df.fillna(df.mean(), inplace=True)",
    adoptedCode: "# REJECTED: Replaced with iterative MICE KNN imputer (k=5) to preserve non-linear covariance",
    decision: "REJECTED",
    rationale: "Naive column-mean imputation collapses bimodal gene expression distributions. Discarded in favor of verified multiple imputation with chained equations (MICE).",
    auditorName: "Dr. Alice Vance",
    orcid: "0000-0002-1825-0097",
    timestamp: "2025-05-18T08:15:10Z",
    copeVerified: true
  }
];

export const INITIAL_CLAIM_ASSEMBLIES: Record<string, ClaimEvidenceAssembly> = {
  "claim-1": {
    claimId: "claim-1",
    figureArtifactId: "art-fig2",
    executionRunId: "art-eval-run",
    codeScriptId: "art-script-preprocess",
    aiPromptRecordId: "ai-rec-001",
    datasetArtifactIds: ["art-cohort-clean", "art-dataset-raw", "art-rna-matrix", "art-batch-meta"],
    notes: "Cross-validation AUROC 0.92 linked to Figure 2, containerized run_eval_002, preprocess.py with GPT-4o Z-score normalization prompt, and 3 upstream input datasets.",
    updatedAt: "2025-05-18T16:25:00Z"
  },
  "claim-2": {
    claimId: "claim-2",
    figureArtifactId: "art-benchmark-perturbation",
    executionRunId: "art-run-preprocess",
    codeScriptId: "art-script-preprocess",
    aiPromptRecordId: "ai-rec-002",
    datasetArtifactIds: ["art-cohort-clean", "art-benchmark-perturbation"],
    notes: "Degradation stress benchmark matrix derived from synthetic noise injection on harmonized tensor.",
    updatedAt: "2025-05-18T17:10:00Z"
  },
  "claim-3": {
    claimId: "claim-3",
    figureArtifactId: "art-msk-calibration",
    executionRunId: "art-eval-run",
    codeScriptId: "art-eval-script",
    aiPromptRecordId: "ai-rec-003",
    datasetArtifactIds: ["art-msk-calibration"],
    notes: "Blinded external validation on MSK-IMPACT cohort (n=312) yielding ECE 0.041 calibration.",
    updatedAt: "2025-05-19T09:40:00Z"
  },
  "claim-4": {
    claimId: "claim-4",
    figureArtifactId: "art-fig2",
    executionRunId: "art-train-run",
    codeScriptId: "art-train-script",
    aiPromptRecordId: "ai-rec-002",
    datasetArtifactIds: ["art-cohort-clean"],
    notes: "SHAP feature ranking for CD274 and CXCL9 derived from KernelSHAP explainability run.",
    updatedAt: "2025-05-19T11:50:00Z"
  }
};

/**
 * Builds a dynamic multi-branching PROV-O lineage tree directly from a ClaimEvidenceAssembly.
 */
export function buildTreeFromAssembly(
  claimId: string,
  claimText: string,
  assembly: ClaimEvidenceAssembly,
  isUpstreamChanged: boolean,
  artifactsList: Artifact[] = INITIAL_ARTIFACTS,
  aiRecordsList: AiInteractionRecord[] = INITIAL_AI_RECORDS
): LineageBranchNode {
  const figArt = artifactsList.find(a => a.id === assembly.figureArtifactId) || artifactsList.find(a => a.type === 'FIGURE');
  const execArt = artifactsList.find(a => a.id === assembly.executionRunId) || artifactsList.find(a => a.type === 'EXECUTION_RUN');
  const codeArt = artifactsList.find(a => a.id === assembly.codeScriptId) || artifactsList.find(a => a.type === 'CODE');
  const aiRec = aiRecordsList.find(r => r.id === assembly.aiPromptRecordId);
  const datasets = assembly.datasetArtifactIds
    .map(id => artifactsList.find(a => a.id === id))
    .filter((a): a is Artifact => Boolean(a));

  const codeChildren: LineageBranchNode[] = [];
  if (aiRec) {
    codeChildren.push({
      id: `node-ai-${aiRec.id}`,
      name: `AI Prompt: ${aiRec.model} (${aiRec.rationale})`,
      category: 'CONFIG',
      relationship: 'wasInformedBy',
      hash: aiRec.promptHash,
      version: `COPE-2023-${aiRec.copeVerified ? 'VERIFIED' : 'PENDING'}`,
      status: 'SYNCHRONIZED',
      detail: `Prompt: "${aiRec.originalSuggestion.slice(0, 70)}..."`
    });
  }

  const execChildren: LineageBranchNode[] = [];
  if (codeArt) {
    execChildren.push({
      id: `node-${codeArt.id}`,
      name: `Script: ${codeArt.name}`,
      category: 'CODE',
      relationship: 'used',
      hash: codeArt.hash,
      version: codeArt.version,
      status: 'SYNCHRONIZED',
      detail: codeArt.description || 'Primary pipeline script',
      children: codeChildren.length > 0 ? codeChildren : undefined
    });
  }

  datasets.forEach((ds, idx) => {
    const isDatasetStale = isUpstreamChanged && (ds.id === 'art-dataset-raw' || ds.name.includes('raw') || idx === 0);
    execChildren.push({
      id: `node-${ds.id}-${idx}`,
      name: `Dataset: ${ds.name}`,
      category: 'DATASET',
      relationship: 'used',
      hash: ds.hash,
      version: ds.version,
      status: isDatasetStale ? 'STALE' : (ds.status || 'SYNCHRONIZED'),
      isBroken: isDatasetStale,
      detail: ds.sizeOrDetail || ds.description || 'Input dataset artifact'
    });
  });

  const figChildren: LineageBranchNode[] = [];
  if (execArt) {
    figChildren.push({
      id: `node-${execArt.id}`,
      name: `Activity: ${execArt.name}`,
      category: 'EXECUTION',
      relationship: 'wasGeneratedBy',
      hash: execArt.hash,
      version: execArt.version,
      status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
      isBroken: isUpstreamChanged,
      detail: execArt.description || 'Containerized deterministic execution run',
      children: execChildren
    });
  }

  const rootChildren: LineageBranchNode[] = [];
  if (figArt) {
    rootChildren.push({
      id: `node-${figArt.id}`,
      name: `Figure: ${figArt.name}`,
      category: 'FIGURE',
      relationship: 'wasDerivedFrom',
      hash: figArt.hash,
      version: figArt.version,
      status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
      isBroken: isUpstreamChanged,
      detail: figArt.description || 'Resulting evidence figure',
      children: figChildren
    });
  }

  return {
    id: `node-${claimId}`,
    name: `Claim: ${claimText}`,
    category: 'CLAIM',
    status: isUpstreamChanged ? 'STALE' : 'HEALTHY',
    detail: assembly.notes || 'Curated evidence assembly via Claim Evidence Studio',
    isBroken: isUpstreamChanged,
    brokenReason: isUpstreamChanged ? 'Dependent on upstream raw data modification' : undefined,
    children: rootChildren
  };
}

/**
 * Returns a rich, multi-branching PROV-O evidence hierarchy tree for any claim.
 * Real academic provenance has forks for both the modeling/evaluation pipeline
 * and the data ingestion/preprocessing pipeline.
 */
export function getClaimLineageTree(
  claimId: string, 
  isUpstreamChanged: boolean,
  _customAssembly?: ClaimEvidenceAssembly
): LineageBranchNode {
  // If custom assembly is provided for a dynamically added claim (not claim-1 to claim-4)
  if (_customAssembly && !['claim-1', 'claim-2', 'claim-3', 'claim-4'].includes(claimId)) {
    return buildTreeFromAssembly(
      claimId, 
      `Claim ${claimId.toUpperCase()}`, 
      _customAssembly, 
      isUpstreamChanged
    );
  }

  // Claim 1: AUROC 0.92
  if (claimId === 'claim-1') {
    const rawDatasetHash = isUpstreamChanged 
      ? 'sha256_99b0f1a839e248b19283401bcda90192309124801b92013890a817bca8912'
      : 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    return {
      id: 'node-claim-1',
      name: 'Claim CLM-001: AUROC 0.92 (95% CI: 0.89-0.95)',
      category: 'CLAIM',
      status: isUpstreamChanged ? 'STALE' : 'HEALTHY',
      detail: 'Manuscript Section 3.1 (W3C TextQuoteSelector Anchor)',
      isBroken: isUpstreamChanged,
      brokenReason: isUpstreamChanged ? 'Dependent on stale pipeline artifacts originating from root CSV invalidation' : undefined,
      children: [
        {
          id: 'node-fig2',
          name: 'Figure 2: fig2_auc_roc.png',
          category: 'FIGURE',
          relationship: 'wasDerivedFrom',
          hash: 'sha256_44ca18a02c9198642a8b9415c43d78901b0f5e3b0c44298fc1c149afbf4c8996',
          version: 'release-2 (Vector 300 DPI)',
          status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
          branchLabel: 'Branch A: Inference & Evaluation Pipeline',
          isBroken: isUpstreamChanged,
          detail: 'Final published figure displaying bootstrap 95% confidence bands',
          children: [
            {
              id: 'node-run-eval',
              name: 'Activity: run_eval_002 (evaluate.py)',
              category: 'EXECUTION',
              relationship: 'wasGeneratedBy',
              hash: 'sha256_7a01928301928401928301928401928301928401928301928401928301928401',
              version: 'Docker container evaluation harness (1m 18s)',
              status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
              isBroken: isUpstreamChanged,
              detail: 'Calculated ROC metric across 1,000 bootstrap test splits',
              children: [
                {
                  id: 'node-script-eval',
                  name: 'Script: evaluate.py',
                  category: 'CODE',
                  relationship: 'used',
                  hash: 'sha256_a401928301928401928301928401928301928401928301928401928301928401',
                  version: 'commit #9c2b41',
                  status: 'SYNCHRONIZED',
                  detail: 'Scikit-learn ROC calculation backend (COPE Audited: DeepSeek-Coder-V2)'
                },
                {
                  id: 'node-model-weights',
                  name: 'Checkpoint: model_weights.pt',
                  category: 'MODEL_WEIGHTS',
                  relationship: 'used',
                  hash: 'sha256_f901928301928401928301928401928301928401928301928401928301928401',
                  version: 'epoch_100_final.pt (840 MB)',
                  status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
                  isBroken: isUpstreamChanged,
                  branchLabel: 'Fork: Neural Model Training',
                  detail: 'Frozen neural model trained on harmonized multi-omic representations',
                  children: [
                    {
                      id: 'node-run-train',
                      name: 'Activity: run_train_001 (train_pipeline.py)',
                      category: 'EXECUTION',
                      relationship: 'wasGeneratedBy',
                      hash: 'sha256_e109283019284019283019284019283019284019283019284019283019284019',
                      version: 'NVIDIA A100 SXM4 (4h 12m, Seed: 42)',
                      status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
                      isBroken: isUpstreamChanged,
                      children: [
                        {
                          id: 'node-script-train',
                          name: 'Plan: train_pipeline.py',
                          category: 'CODE',
                          relationship: 'used',
                          hash: 'sha256_c910283019284019283019284019283019284019283019284019283019284019',
                          version: 'commit #3d4f19',
                          status: 'SYNCHRONIZED',
                          detail: 'Self-attention cross-modal training logic with gradient clipping'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'node-cohort-clean',
          name: 'Dataset: cohort_clean.parquet',
          category: 'DATASET',
          relationship: 'wasDerivedFrom',
          hash: 'sha256_118fa390c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852',
          version: 'v2.1 (48,290 rows x 1,280 features)',
          status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
          branchLabel: 'Branch B: Multi-Omic Ingestion & Preprocessing Pipeline',
          isBroken: isUpstreamChanged,
          detail: 'Harmonized patient multi-omic tensor after deterministic z-score transformation',
          children: [
            {
              id: 'node-run-preprocess',
              name: 'Activity: run_preprocess_001 (preprocess.py)',
              category: 'EXECUTION',
              relationship: 'wasGeneratedBy',
              hash: 'sha256_5a17e089d71a4f02931a293c33390c88392019ab921bdfc029391039b8219401',
              version: 'Docker python:3.11-slim (3m 42s)',
              status: isUpstreamChanged ? 'STALE' : 'SYNCHRONIZED',
              isBroken: isUpstreamChanged,
              detail: 'Containerized batch harmonization step executing audited z-score pipeline',
              children: [
                {
                  id: 'node-script-preprocess',
                  name: 'Code: preprocess.py',
                  category: 'CODE',
                  relationship: 'used',
                  hash: 'sha256_8f93b29c4021a003e87d3298bfd198302194b0d9124019283401c91039b201a0',
                  version: 'commit #8f93b2 (Audited AI Co-authorship)',
                  status: 'SYNCHRONIZED',
                  detail: 'Z-score normalization function approved by Dr. Alice Vance (COPE Ledger)'
                },
                {
                  id: 'node-dataset-rna',
                  name: 'Input: gene_expression_counts.tsv',
                  category: 'DATASET',
                  relationship: 'used',
                  hash: 'sha256_7fa2810a4891bca09214bcda9019283019284019283019283019283019283019',
                  version: 'v2.0-aligned (1.24 GB)',
                  status: 'SYNCHRONIZED',
                  detail: 'STAR-aligned transcriptomic TPM matrix (Illumina NovaSeq)'
                },
                {
                  id: 'node-dataset-batchmeta',
                  name: 'Config: batch_metadata.json',
                  category: 'CONFIG',
                  relationship: 'used',
                  hash: 'sha256_b319028401bca09124801b92013890a817bca891290391029301920391029301',
                  version: 'release-v1 (245 KB)',
                  status: 'SYNCHRONIZED',
                  detail: 'Sequencing machine serial identifiers and reagent lot numbers'
                },
                {
                  id: 'node-dataset-raw',
                  name: 'Root Dataset: cohort_clinical_raw.csv',
                  category: 'DATASET',
                  relationship: 'used',
                  hash: rawDatasetHash,
                  version: 'v1.0.4 (418.3 MB, 48,290 records)',
                  status: isUpstreamChanged ? 'MISMATCH' : 'SYNCHRONIZED',
                  isBroken: isUpstreamChanged,
                  brokenReason: isUpstreamChanged ? 'External mutation detected: SHA-256 hash diverged from canonical baseline v1.0' : undefined,
                  detail: 'Primary clinical cohort records ingested prior to downstream normalization'
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // Claim 2: Baseline degradation 14%
  if (claimId === 'claim-2') {
    return {
      id: 'node-claim-2',
      name: 'Claim CLM-002: Baseline models degraded by 14% under batch effect perturbation',
      category: 'CLAIM',
      status: 'HEALTHY',
      detail: 'Manuscript Section 3.1 Robustness Stress-Testing',
      children: [
        {
          id: 'node-perturbation-table',
          name: 'Table Artifact: perturbation_benchmark.json',
          category: 'DATASET',
          relationship: 'wasDerivedFrom',
          hash: 'sha256_3102948190391ab92401829310ab291039102830192830192830192830192830',
          version: 'benchmark_v1 (8.4 MB)',
          status: 'SYNCHRONIZED',
          branchLabel: 'Branch: Synthetic Perturbation Suite',
          detail: 'Matrix of 50 synthetic batch-variance injections tested across 5 baselines',
          children: [
            {
              id: 'node-stress-run',
              name: 'Activity: run_stress_test (stress_benchmark.py)',
              category: 'EXECUTION',
              relationship: 'wasGeneratedBy',
              hash: 'sha256_8801928301928401928301928401928301928401928301928401928301928401',
              version: 'Docker run (12m 40s)',
              status: 'SYNCHRONIZED',
              children: [
                {
                  id: 'node-stress-code',
                  name: 'Script: stress_benchmark.py',
                  category: 'CODE',
                  relationship: 'used',
                  hash: 'sha256_4401928301928401928301928401928301928401928301928401928301928401',
                  version: 'commit #1a9c8e',
                  status: 'SYNCHRONIZED',
                  detail: 'Automated Gaussian and multiplicative noise injection module'
                },
                {
                  id: 'node-baseline-model',
                  name: 'Baseline Model: ridge_regression_baseline.pkl',
                  category: 'MODEL_WEIGHTS',
                  relationship: 'used',
                  hash: 'sha256_1201928301928401928301928401928301928401928301928401928301928401',
                  version: 'scikit_ridge_v1',
                  status: 'SYNCHRONIZED',
                  detail: 'L2-regularized linear baseline benchmark model'
                },
                {
                  id: 'node-attention-model',
                  name: 'Attention Model: model_weights.pt',
                  category: 'MODEL_WEIGHTS',
                  relationship: 'used',
                  hash: 'sha256_f901928301928401928301928401928301928401928301928401928301928401',
                  version: 'checkpoint_epoch_100.pt',
                  status: 'SYNCHRONIZED',
                  detail: 'Proposed attention architecture showing invariance to noise'
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // Claim 3: MSK-IMPACT Calibration ECE 0.041
  if (claimId === 'claim-3') {
    return {
      id: 'node-claim-3',
      name: 'Claim CLM-003: Model calibration curves exhibited an expected calibration error (ECE) of 0.041',
      category: 'CLAIM',
      status: 'HEALTHY',
      detail: 'Manuscript Section 3.2 External Cross-Center Replication',
      children: [
        {
          id: 'node-msk-fig',
          name: 'Figure 4: msk_impact_calibration.pdf',
          category: 'FIGURE',
          relationship: 'wasDerivedFrom',
          hash: 'sha256_55102948190391ab92401829310ab29103910283019283019283019283019283',
          version: 'v1.2 (Vector PDF)',
          status: 'SYNCHRONIZED',
          branchLabel: 'Branch: Blinded External Cohort Validation',
          detail: '10-bin reliability diagram with Hosmer-Lemeshow goodness-of-fit test',
          children: [
            {
              id: 'node-msk-run',
              name: 'Activity: run_external_validate (evaluate_msk.py)',
              category: 'EXECUTION',
              relationship: 'wasGeneratedBy',
              hash: 'sha256_66102948190391ab92401829310ab29103910283019283019283019283019283',
              version: 'Blinded Validation Container (2m 10s)',
              status: 'SYNCHRONIZED',
              children: [
                {
                  id: 'node-msk-cohort',
                  name: 'External Dataset: msk_impact_cohort.parquet',
                  category: 'DATASET',
                  relationship: 'used',
                  hash: 'sha256_99102948190391ab92401829310ab29103910283019283019283019283019283',
                  version: 'MSKCC Retrospective (94.2 MB, n=312)',
                  status: 'SYNCHRONIZED',
                  detail: 'External patient cohort held completely blind during training'
                },
                {
                  id: 'node-frozen-weights',
                  name: 'Frozen Weights: model_weights.pt',
                  category: 'MODEL_WEIGHTS',
                  relationship: 'used',
                  hash: 'sha256_f901928301928401928301928401928301928401928301928401928301928401',
                  version: 'epoch_100_final.pt',
                  status: 'SYNCHRONIZED',
                  detail: 'Trained model evaluated without any secondary fine-tuning'
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // Claim 4: SHAP Feature Attribution (CD274 & CXCL9)
  return {
    id: 'node-claim-4',
    name: 'Claim CLM-004: SHAP feature attribution ranked CD274 and CXCL9 as top invariant predictors',
    category: 'CLAIM',
    status: 'HEALTHY',
    detail: 'Manuscript Section 3.3 Explainability & Biologic Concordance',
    children: [
      {
        id: 'node-shap-summary',
        name: 'Plot: shap_summary_beeswarm.pdf',
        category: 'FIGURE',
        relationship: 'wasDerivedFrom',
        hash: 'sha256_aa102948190391ab92401829310ab29103910283019283019283019283019283',
        version: 'release-1 (300 DPI)',
        status: 'SYNCHRONIZED',
        branchLabel: 'Branch: Post-Hoc Shapley Value Explainability',
        detail: 'Beeswarm plot of top 20 genes explaining latent attention scores',
        children: [
          {
            id: 'node-shap-run',
            name: 'Activity: run_shap_explainer (explain_shap.py)',
            category: 'EXECUTION',
            relationship: 'wasGeneratedBy',
            hash: 'sha256_bb102948190391ab92401829310ab29103910283019283019283019283019283',
            version: 'KernelSHAP Background Sample (48m 20s)',
            status: 'SYNCHRONIZED',
            children: [
              {
                id: 'node-shap-script',
                name: 'Script: explain_shap.py',
                category: 'CODE',
                relationship: 'used',
                hash: 'sha256_cc102948190391ab92401829310ab29103910283019283019283019283019283',
                version: 'commit #7e3a12',
                status: 'SYNCHRONIZED',
                detail: 'Gradient-based Shapley value estimator using 200 background reference points'
              },
              {
                id: 'node-shap-clean-data',
                name: 'Dataset: cohort_clean.parquet',
                category: 'DATASET',
                relationship: 'used',
                hash: 'sha256_118fa390c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852',
                version: 'v2.1',
                status: 'SYNCHRONIZED',
                detail: 'Clean multi-omic tensor providing background reference points'
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Builds standard W3C PROV-O & RO-Crate 1.1 JSON-LD payload
 */
export function generateRoCrateMetadata(
  isUpstreamChanged: boolean,
  claims: Claim[],
  artifacts: Artifact[],
  aiRecord: AiInteractionRecord
): RoCrateMetadata {
  return {
    "@context": [
      "https://w3id.org/ro/crate/1.1/context",
      {
        "prov": "http://www.w3.org/ns/prov#",
        "oa": "http://www.w3.org/ns/oa#",
        "claimtrace": "https://claimtrace.org/schema/v1#"
      }
    ],
    "@graph": [
      {
        "@id": "ro-crate-metadata.json",
        "@type": "CreativeWork",
        "conformsTo": { "@id": "https://w3id.org/ro/crate/1.1" },
        "about": { "@id": "./" },
        "dateCreated": new Date().toISOString()
      },
      {
        "@id": "./",
        "@type": ["Dataset", "prov:Bundle"],
        "name": "OncoGen AI Study: Chemo-Immunotherapy Response",
        "description": "Research reproducibility crate containing W3C PROV-O claim-level lineages and AI code synthesis audit.",
        "hasPart": artifacts.map(a => ({ "@id": a.name })),
        "claimtrace:pipelineStatus": isUpstreamChanged ? "UPSTREAM_INVALIDATION_DETECTED" : "CANONICAL_SYNCHRONIZED",
        "prov:wasAttributedTo": { "@id": `https://orcid.org/${aiRecord.orcid}` }
      },
      {
        "@id": `https://orcid.org/${aiRecord.orcid}`,
        "@type": "prov:Person",
        "name": aiRecord.auditorName,
        "identifier": aiRecord.orcid,
        "role": "Principal Investigator & Audit Reviewer"
      },
      ...artifacts.map(a => ({
        "@id": a.name,
        "@type": ["File", "prov:Entity"],
        "name": a.name,
        "sha256": a.hash,
        "version": a.version,
        "prov:status": a.status === 'MISMATCH' ? 'INVALIDATED_HASH_MISMATCH' : 'SYNCHRONIZED'
      })),
      {
        "@id": "src/pipelines/preprocess.py",
        "@type": ["File", "prov:Entity", "prov:Plan"],
        "name": "preprocess.py",
        "claimtrace:aiAudit": {
          "model": aiRecord.model,
          "promptHash": aiRecord.promptHash,
          "decision": aiRecord.decision,
          "humanRationale": aiRecord.rationale,
          "reviewer": aiRecord.auditorName,
          "orcid": aiRecord.orcid,
          "copeCompliant": aiRecord.copeVerified
        }
      },
      ...claims.map(claim => ({
        "@id": `#${claim.claimCode}`,
        "@type": ["oa:Annotation", "prov:Entity"],
        "name": claim.title || claim.claimCode,
        "prov:status": claim.status,
        "prov:wasDerivedFrom": { "@id": claim.evidenceRootNodeId },
        "oa:hasTarget": {
          "@type": "oa:SpecificResource",
          "oa:hasSource": { "@id": claim.manuscriptVersionId },
          "oa:hasSelector": {
            "@type": "oa:TextQuoteSelector",
            "oa:exact": claim.selector.exactQuote,
            "oa:prefix": claim.selector.prefix,
            "oa:suffix": claim.selector.suffix
          }
        },
        "claimtrace:stalenessReason": claim.stalenessReason || null
      }))
    ]
  };
}
