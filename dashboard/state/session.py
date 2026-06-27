import streamlit as st
from typing import Any, Optional, Dict

class SessionStateManager:
    @staticmethod
    def get(key: str, default: Any = None) -> Any:
        # st.session_state 가 initialize 안 된 경우 방어
        try:
            return st.session_state.get(key, default)
        except Exception:
            return default

    @staticmethod
    def set(key: str, value: Any) -> None:
        try:
            st.session_state[key] = value
        except Exception:
            pass

    @property
    def token(self) -> Optional[str]:
        return self.get("token")

    @token.setter
    def token(self, val: Optional[str]) -> None:
        self.set("token", val)

    @property
    def current_workspace_id(self) -> Optional[str]:
        return self.get("current_workspace_id")

    @current_workspace_id.setter
    def current_workspace_id(self, val: Optional[str]) -> None:
        self.set("current_workspace_id", val)

    @property
    def current_product_id(self) -> Optional[str]:
        return self.get("current_product_id")

    @current_product_id.setter
    def current_product_id(self, val: Optional[str]) -> None:
        self.set("current_product_id", val)

    @property
    def analysis_result(self) -> Optional[Any]:
        return self.get("analysis_result")

    @analysis_result.setter
    def analysis_result(self, val: Optional[Any]) -> None:
        self.set("analysis_result", val)

    @property
    def jtbd_result(self) -> Optional[Any]:
        return self.get("jtbd_result")

    @jtbd_result.setter
    def jtbd_result(self, val: Optional[Any]) -> None:
        self.set("jtbd_result", val)

    @property
    def strategy_result(self) -> Optional[Any]:
        return self.get("strategy_result")

    @strategy_result.setter
    def strategy_result(self, val: Optional[Any]) -> None:
        self.set("strategy_result", val)

    @property
    def creative_result(self) -> Optional[Any]:
        return self.get("creative_result")

    @creative_result.setter
    def creative_result(self, val: Optional[Any]) -> None:
        self.set("creative_result", val)

    @property
    def is_loading(self) -> bool:
        return self.get("is_loading", False)

    @is_loading.setter
    def is_loading(self, val: bool) -> None:
        self.set("is_loading", val)

    @property
    def error_message(self) -> Optional[str]:
        return self.get("error_message")

    @error_message.setter
    def error_message(self, val: Optional[str]) -> None:
        self.set("error_message", val)

    def clear(self) -> None:
        try:
            for key in list(st.session_state.keys()):
                if key != "theme":  # theme 설정 유지
                    del st.session_state[key]
        except Exception:
            pass
