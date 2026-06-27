from ..api import APIClient
from ..utils import map_analysis_response
from ..types import AnalysisResponse

class AnalysisService:
    def __init__(self, client: APIClient):
        self.client = client

    def get_analysis(self, workspace_id: str, product_id: str, analysis_id: str) -> AnalysisResponse:
        params = {
            "workspaceId": workspace_id,
            "productId": product_id,
            "analysisId": analysis_id
        }
        res = self.client.get("/analysis", params=params)
        return map_analysis_response(res)

    def analyze_reviews(self, workspace_id: str, product_id: str) -> AnalysisResponse:
        payload = {
            "workspaceId": workspace_id,
            "productId": product_id
        }
        res = self.client.post("/reviews/analyze", json=payload)
        return map_analysis_response(res)
