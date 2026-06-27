from ..api import APIClient
from ..utils import map_strategy_response
from ..types import StrategyResponse

class StrategyService:
    def __init__(self, client: APIClient):
        self.client = client

    def get_product_strategy(self, workspace_id: str, product_id: str) -> StrategyResponse:
        params = {
            "workspaceId": workspace_id,
            "productId": product_id
        }
        res = self.client.get("/product-strategy", params=params)
        return map_strategy_response(res)
