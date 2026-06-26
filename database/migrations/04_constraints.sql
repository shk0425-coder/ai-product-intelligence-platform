BEGIN;

-- 1. Primary Keys
ALTER TABLE organizations ADD CONSTRAINT pk_organizations PRIMARY KEY (org_id);
ALTER TABLE workspaces ADD CONSTRAINT pk_workspaces PRIMARY KEY (workspace_id);
ALTER TABLE users ADD CONSTRAINT pk_users PRIMARY KEY (user_id);
ALTER TABLE products ADD CONSTRAINT pk_products PRIMARY KEY (product_id);
ALTER TABLE product_images ADD CONSTRAINT pk_product_images PRIMARY KEY (image_id);
ALTER TABLE version_registry ADD CONSTRAINT pk_version_registry PRIMARY KEY (version_id);
ALTER TABLE analysis_runs ADD CONSTRAINT pk_analysis_runs PRIMARY KEY (run_id);

-- 2. Unique Constraints
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

-- 3. Foreign Keys
ALTER TABLE workspaces 
    ADD CONSTRAINT fk_workspaces_organizations 
    FOREIGN KEY (org_id) REFERENCES organizations(org_id) 
    ON DELETE CASCADE;

ALTER TABLE users 
    ADD CONSTRAINT fk_users_workspaces 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(workspace_id) 
    ON DELETE CASCADE;

ALTER TABLE products 
    ADD CONSTRAINT fk_products_workspaces 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(workspace_id) 
    ON DELETE CASCADE;

ALTER TABLE product_images 
    ADD CONSTRAINT fk_product_images_products 
    FOREIGN KEY (product_id) REFERENCES products(product_id) 
    ON DELETE CASCADE;

ALTER TABLE analysis_runs 
    ADD CONSTRAINT fk_analysis_runs_products 
    FOREIGN KEY (product_id) REFERENCES products(product_id) 
    ON DELETE CASCADE;

ALTER TABLE analysis_runs 
    ADD CONSTRAINT fk_analysis_runs_version_registry 
    FOREIGN KEY (version_id) REFERENCES version_registry(version_id);

COMMIT;
