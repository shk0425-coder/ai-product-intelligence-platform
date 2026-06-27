def generate_cache_key(workspace_id: str, product_id: str, analysis_id: str) -> str:
    return f"{workspace_id}:{product_id}:{analysis_id}"
