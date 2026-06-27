import streamlit as st
from ..services import CreativeService
from ..state import SessionStateManager
from ..components import render_section_header, render_error, render_empty, render_image_card

def render_creative_page(service: CreativeService, state: SessionStateManager):
    render_section_header("🎨 FLUX 이미지 생성 프롬프트 빌더", "8단계 스토리보드 장면에 맞춰 정밀 조율된 FLUX 전용 씬 이미지 프롬프트 명세서입니다.")
    
    workspace_id = state.current_workspace_id
    product_id = state.current_product_id
    
    if not workspace_id or not product_id:
        render_empty("워크스페이스와 상품을 먼저 선택해주세요.")
        return
    
    if st.button("이미지 프롬프트 명세 생성/가져오기"):
        state.is_loading = True
        state.error_message = None
        try:
            result = service.get_creative_brief(workspace_id, product_id)
            state.creative_result = result
        except Exception as e:
            state.error_message = str(e)
        finally:
            state.is_loading = False

    if state.error_message:
        render_error(state.error_message)

    creative = state.creative_result
    if creative:
        scenes = creative.get("scenes", [])
        for scene in scenes:
            render_image_card(scene)
