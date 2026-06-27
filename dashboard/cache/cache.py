import time
from typing import Dict, Any, Optional
from ..constants import CACHE_TTL

class DashboardCache:
    def __init__(self, ttl: int = CACHE_TTL):
        self.ttl = ttl
        self._cache: Dict[str, Dict[str, Any]] = {}

    def _generate_key(self, workspace_id: str, product_id: str, analysis_id: str) -> str:
        return f"{workspace_id}:{product_id}:{analysis_id}"

    def get(self, workspace_id: str, product_id: str, analysis_id: str) -> Optional[Any]:
        key = self._generate_key(workspace_id, product_id, analysis_id)
        if key in self._cache:
            entry = self._cache[key]
            if time.time() - entry["timestamp"] < self.ttl:
                return entry["data"]
            else:
                del self._cache[key]  # 만료 시 제거
        return None

    def set(self, workspace_id: str, product_id: str, analysis_id: str, data: Any) -> None:
        key = self._generate_key(workspace_id, product_id, analysis_id)
        self._cache[key] = {
            "data": data,
            "timestamp": time.time()
        }

    def invalidate(self, workspace_id: str, product_id: str, analysis_id: str) -> None:
        key = self._generate_key(workspace_id, product_id, analysis_id)
        if key in self._cache:
            del self._cache[key]

    def clear(self) -> None:
        self._cache.clear()
