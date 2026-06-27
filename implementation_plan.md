# Sprint 2-6: Audit / Learning Domain Database DDL Implementation

Implementation plan for Audit / Learning Domain database schema setup in PostgreSQL 16 (Supabase). This plan includes defining tables, constraints, indexes, and trigger logic for the `decision_audits`, `knowledge_assets`, and `learning_feedback_logs` tables as defined in the database architecture specification.

## User Review Required

> [!IMPORTANT]
> The database architecture is in a **Final Freeze** state. No modifications, additions, or removals of columns, enums, tables, or relationships are allowed. The implementation strictly translates the architecture document to physical SQL.

## Open Questions

None.

## Proposed Changes

We will create four new DDL files in `database/migrations/`:
- `24_audit_tables.sql`
- `25_audit_constraints.sql`
- `26_audit_indexes.sql`
- `27_audit_triggers.sql`

---

### Audit / Learning Domain Database Schema

#### [NEW] [24_audit_tables.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/24_audit_tables.sql)
Creates the tables `decision_audits`, `knowledge_assets`, and `learning_feedback_logs` with proper column definitions, PostgreSQL 16 compatibility, and full table and column comments in Korean.
- `knowledge_assets` will use the custom enum type `knowledge_category` (defined in `02_enums.sql`) for its `category` column to enforce strict data integrity.
- All primary keys default to `gen_random_uuid()`.

#### [NEW] [25_audit_constraints.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/25_audit_constraints.sql)
Configures primary keys, unique constraints, and foreign key constraints:
- `decision_audits`: Primary key (`audit_id`), Unique (`run_id` for 1:1 relation), and Foreign Key pointing to `analysis_runs(run_id)` with `ON DELETE CASCADE`.
- `knowledge_assets`: Primary key (`asset_id`), Foreign Key pointing to `workspaces(workspace_id)` with `ON DELETE CASCADE`, and Foreign Key pointing to `analysis_runs(run_id)` with `ON DELETE SET NULL`.
- `learning_feedback_logs`: Primary key (`log_id`), Foreign Key pointing to `analysis_runs(run_id)` with `ON DELETE CASCADE`.

#### [NEW] [26_audit_indexes.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/26_audit_indexes.sql)
Creates B-tree indexes for all foreign keys to optimize query join performance:
- `idx_decision_audits_run_id`
- `idx_knowledge_assets_workspace_id`
- `idx_knowledge_assets_source_run_id`
- `idx_learning_feedback_logs_run_id`
No GIN indexes are required as no JSONB columns are defined as search targets in the architecture.

#### [NEW] [27_audit_triggers.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/27_audit_triggers.sql)
Since none of the three tables contain `updated_at` columns, no update trigger is needed. A placeholder migration script with idempotent comments will be created to maintain execution order consistency.

---

## Verification Plan

### DDL Self Review
- Verify PostgreSQL 16 syntax compatibility (e.g., standard data types, constraints, and indexes).
- Ensure Supabase SQL Editor compatibility (idempotency checks using `IF NOT EXISTS` and correct schema prefixes).
- Check that there are no circular foreign key dependencies.
- Confirm that trigger files are empty placeholders since no `updated_at` columns are used.
- Check index duplication to ensure no redundant indexes are created.

### Architecture Integrity Check
- Compare the generated tables (`decision_audits`, `knowledge_assets`, `learning_feedback_logs`) and columns against `database_architecture.md v1.1 Final`.
- Validate that column names, data types, NULL constraints, and relationships match 100% with the specification.
- Ensure that no extra columns, tables, or relationships are introduced.

### Migration Dependency Check
- Ensure that migrations 24 to 27 run in the correct logical sequence:
  1. Tables (`24_audit_tables.sql`)
  2. Constraints (`25_audit_constraints.sql`)
  3. Indexes (`26_audit_indexes.sql`)
  4. Triggers (`27_audit_triggers.sql`)
- Verify that these migrations are dependent only on the previously implemented Core domain tables (`workspaces`, `analysis_runs`).
