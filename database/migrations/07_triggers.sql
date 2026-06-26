BEGIN;

CREATE TRIGGER trg_organizations_update_timestamp
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_workspaces_update_timestamp
    BEFORE UPDATE ON workspaces
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_users_update_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_products_update_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_updated_at();

COMMIT;
