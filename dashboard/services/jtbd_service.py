from ..api import APIClient
from ..utils import map_jtbd_response
from ..types import JTBDResponse

class JTBDService:
    def __init__(self, client: APIClient):
        self.client = client

    def get_jtbd_analysis(self, workspace_id: str, product_id: str) -> JTBDResponse:
        params = {
            "workspaceId": workspace_id,
            "productId": product_id
        }
        res = self.client.get("/jtbd", params=params)
        return map_jtbd_response(res)
