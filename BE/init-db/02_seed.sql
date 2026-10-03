-- ==============================================================================
-- ClaimTrace Initial Seed Data
-- ==============================================================================

-- 1. Organisational Unit
INSERT INTO "organisational_units" ("UnitId", "UnitName", "UnitCode", "Description")
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Faculty of Information Technology - FPT University',
    'FPTU-FIT',
    'Undergraduate and Postgraduate Research Lab'
) ON CONFLICT DO NOTHING;

-- 2. Standard System Roles
INSERT INTO "Role" ("RoleId", "RoleName", "Permissions", "Description")
VALUES 
(
    'b0000000-0000-0000-0000-000000000001',
    'Administrator',
    'all:read,all:write,system:manage,ai_quota:manage',
    'Full system administrator with tenant oversight'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'Principal Investigator',
    'project:read,project:write,provenance:verify,auditlink:create',
    'Senior researcher managing lab projects and compliance'
),
(
    'b0000000-0000-0000-0000-000000000003',
    'Lead Researcher',
    'project:read,claim:bind,dataset:register,code:register',
    'Student or primary researcher developing pipelines and drafting claims'
),
(
    'b0000000-0000-0000-0000-000000000004',
    'Auditor / External Reviewer',
    'project:read,provenance:verify,auditlink:view',
    'Read-only external reviewer verifying evidence chains'
) ON CONFLICT DO NOTHING;

-- 3. Initial Users (Supervisor & Student Lead)
INSERT INTO "User" ("UserId", "UnitId", "RoleId", "Email", "PasswordHash", "FullName", "OrcidId", "IsActive")
VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    'phuonglhk@fpt.edu.vn',
    '$2b$12$e8Y41b0K7ZkZ8pQZ0e7kX.1aF2X8V.xG9bI9j0p2uK9oQ.Z0e7kX.', -- Mock bcrypt hash
    'Dr. Lâm Hữu Khánh Phương',
    '0000-0002-1823-9201',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000003',
    'anppse170123@fpt.edu.vn',
    '$2b$12$e8Y41b0K7ZkZ8pQZ0e7kX.1aF2X8V.xG9bI9j0p2uK9oQ.Z0e7kX.', -- Mock bcrypt hash
    'Phạm Phước An',
    '0009-0004-9821-3312',
    TRUE
) ON CONFLICT DO NOTHING;

-- 4. Initial Research Project
INSERT INTO "ResearchProject" ("ProjectId", "ProjectTitle", "ProjectCode", "Description")
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'ClaimTrace: A Research Provenance Platform for AI-Assisted Science with Claim-Level Evidence Binding',
    'FA26SE273',
    'FPT University Capstone Project FA26SE273 investigating verifiable provenance graphs and durable text anchoring.'
) ON CONFLICT DO NOTHING;

-- 5. Project Memberships
INSERT INTO "ProjectMembership" ("ProjectId", "UserId", "ProjectRole")
VALUES 
(
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Supervisor & Principal Investigator'
),
(
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'Lead Student Researcher'
) ON CONFLICT DO NOTHING;

-- 6. AI Provider Configs
INSERT INTO "AiProviderConfig" ("ProviderId", "ProviderName", "ApiEndpoint", "PermittedModels", "IsActive")
VALUES 
(
    'e0000000-0000-0000-0000-000000000001',
    'Anthropic',
    'https://api.anthropic.com/v1',
    'claude-3-5-sonnet-20241022,claude-3-haiku-20240307',
    TRUE
),
(
    'e0000000-0000-0000-0000-000000000002',
    'OpenAI',
    'https://api.openai.com/v1',
    'gpt-4o,gpt-4o-mini',
    TRUE
) ON CONFLICT DO NOTHING;

-- 7. Project AI Quotas
INSERT INTO "ProjectAiQuota" ("ProjectId", "ProviderId", "MonthlyTokenLimit", "UsedTokensCurrentCycle", "ResetDayOfMonth")
VALUES 
(
    'd0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    2000000,
    145000,
    1
),
(
    'd0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000002',
    1000000,
    82000,
    1
) ON CONFLICT DO NOTHING;

-- 8. Provenance Schema Version & Compatibility Report
INSERT INTO "ProvenanceSchemaVersion" ("SchemaVersionId", "ActivatedBy", "VersionTag", "SchemaDefinition", "Status", "ActivatedAt")
VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'v1.0.0-PROV-DM',
    '{"profile": "ClaimTrace-W3C-PROV", "entities": ["DatasetVersion", "CodeRevision", "ExecutionRun", "Claim"], "relations": ["wasDerivedFrom", "used", "wasGeneratedBy", "hasEvidenceBinding"]}',
    'ACTIVE',
    CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO "CompatibilityReport" ("ReportId", "SchemaVersionId", "CompatibilityStatus", "BreakingChanges", "MigrationNotes")
VALUES (
    'f1000000-0000-0000-0000-000000000001',
    'f0000000-0000-0000-0000-000000000001',
    'COMPATIBLE',
    'None. Initial baseline schema version.',
    'Fully compliant with W3C PROV-DM Core and W3C Web Annotation Architecture.'
) ON CONFLICT DO NOTHING;
