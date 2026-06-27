import pytest
import requests_mock
import time
from unittest.mock import MagicMock
import streamlit as st

from dashboard.api import (
    APIClient,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    RateLimitError,
    ServerError,
    NetworkError,
    TimeoutError,
    DashboardAPIError,
)
from dashboard.services import (
    AnalysisService,
    JTBDService,
    StrategyService,
    CreativeService,
)
from dashboard.cache import DashboardCache
from dashboard.state import SessionStateManager
from dashboard.utils import format_error, generate_cache_key
from dashboard.pages import (
    render_analysis_page,
    render_jtbd_page,
    render_strategy_page,
    render_creative_page,
)

# 1. API Client Tests
def test_client_request_success():
    client = APIClient("http://fakeapi.com")
    client.set_token("token-123")
    
    with requests_mock.Mocker() as m:
        m.get("http://fakeapi.com/test", json={"status": "ok"})
        res = client.get("/test")
        assert res == {"status": "ok"}
        assert m.last_request.headers["Authorization"] == "Bearer token-123"

def test_client_post_success():
    client = APIClient("http://fakeapi.com")
    with requests_mock.Mocker() as m:
        m.post("http://fakeapi.com/test-post", json={"status": "created"})
        res = client.post("/test-post", json={"data": 123})
        assert res == {"status": "created"}

def test_client_errors():
    client = APIClient("http://fakeapi.com")
    with requests_mock.Mocker() as m:
        m.get("http://fakeapi.com/400", status_code=400, text="Bad Request")
        with pytest.raises(BadRequestError):
            client.get("/400")

        m.get("http://fakeapi.com/401", status_code=401, text="Unauthorized")
        with pytest.raises(UnauthorizedError):
            client.get("/401")

        m.get("http://fakeapi.com/403", status_code=403, text="Forbidden")
        with pytest.raises(ForbiddenError):
            client.get("/403")

        m.get("http://fakeapi.com/404", status_code=404, text="Not Found")
        with pytest.raises(NotFoundError):
            client.get("/404")

        m.get("http://fakeapi.com/429", status_code=429, text="Too Many Requests")
        with pytest.raises(RateLimitError):
            client.get("/429")

        m.get("http://fakeapi.com/500", status_code=500, text="Internal Server Error")
        with pytest.raises(ServerError):
            client.get("/500")

        m.get("http://fakeapi.com/418", status_code=418, text="I'm a teapot")
        with pytest.raises(DashboardAPIError) as exc_info:
            client.get("/418")
        assert exc_info.value.status_code == 418

def test_client_network_and_timeout_errors():
    import requests
    client = APIClient("http://fakeapi.com")
    
    # Force timeout
    with requests_mock.Mocker() as m:
        m.get("http://fakeapi.com/timeout", exc=requests.exceptions.Timeout)
        with pytest.raises(TimeoutError):
            client.get("/timeout")

    # Force connection error
    with requests_mock.Mocker() as m:
        m.get("http://fakeapi.com/conn-error", exc=requests.exceptions.ConnectionError)
        with pytest.raises(NetworkError):
            client.get("/conn-error")

    # Force general request exception
    with requests_mock.Mocker() as m:
        m.get("http://fakeapi.com/gen-error", exc=requests.exceptions.RequestException)
        with pytest.raises(NetworkError):
            client.get("/gen-error")

# 2. Service Layer Tests
def test_analysis_service():
    mock_client = MagicMock(spec=APIClient)
    mock_client.get.return_value = {
        "summary": "good",
        "strengths": ["power"],
        "weaknesses": ["smell"],
        "complaints": ["smell fix"],
        "jtbd": ["drink"],
        "keywords": ["cup"],
        "sentiment": {"positive": 80, "neutral": 10, "negative": 10}
    }
    mock_client.post.return_value = mock_client.get.return_value
    
    service = AnalysisService(mock_client)
    res1 = service.get_analysis("w1", "p1", "a1")
    res2 = service.analyze_reviews("w1", "p1")
    
    assert res1["summary"] == "good"
    assert res2["sentiment"]["positive"] == 80

def test_jtbd_service():
    mock_client = MagicMock(spec=APIClient)
    mock_client.get.return_value = {
        "jtbd": [{"situation": "s1", "coreJob": "j1", "emotionalOutcome": "o1"}],
        "painPoints": [{"category": "c1", "description": "d1", "severity": "HIGH"}],
        "desiredOutcomes": [],
        "purchaseMotivation": [],
        "purchaseBarrier": [],
        "usageContext": [],
        "customerSegments": [],
        "unexpectedInsights": []
    }
    service = JTBDService(mock_client)
    res = service.get_jtbd_analysis("w1", "p1")
    assert len(res["jtbd"]) == 1
    assert res["painPoints"][0]["category"] == "c1"

def test_strategy_service():
    mock_client = MagicMock(spec=APIClient)
    mock_client.get.return_value = {
        "productName": "pname",
        "keyword": "kw",
        "storyboard": {
            "steps": [
                {
                    "step": 1,
                    "type": "Attention",
                    "name": "Attention",
                    "title": "t1",
                    "objective": "obj1",
                    "customerEmotion": {"current": "c", "desired": "d"},
                    "customerQuestion": {"question": "q", "answer": "a"},
                    "sellingPoint": {"hook": "h", "description": "desc"},
                    "recommendedContent": {"visualLayout": "v", "copywriting": ["cp1"]},
                    "cta": {"buttonText": "btn", "actionUrlPlaceholder": "url"}
                }
            ]
        }
    }
    service = StrategyService(mock_client)
    res = service.get_product_strategy("w1", "p1")
    assert res["productName"] == "pname"
    assert res["storyboard"]["steps"][0]["cta"]["buttonText"] == "btn"

def test_creative_service():
    mock_client = MagicMock(spec=APIClient)
    mock_client.get.return_value = {
        "productName": "pname",
        "keyword": "kw",
        "scenes": [
            {
                "step": 1,
                "name": "Attention",
                "title": "t1",
                "imagePrompt": "prompt1",
                "negativePrompt": "neg1",
                "style": {"styleName": "style1", "elements": ["el1"]},
                "composition": {"focus": "f1", "ruleOfThirds": True},
                "cameraAngle": {"angle": "a1", "shotType": "s1"},
                "lighting": {"type": "l1", "mood": "m1"}
            }
        ]
    }
    service = CreativeService(mock_client)
    res = service.get_creative_brief("w1", "p1")
    assert res["scenes"][0]["imagePrompt"] == "prompt1"

# 3. Cache Tests
def test_cache_hit_and_ttl():
    cache = DashboardCache(ttl=1)
    cache.set("w1", "p1", "a1", "cached-data")
    assert cache.get("w1", "p1", "a1") == "cached-data"
    
    time.sleep(1.1)
    assert cache.get("w1", "p1", "a1") is None

def test_cache_invalidation_and_clear():
    cache = DashboardCache(ttl=60)
    cache.set("w1", "p1", "a1", "cached-data")
    cache.invalidate("w1", "p1", "a1")
    assert cache.get("w1", "p1", "a1") is None

    cache.set("w1", "p1", "a1", "cached-data")
    cache.clear()
    assert cache.get("w1", "p1", "a1") is None

# 4. State Wrapper Tests
def test_session_state_wrapper():
    st.session_state = {}
    state = SessionStateManager()
    
    # Test setting and getting
    state.token = "tok"
    assert state.token == "tok"
    assert st.session_state["token"] == "tok"

    state.current_workspace_id = "ws"
    assert state.current_workspace_id == "ws"

    state.current_product_id = "prod"
    assert state.current_product_id == "prod"

    state.analysis_result = {"res": 1}
    assert state.analysis_result == {"res": 1}

    state.jtbd_result = {"res": 2}
    assert state.jtbd_result == {"res": 2}

    state.strategy_result = {"res": 3}
    assert state.strategy_result == {"res": 3}

    state.creative_result = {"res": 4}
    assert state.creative_result == {"res": 4}

    state.is_loading = True
    assert state.is_loading is True

    state.error_message = "err"
    assert state.error_message == "err"

    state.clear()
    assert state.token is None
    assert state.is_loading is False

# 5. Utils & Formatter Tests
def test_utils_and_formatter():
    assert generate_cache_key("w", "p", "a") == "w:p:a"
    
    # Test format error
    assert "네트워크" in format_error(NetworkError("net"))
    assert "시간" in format_error(TimeoutError("time"))
    assert "잘못된" in format_error(BadRequestError("bad"))
    assert "인증" in format_error(UnauthorizedError("unauth"))
    assert "권한" in format_error(ForbiddenError("forbidden"))
    assert "찾을" in format_error(NotFoundError("notfound"))
    assert "한도" in format_error(RateLimitError("ratelimit"))
    assert "서버" in format_error(ServerError("server"))
    assert "알 수 없는" in format_error(Exception("unknown"))

# 6. UI Page Tests (Mock Rendering)
def test_render_analysis_page(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "markdown", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "write", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "columns", lambda *args, **kwargs: [MagicMock(), MagicMock()])
    
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=AnalysisService)
    mock_service.analyze_reviews.return_value = {
        "summary": "excellent",
        "strengths": ["s"],
        "weaknesses": ["w"],
        "complaints": [],
        "jtbd": [],
        "keywords": [],
        "sentiment": {}
    }
    state = SessionStateManager()
    render_analysis_page(mock_service, state)
    assert state.analysis_result["summary"] == "excellent"

def test_render_analysis_page_empty(monkeypatch):
    monkeypatch.setattr(st, "info", lambda *args, **kwargs: None)
    st.session_state = {}
    state = SessionStateManager()
    render_analysis_page(MagicMock(), state)

def test_render_jtbd_page(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "markdown", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "write", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "columns", lambda *args, **kwargs: [MagicMock(), MagicMock()])
    
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=JTBDService)
    mock_service.get_jtbd_analysis.return_value = {
        "jtbd": [{"situation": "sit", "coreJob": "job", "emotionalOutcome": "out"}],
        "painPoints": [{"severity": "HIGH", "category": "cat", "description": "desc"}],
        "desiredOutcomes": [{"priority": "HIGH", "outcome": "out"}]
    }
    state = SessionStateManager()
    render_jtbd_page(mock_service, state)
    assert len(state.jtbd_result["jtbd"]) == 1

def test_render_jtbd_page_empty(monkeypatch):
    monkeypatch.setattr(st, "info", lambda *args, **kwargs: None)
    st.session_state = {}
    state = SessionStateManager()
    render_jtbd_page(MagicMock(), state)

def test_render_strategy_page(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "markdown", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "write", lambda *args, **kwargs: None)
    
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=StrategyService)
    mock_service.get_product_strategy.return_value = {
        "productName": "name",
        "keyword": "kw",
        "storyboard": {
            "steps": [
                {
                    "step": 1,
                    "type": "Attention",
                    "name": "Attention",
                    "title": "title",
                    "objective": "obj",
                    "customerEmotion": {"current": "c", "desired": "d"},
                    "customerQuestion": {"question": "q", "answer": "a"},
                    "sellingPoint": {"hook": "h", "description": "desc"},
                    "recommendedContent": {"visualLayout": "v", "copywriting": ["cp"]}
                }
            ]
        }
    }
    state = SessionStateManager()
    render_strategy_page(mock_service, state)
    assert state.strategy_result["productName"] == "name"

def test_render_strategy_page_empty(monkeypatch):
    monkeypatch.setattr(st, "info", lambda *args, **kwargs: None)
    st.session_state = {}
    state = SessionStateManager()
    render_strategy_page(MagicMock(), state)

def test_render_creative_page(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "markdown", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "write", lambda *args, **kwargs: None)
    
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=CreativeService)
    mock_service.get_creative_brief.return_value = {
        "productName": "name",
        "keyword": "kw",
        "scenes": [
            {
                "step": 1,
                "name": "Attention",
                "title": "title",
                "imagePrompt": "prompt",
                "negativePrompt": "neg",
                "style": {"styleName": "style", "elements": []},
                "composition": {"focus": "f", "ruleOfThirds": True},
                "cameraAngle": {"angle": "a", "shotType": "s"},
                "lighting": {"type": "l", "mood": "m"}
            }
        ]
    }
    state = SessionStateManager()
    render_creative_page(mock_service, state)
    assert state.creative_result["productName"] == "name"

def test_render_creative_page_empty(monkeypatch):
    monkeypatch.setattr(st, "info", lambda *args, **kwargs: None)
    st.session_state = {}
    state = SessionStateManager()
    render_creative_page(MagicMock(), state)

# 7. widgets.py 100% Coverage Tests
def test_widgets_all_functions(monkeypatch):
    from dashboard.components.widgets import (
        render_loading,
        render_error,
        render_empty,
        render_status,
        render_section_header,
        render_storyboard_card,
        render_image_card,
    )
    monkeypatch.setattr(st, "spinner", lambda *args, **kwargs: "loading")
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "info", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "success", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "warning", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "markdown", lambda *args, **kwargs: None)
    monkeypatch.setattr(st, "write", lambda *args, **kwargs: None)

    assert render_loading("test") == "loading"
    render_error("test error")
    render_empty("empty")
    render_status("ok", "success")
    render_status("warn", "warning")
    render_status("err", "error")
    render_status("info", "info")
    render_section_header("title", "subtitle")
    render_section_header("title", None)
    render_storyboard_card({})
    render_image_card({})

# 8. state/session.py Exception Coverage Tests
def test_session_state_exceptions(monkeypatch):
    class ErrorState:
        def get(self, *args, **kwargs):
            raise Exception("Force streamlit session_state error")
        def __setitem__(self, key, value):
            raise Exception("Force error")
        @property
        def keys(self):
            raise Exception("Force error")

    monkeypatch.setattr(st, "session_state", ErrorState())

    state = SessionStateManager()
    assert state.token is None
    state.token = "val"
    state.clear()

# 9. Page Exception Coverage Tests
def test_render_analysis_page_exception(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=AnalysisService)
    mock_service.analyze_reviews.side_effect = Exception("Analysis failed")
    state = SessionStateManager()
    render_analysis_page(mock_service, state)
    assert state.error_message == "Analysis failed"

def test_render_jtbd_page_exception(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=JTBDService)
    mock_service.get_jtbd_analysis.side_effect = Exception("JTBD failed")
    state = SessionStateManager()
    render_jtbd_page(mock_service, state)
    assert state.error_message == "JTBD failed"

def test_render_strategy_page_exception(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=StrategyService)
    mock_service.get_product_strategy.side_effect = Exception("Strategy failed")
    state = SessionStateManager()
    render_strategy_page(mock_service, state)
    assert state.error_message == "Strategy failed"

def test_render_creative_page_exception(monkeypatch):
    monkeypatch.setattr(st, "button", lambda *args, **kwargs: True)
    monkeypatch.setattr(st, "error", lambda *args, **kwargs: None)
    st.session_state = {
        "current_workspace_id": "w1",
        "current_product_id": "p1"
    }
    mock_service = MagicMock(spec=CreativeService)
    mock_service.get_creative_brief.side_effect = Exception("Creative failed")
    state = SessionStateManager()
    render_creative_page(mock_service, state)
    assert state.error_message == "Creative failed"


