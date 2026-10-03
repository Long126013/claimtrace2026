// ==============================================================================
// ClaimTrace W3C PROV-DM Graph Seed Script for Neo4j
// ==============================================================================

// 1. Constraints
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT agent_id_unique IF NOT EXISTS FOR (a:Agent) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT claim_id_unique IF NOT EXISTS FOR (c:Claim) REQUIRE c.id IS UNIQUE;

// 2. Create All Nodes (Agents, Datasets, Code, Activities, Claims, Literature)
MERGE (an:Agent:Researcher {id: "agent-an"})
SET an.name = "Pham Phuoc An",
    an.identifier = "student:SE170123",
    an.roles = ["Software", "Formal Analysis", "Data Curation"];

MERGE (phuong:Agent:Researcher {id: "agent-phuong"})
SET phuong.name = "Dr. Lam Huu Khanh Phuong",
    phuong.identifier = "orcid:0000-0002-1823-9201",
    phuong.roles = ["Principal Investigator", "Methodology", "Supervision"];

MERGE (claude:Agent:AIModel {id: "agent-claude"})
SET claude.name = "Claude 3.5 Sonnet",
    claude.identifier = "anthropic/claude-3-5-sonnet-20241022",
    claude.roles = ["AI Assistant"];

MERGE (raw_mimic:Entity:DatasetVersion {id: "dataset-raw-mimic"})
SET raw_mimic.label = "raw_mimic_icu_v1.csv",
    raw_mimic.content_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    raw_mimic.records = 34210,
    raw_mimic.size = "412.6 MB";

MERGE (clean_mimic:Entity:DatasetVersion {id: "dataset-clean-mimic"})
SET clean_mimic.label = "clean_mimic_cohort.parquet",
    clean_mimic.content_hash = "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    clean_mimic.features = 48,
    clean_mimic.timesteps = 24;

MERGE (code_prep:Entity:CodeRevision {id: "code-preprocess"})
SET code_prep.label = "preprocess_cohort.py @ d4f1a8e",
    code_prep.content_hash = "git:d4f1a8e990c741e4b85c184c8a2b58ef9c71b123";

MERGE (code_model:Entity:CodeRevision {id: "code-transformer"})
SET code_model.label = "train_temporal_transformer.py @ b7c320a",
    code_model.content_hash = "git:b7c320a11029c78201fa871b65ca4910298a0021";

MERGE (run_prep:Activity:ExecutionRun {id: "run-preprocess"})
SET run_prep.label = "Execution Run: Preprocess MIMIC Cohort",
    run_prep.content_hash = "run:20260905-0945-prep",
    run_prep.command = "python preprocess_cohort.py --impute cross_attention";

MERGE (run_train:Activity:ExecutionRun {id: "run-train-eval"})
SET run_train.label = "Execution Run: Train & Eval Transformer",
    run_train.content_hash = "run:20260906-1430-train",
    run_train.auroc = 0.912,
    run_train.ci_lower = 0.898,
    run_train.ci_upper = 0.926;

MERGE (numpy_paper:Entity:ExternalReference {id: "ext-ref-numpy-nature"})
SET numpy_paper.label = "Harris et al. (2020) - Nature",
    numpy_paper.doi = "10.1038/s41586-020-2649-2",
    numpy_paper.crossref_status = "ACTIVE_VERIFIED",
    numpy_paper.is_retracted = false;

MERGE (claim1:Claim {id: "claim-1"})
SET claim1.text = "our temporal transformer achieves an AUROC of 91.2% (95% CI: 89.8–92.6) on the MIMIC-IV test cohort, outperforming the clinical XGBoost baseline by 4.8%",
    claim1.status = "SUPPORTED",
    claim1.exact_quote = "achieves an AUROC of 91.2%",
    claim1.confidence = 1.0;

// 3. Connect Relationships Using Explicit MATCH to Ensure Exact Node Binding
MATCH (clean:Entity {id: "dataset-clean-mimic"}), (raw:Entity {id: "dataset-raw-mimic"})
MERGE (clean)-[:WAS_DERIVED_FROM {expected_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}]->(raw);

MATCH (clean:Entity {id: "dataset-clean-mimic"}), (run:Activity {id: "run-preprocess"})
MERGE (clean)-[:WAS_GENERATED_BY]->(run);

MATCH (run:Activity {id: "run-preprocess"}), (code:Entity {id: "code-preprocess"})
MERGE (run)-[:USED]->(code);

MATCH (run:Activity {id: "run-preprocess"}), (an:Agent {id: "agent-an"})
MERGE (run)-[:WAS_ASSOCIATED_WITH]->(an);

MATCH (run:Activity {id: "run-train-eval"}), (clean:Entity {id: "dataset-clean-mimic"})
MERGE (run)-[:USED]->(clean);

MATCH (run:Activity {id: "run-train-eval"}), (code:Entity {id: "code-transformer"})
MERGE (run)-[:USED]->(code);

MATCH (run:Activity {id: "run-train-eval"}), (an:Agent {id: "agent-an"})
MERGE (run)-[:WAS_ASSOCIATED_WITH]->(an);

MATCH (claim:Claim {id: "claim-1"}), (run:Activity {id: "run-train-eval"})
MERGE (claim)-[:HAS_EVIDENCE_BINDING]->(run);

MATCH (claim:Claim {id: "claim-1"}), (clean:Entity {id: "dataset-clean-mimic"})
MERGE (claim)-[:HAS_EVIDENCE_BINDING]->(clean);

MATCH (claim:Claim {id: "claim-1"}), (paper:Entity {id: "ext-ref-numpy-nature"})
MERGE (claim)-[:WAS_INFORMED_BY]->(paper);
