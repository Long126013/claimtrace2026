-- ==============================================================================
-- ClaimTrace Relational Database Schema DDL
-- Generated from ERD Specification (14 Tables)
-- Database Engine: PostgreSQL 15+ / 16
-- ==============================================================================

-- Enable UUID extension for auto-generating primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean teardown (if re-running script)
DROP TABLE IF EXISTS "ProjectAiQuota" CASCADE;
DROP TABLE IF EXISTS "AiProviderConfig" CASCADE;
DROP TABLE IF EXISTS "ReconciliationIncident" CASCADE;
DROP TABLE IF EXISTS "IntegrationClient" CASCADE;
DROP TABLE IF EXISTS "AuditLink" CASCADE;
DROP TABLE IF EXISTS "ProjectMembership" CASCADE;
DROP TABLE IF EXISTS "ResearchProject" CASCADE;
DROP TABLE IF EXISTS "CompatibilityReport" CASCADE;
DROP TABLE IF EXISTS "ProvenanceSchemaVersion" CASCADE;
DROP TABLE IF EXISTS "PersonalAccessToken" CASCADE;
DROP TABLE IF EXISTS "SystemAuditLog" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Role" CASCADE;
DROP TABLE IF EXISTS "organisational_units" CASCADE;

-- ------------------------------------------------------------------------------
-- 1. organisational_units
-- ------------------------------------------------------------------------------
CREATE TABLE "organisational_units" (
    "UnitId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UnitName" VARCHAR(255) NOT NULL UNIQUE,
    "UnitCode" VARCHAR(50) NOT NULL UNIQUE,
    "Description" TEXT,
    "TimeCreatedAt" DATE DEFAULT CURRENT_DATE
);

-- ------------------------------------------------------------------------------
-- 2. Role
-- ------------------------------------------------------------------------------
CREATE TABLE "Role" (
    "RoleId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "RoleName" VARCHAR(100) NOT NULL UNIQUE,
    "Permissions" TEXT, -- JSON / comma-separated permission scopes
    "Description" TEXT
);

-- ------------------------------------------------------------------------------
-- 3. User
-- ------------------------------------------------------------------------------
CREATE TABLE "User" (
    "UserId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UnitId" UUID REFERENCES "organisational_units"("UnitId") ON DELETE SET NULL,
    "RoleId" UUID REFERENCES "Role"("RoleId") ON DELETE RESTRICT,
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "FullName" VARCHAR(255) NOT NULL,
    "OrcidId" VARCHAR(100) UNIQUE,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. PersonalAccessToken
-- ------------------------------------------------------------------------------
CREATE TABLE "PersonalAccessToken" (
    "TokenId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" UUID NOT NULL REFERENCES "User"("UserId") ON DELETE CASCADE,
    "TokenName" VARCHAR(255) NOT NULL,
    "Scopes" TEXT,
    "TokenHash" VARCHAR(255) NOT NULL UNIQUE,
    "LastUsedAt" TIMESTAMP WITH TIME ZONE,
    "ExpiresAt" TIMESTAMP WITH TIME ZONE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. SystemAuditLog
-- ------------------------------------------------------------------------------
CREATE TABLE "SystemAuditLog" (
    "LogId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ActorUserId" UUID REFERENCES "User"("UserId") ON DELETE SET NULL,
    "TargetId" UUID,
    "TargetEntity" VARCHAR(100) NOT NULL,
    "Action" VARCHAR(100) NOT NULL,
    "IpAddress" VARCHAR(45),
    "Diff" TEXT,
    "Timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. ProvenanceSchemaVersion
-- ------------------------------------------------------------------------------
CREATE TABLE "ProvenanceSchemaVersion" (
    "SchemaVersionId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ActivatedBy" UUID REFERENCES "User"("UserId") ON DELETE SET NULL,
    "VersionTag" VARCHAR(50) NOT NULL UNIQUE,
    "SchemaDefinition" TEXT NOT NULL,
    "Status" VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- e.g. ACTIVE, DEPRECATED, DRAFT
    "ActivatedAt" TIMESTAMP WITH TIME ZONE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. CompatibilityReport
-- ------------------------------------------------------------------------------
CREATE TABLE "CompatibilityReport" (
    "ReportId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "SchemaVersionId" UUID NOT NULL UNIQUE REFERENCES "ProvenanceSchemaVersion"("SchemaVersionId") ON DELETE CASCADE,
    "CompatibilityStatus" VARCHAR(50) NOT NULL, -- e.g. COMPATIBLE, BREAKING, WARN
    "BreakingChanges" TEXT,
    "MigrationNotes" TEXT,
    "GeneratedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. ResearchProject
-- ------------------------------------------------------------------------------
CREATE TABLE "ResearchProject" (
    "ProjectId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProjectTitle" VARCHAR(500) NOT NULL,
    "ProjectCode" VARCHAR(100) NOT NULL UNIQUE,
    "Description" TEXT,
    "IsArchived" BOOLEAN NOT NULL DEFAULT FALSE,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 9. ProjectMembership
-- ------------------------------------------------------------------------------
CREATE TABLE "ProjectMembership" (
    "ProjectId" UUID NOT NULL REFERENCES "ResearchProject"("ProjectId") ON DELETE CASCADE,
    "UserId" UUID NOT NULL REFERENCES "User"("UserId") ON DELETE CASCADE,
    "ProjectRole" VARCHAR(100) NOT NULL, -- e.g. Principal Investigator, Researcher, Auditor
    "JoinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("ProjectId", "UserId")
);

-- ------------------------------------------------------------------------------
-- 10. AuditLink
-- ------------------------------------------------------------------------------
CREATE TABLE "AuditLink" (
    "LinkId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "CreatedByUserId" UUID REFERENCES "User"("UserId") ON DELETE SET NULL,
    "ProjectId" UUID NOT NULL REFERENCES "ResearchProject"("ProjectId") ON DELETE CASCADE,
    "AccessTokenHash" VARCHAR(255) NOT NULL UNIQUE,
    "RecipientNote" TEXT,
    "RedactPrompts" BOOLEAN NOT NULL DEFAULT FALSE,
    "ExpiresAt" TIMESTAMP WITH TIME ZONE,
    "IsRevoked" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 11. IntegrationClient
-- ------------------------------------------------------------------------------
CREATE TABLE "IntegrationClient" (
    "ClientId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProjectId" UUID NOT NULL REFERENCES "ResearchProject"("ProjectId") ON DELETE CASCADE,
    "ClientName" VARCHAR(255) NOT NULL,
    "ClientType" VARCHAR(100) NOT NULL, -- e.g. JupyterPlugin, GitHook, OverleafSync
    "ClientTokenHash" VARCHAR(255) NOT NULL UNIQUE,
    "RegisteredAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "LastHeartbeatAt" TIMESTAMP WITH TIME ZONE,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 12. ReconciliationIncident
-- ------------------------------------------------------------------------------
CREATE TABLE "ReconciliationIncident" (
    "IncidentId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProjectId" UUID NOT NULL REFERENCES "ResearchProject"("ProjectId") ON DELETE CASCADE,
    "ClientId" UUID REFERENCES "IntegrationClient"("ClientId") ON DELETE SET NULL,
    "FailureType" VARCHAR(100) NOT NULL, -- e.g. HASH_MISMATCH, RETRACTION_TRIGGERED, NETWORK_TIMEOUT
    "ErrorMessage" TEXT,
    "RawPayload" TEXT,
    "Status" VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- e.g. OPEN, RESOLVED, IGNORED
    "DetectedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "ResolvedAt" TIMESTAMP WITH TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 13. AiProviderConfig
-- ------------------------------------------------------------------------------
CREATE TABLE "AiProviderConfig" (
    "ProviderId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProviderName" VARCHAR(100) NOT NULL UNIQUE, -- e.g. OpenAI, Anthropic, Ollama
    "ApiEndpoint" VARCHAR(500) NOT NULL,
    "PermittedModels" TEXT, -- JSON / comma-separated list of allowed models
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 14. ProjectAiQuota
-- ------------------------------------------------------------------------------
CREATE TABLE "ProjectAiQuota" (
    "ProjectId" UUID NOT NULL REFERENCES "ResearchProject"("ProjectId") ON DELETE CASCADE,
    "ProviderId" UUID NOT NULL REFERENCES "AiProviderConfig"("ProviderId") ON DELETE CASCADE,
    "MonthlyTokenLimit" INTEGER NOT NULL DEFAULT 1000000,
    "UsedTokensCurrentCycle" INTEGER NOT NULL DEFAULT 0,
    "ResetDayOfMonth" INTEGER NOT NULL DEFAULT 1,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("ProjectId", "ProviderId")
);

-- ==============================================================================
-- Performance & Lookup Indexes
-- ==============================================================================
CREATE INDEX idx_user_email ON "User"("Email");
CREATE INDEX idx_user_orcid ON "User"("OrcidId");
CREATE INDEX idx_auditlog_actor ON "SystemAuditLog"("ActorUserId");
CREATE INDEX idx_auditlog_target ON "SystemAuditLog"("TargetEntity", "TargetId");
CREATE INDEX idx_membership_user ON "ProjectMembership"("UserId");
CREATE INDEX idx_auditlink_project ON "AuditLink"("ProjectId");
CREATE INDEX idx_incident_project ON "ReconciliationIncident"("ProjectId");
CREATE INDEX idx_incident_status ON "ReconciliationIncident"("Status");
CREATE INDEX idx_client_project ON "IntegrationClient"("ProjectId");
