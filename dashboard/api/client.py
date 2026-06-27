import requests
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from typing import Dict, Any, Optional
from ..constants import API_BASE_URL, TIMEOUT, RETRY_LIMIT

# Custom Exception Classes
class DashboardAPIError(Exception):
    def __init__(self, status_code: int, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.message = message

class BadRequestError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(400, message)

class UnauthorizedError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(401, message)

class ForbiddenError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(403, message)

class NotFoundError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(404, message)

class RateLimitError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(429, message)

class ServerError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(500, message)

class NetworkError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(0, message)

class TimeoutError(DashboardAPIError):
    def __init__(self, message: str):
        super().__init__(0, message)

class APIClient:
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url.rstrip('/')
        self.token: Optional[str] = None

    def set_token(self, token: Optional[str]) -> None:
        self.token = token

    def _get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    @retry(
        stop=stop_after_attempt(RETRY_LIMIT),
        wait=wait_exponential(multiplier=0.1, min=0.2, max=1),
        retry=retry_if_exception_type((requests.exceptions.Timeout, requests.exceptions.ConnectionError)),
        reraise=True
    )
    def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.request(
                method,
                url,
                headers=self._get_headers(),
                params=params,
                json=json,
                timeout=TIMEOUT
            )
            self._handle_response_error(response)
            return response.json() if response.content else {}
        except requests.exceptions.Timeout as e:
            raise TimeoutError("Request timed out") from e
        except requests.exceptions.ConnectionError as e:
            raise NetworkError("Network connection failed") from e
        except requests.exceptions.RequestException as e:
            raise NetworkError(f"HTTP request failed: {e}") from e

    def _handle_response_error(self, response: requests.Response) -> None:
        if response.status_code >= 400:
            msg = response.text or f"HTTP Error {response.status_code}"
            if response.status_code == 400:
                raise BadRequestError(msg)
            elif response.status_code == 401:
                raise UnauthorizedError(msg)
            elif response.status_code == 403:
                raise ForbiddenError(msg)
            elif response.status_code == 404:
                raise NotFoundError(msg)
            elif response.status_code == 429:
                raise RateLimitError(msg)
            elif response.status_code >= 500:
                raise ServerError(msg)
            else:
                raise DashboardAPIError(response.status_code, msg)

    def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self._request("GET", endpoint, params=params)

    def post(self, endpoint: str, json: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self._request("POST", endpoint, json=json)
