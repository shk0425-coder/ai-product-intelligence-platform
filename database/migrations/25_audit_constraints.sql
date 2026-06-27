BEGIN;

-- 1. Primary Keys
ALTER TABLE public.decision_audits ADD CONSTRAINT pk_decision_audits PRIMARY KEY (audit_id);
ALTER TABLE public.knowledge_assets ADD CONSTRAINT pk_knowledge_assets PRIMARY KEY (asset_id);
ALTER TABLE public.learning_feedback_logs ADD CONSTRAINT pk_learning_feedback_logs PRIMARY KEY (log_id);

-- 2. Unique Constraints
ALTER TABLE public.decision_audits ADD CONSTRAINT uq_decision_audits_run_id UNIQUE (run_id);

-- 3. Foreign Keys
ALTER TABLE public.decision_audits
    ADD CONSTRAINT fk_decision_audits_analysis_runs
    FOREIGN KEY (run_id) REFERENCES public.analysis_runs(run_id)
    ON DELETE CASCADE;

ALTER TABLE public.knowledge_assets
    ADD CONSTRAINT fk_knowledge_assets_workspaces
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(workspace_id)
    ON DELETE CASCADE;

ALTER TABLE public.knowledge_assets
    ADD CONSTRAINT fk_knowledge_assets_analysis_runs
    FOREIGN KEY (source_run_id) REFERENCES public.analysis_runs(run_id)
    ON DELETE SET NULL;

ALTER TABLE public.learning_feedback_logs
    ADD CONSTRAINT fk_learning_feedback_logs_analysis_runs
    FOREIGN KEY (run_id) REFERENCES public.analysis_runs(run_id)
    ON DELETE CASCADE;

COMMIT;
