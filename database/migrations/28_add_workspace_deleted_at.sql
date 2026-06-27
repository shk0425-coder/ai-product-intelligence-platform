-- workspaces table soft delete column addition
ALTER TABLE workspaces
ADD COLUMN deleted_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN workspaces.deleted_at IS '소프트 딜리트 삭제 처리 일시';
