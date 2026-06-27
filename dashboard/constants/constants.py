import os

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000/api/v1")
TIMEOUT = 10  # seconds
RETRY_LIMIT = 3
CACHE_TTL = 300  # 5 minutes

UI_LABELS = {
    "平均価格": "평균 가격",
    "最低価格": "최저 가격",
    "最高価格": "최고 가격",
    "LOADING_TEXT": "데이터를 불러오는 중입니다...",
    "EMPTY_TEXT": "수집된 데이터가 없습니다.",
}

ERROR_MESSAGES = {
    "NETWORK_ERROR": "네트워크 연결에 실패했습니다. 백엔드 서버 상태를 확인해주세요.",
    "TIMEOUT_ERROR": "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
    "400": "잘못된 요청입니다. 입력값을 확인해주세요.",
    "401": "인증에 실패했습니다. 로그인 세션을 확인해주세요.",
    "403": "해당 권한이 없습니다.",
    "404": "요청한 리소스를 찾을 수 없습니다.",
    "429": "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
    "500": "서버 내부 오류가 발생했습니다. 백엔드 로그를 확인해주세요.",
    "UNKNOWN_ERROR": "알 수 없는 오류가 발생했습니다.",
}
