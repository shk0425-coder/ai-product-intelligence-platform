import streamlit as st
from ..services import StrategyService
from ..state import SessionStateManager
from ..components import render_section_header, render_error, render_empty, render_storyboard_card

def render_strategy_page(service: StrategyService, state: SessionStateManager):
    render_section_header("💡 상세페이지 8단계 판매 스토리보드", "룰 엔진과 JTBD 분석 결과를 바탕으로 도출된 고전환 8단계 전략 시나리오입니다.")
    
    workspace_id = state.current_workspace_id
    product_id = state.current_product_id
    
    if not workspace_id or not product_id:
        render_empty("워크스페이스와 상품을 먼저 선택해주세요.")
        return
    
    if st.button("스토리보드 생성/가져오기"):
        state.is_loading = True
        state.error_message = None
        try:
            result = service.get_product_strategy(workspace_id, product_id)
            state.strategy_result = result
        except Exception as e:
            state.error_message = str(e)
        finally:
            state.is_loading = False

    if state.error_message:
        render_error(state.error_message)

    strategy = state.strategy_result
    if strategy:
        storyboard = strategy.get("storyboard", {})
        steps = storyboard.get("steps", [])
        for step in steps:
            render_storyboard_card(step)
