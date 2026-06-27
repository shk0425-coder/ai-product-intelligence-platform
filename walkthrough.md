# Sprint 2-5 & 2-6 Walkthrough

This document outlines the accomplishments, verification results, and details of the database migration scripts created for the **Strategy / Creative Domain** (Sprint 2-5) and the **Audit / Learning Domain** (Sprint 2-6).

## Changes Implemented

We created 8 new database migration scripts under `database/migrations/` corresponding to sequence numbers 20 to 27:

### Sprint 2-5: Strategy / Creative Domain
1. **[20_strategy_tables.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/20_strategy_tables.sql)**:
   - Declares the `product_strategies` table to store AI product strategy generation output.
   - Declares the `creative_briefs` table to store landing/detailed page storyboard layouts and creative assets directions.
   - Adds complete Korean comments (`COMMENT ON TABLE` and `COMMENT ON COLUMN`) for all tables and columns.
2. **[21_strategy_constraints.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/21_strategy_constraints.sql)**:
   - Configures Primary Keys (`pk_product_strategies` and `pk_creative_briefs`).
   - Configures Unique constraints on `run_id` for both tables (`uq_product_strategies_run_id` and `uq_creative_briefs_run_id`) to enforce a strict physical 1:1 relationship with `analysis_runs`.
   - Configures Foreign Keys referencing `analysis_runs(run_id)` with `ON DELETE CASCADE` to enable automatic cleanup during tenant destruction or run deletion.
3. **[22_strategy_indexes.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/22_strategy_indexes.sql)**:
   - Creates B-tree indexes on foreign keys (`idx_product_strategies_run_id` and `idx_creative_briefs_run_id`) to optimize join queries.
   - Creates a GIN index on `creative_briefs(storyboard)` (`idx_creative_briefs_storyboard`) to accelerate searching/filtering within the large JSONB storyboard array. Other JSONB fields are not search targets and are omitted from indexing.
4. **[23_strategy_triggers.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/23_strategy_triggers.sql)**:
   - Includes trigger omission comments for maintenance consistency, since neither table contains an `updated_at` column.

### Sprint 2-6: Audit / Learning Domain
5. **[24_audit_tables.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/24_audit_tables.sql)**:
   - Declares the `decision_audits` table to store decision weight computation logs and rationales.
   - Declares the `knowledge_assets` table to store verified few-shot knowledge assets.
   - Declares the `learning_feedback_logs` table to store actual sales data and recommended weight adjustments.
   - Restricts `knowledge_assets.category` to use the pre-defined `knowledge_category` custom Enum type.
   - Adds complete Korean comments (`COMMENT ON TABLE` and `COMMENT ON COLUMN`) for all tables and columns.
6. **[25_audit_constraints.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/25_audit_constraints.sql)**:
   - Configures Primary Keys (`pk_decision_audits`, `pk_knowledge_assets`, `pk_learning_feedback_logs`).
   - Configures a Unique constraint on `decision_audits(run_id)` for 1:1 relation integrity.
   - Configures Foreign Keys referencing parent tables:
     - `decision_audits.run_id` ➡️ `analysis_runs(run_id)` ON DELETE CASCADE
     - `knowledge_assets.workspace_id` ➡️ `workspaces(workspace_id)` ON DELETE CASCADE
     - `knowledge_assets.source_run_id` ➡️ `analysis_runs(run_id)` **ON DELETE SET NULL** (preserving assets even if source run is removed)
     - `learning_feedback_logs.run_id` ➡️ `analysis_runs(run_id)` ON DELETE CASCADE
7. **[26_audit_indexes.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/26_audit_indexes.sql)**:
   - Creates B-tree indexes for all foreign key columns to optimize query joins and filters:
     - `idx_decision_audits_run_id`
     - `idx_knowledge_assets_workspace_id`
     - `idx_knowledge_assets_source_run_id`
     - `idx_learning_feedback_logs_run_id`
   - Omit GIN indexing on logs' JSONB columns since they are not search/filter targets.
8. **[27_audit_triggers.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/27_audit_triggers.sql)**:
   - Includes trigger omission comments for maintenance consistency, since none of the tables contain an `updated_at` column.

---

## Verification Results

### 1. DDL Self Review
- Verified that all SQL commands conform to PostgreSQL 16 standard.
- Verified that all queries utilize `IF NOT EXISTS` for idempotency.
- Verified that no tables contain circular reference paths.

### 2. Architecture Integrity Check
- Checked column types against `database_architecture.md v1.1 Final`.
- Verified that column names and data types (such as `JSONB`, `UUID`, and `TEXT`) match 100% with the specification.
- Confirmed that no extra/unauthorized tables or columns were added.

### 3. Migration Dependency Check
- Validated that the files execute sequentially (20 ➡️ 27).
- Confirmed that the scripts reference `public.workspaces` and `public.analysis_runs` which are defined in earlier migrations, ensuring no unresolved foreign key dependency errors.
