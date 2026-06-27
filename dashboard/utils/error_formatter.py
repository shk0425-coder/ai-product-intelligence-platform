from dashboard.constants import ERROR_MESSAGES
from dashboard.api import DashboardAPIError, TimeoutError

def format_error(error: Exception) -> str:
    if isinstance(error, TimeoutError):
        return ERROR_MESSAGES["TIMEOUT_ERROR"]
        
    if isinstance(error, DashboardAPIError):
        if str(error.status_code) in ERROR_MESSAGES:
            return ERROR_MESSAGES[str(error.status_code)]
        elif error.status_code == 0:
            return ERROR_MESSAGES["NETWORK_ERROR"]
    
    return ERROR_MESSAGES["UNKNOWN_ERROR"]
