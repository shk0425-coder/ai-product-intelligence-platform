BEGIN;

-- B-tree indexes for Foreign Keys
CREATE INDEX IF NOT EXISTS idx_workspaces_org_id ON workspaces (org_id);
CREATE INDEX IF NOT EXISTS idx_users_workspace_id ON users (workspace_id);
CREATE INDEX IF NOT EXISTS idx_products_workspace_id ON products (workspace_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_product_id ON analysis_runs (product_id);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_version_id ON analysis_runs (version_id);

-- B-tree indexes for commonly searched/filtered columns
CREATE INDEX IF NOT EXISTS idx_products_keyword ON products (keyword);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

COMMIT;
