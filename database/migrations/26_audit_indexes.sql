BEGIN;

-- 1. B-tree indexes for Foreign Keys
CREATE INDEX IF NOT EXISTS idx_decision_audits_run_id 
    ON public.decision_audits USING btree (run_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_assets_workspace_id 
    ON public.knowledge_assets USING btree (workspace_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_assets_source_run_id 
    ON public.knowledge_assets USING btree (source_run_id);

CREATE INDEX IF NOT EXISTS idx_learning_feedback_logs_run_id 
    ON public.learning_feedback_logs USING btree (run_id);

COMMIT;
