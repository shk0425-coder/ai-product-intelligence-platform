from ..api import APIClient
from ..utils import map_creative_response
from ..types import CreativeResponse

class CreativeService:
    def __init__(self, client: APIClient):
        self.client = client

    def get_creative_brief(self, workspace_id: str, product_id: str) -> CreativeResponse:
        params = {
            "workspaceId": workspace_id,
            "productId": product_id
        }
        res = self.client.get("/creative", params=params)
        return map_creative_response(res)
