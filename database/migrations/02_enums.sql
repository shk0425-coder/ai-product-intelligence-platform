BEGIN;

-- Check and create workspace_role
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workspace_role') THEN
        CREATE TYPE workspace_role AS ENUM ('ADMIN', 'MEMBER', 'VIEWER');
    END IF;
END$$;

-- Check and create product_status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
        CREATE TYPE product_status AS ENUM ('ACTIVE', 'ARCHIVAL', 'DELETED');
    END IF;
END$$;

-- Check and create analysis_status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'analysis_status') THEN
        CREATE TYPE analysis_status AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');
    END IF;
END$$;

-- Check and create supplier_platform
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_platform') THEN
        CREATE TYPE supplier_platform AS ENUM ('1688', 'ALIBABA', 'DOMESTIC');
    END IF;
END$$;

-- Check and create knowledge_category
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'knowledge_category') THEN
        CREATE TYPE knowledge_category AS ENUM ('JTBD_PATTERN', 'USP_FORMULA', 'COPY_SUCCESS');
    END IF;
END$$;

-- Check and create patent_risk_level
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'patent_risk_level') THEN
        CREATE TYPE patent_risk_level AS ENUM ('HIGH', 'MEDIUM', 'LOW');
    END IF;
END$$;

COMMIT;
