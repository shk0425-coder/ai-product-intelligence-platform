import streamlit as st
from ..services import AnalysisService
from ..state import SessionStateManager
from ..components import render_section_header, render_error, render_empty

def render_analysis_page(service: AnalysisService, state: SessionStateManager):
    render_section_header("🤖 AI 리뷰 감성 & 요약 분석", "리뷰 원본 데이터를 기반으로 강점, 약점, 고객 결핍 핵심 키워드를 종합 도출합니다.")
    
    workspace_id = state.current_workspace_id
    product_id = state.current_product_id
    
    if not workspace_id or not product_id:
        render_empty("워크스페이스와 상품을 먼저 선택해주세요.")
        return
    
    if st.button("AI 리뷰 분석 실행"):
        state.is_loading = True
        state.error_message = None
        try:
            result = service.analyze_reviews(workspace_id, product_id)
            state.analysis_result = result
        except Exception as e:
            state.error_message = str(e)
        finally:
            state.is_loading = False

    if state.error_message:
        render_error(state.error_message)

    analysis = state.analysis_result
    if analysis:
        st.markdown(f"**요약:** {analysis.get('summary')}")
        st.write("")
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("**👍 강점 (Strengths)**")
            for s in analysis.get('strengths', []):
                st.markdown(f"- {s}")
        with col2:
            st.markdown("**👎 약점 (Weaknesses)**")
            for w in analysis.get('weaknesses', []):
                st.markdown(f"- {w}")
        
        st.write("")
        sentiment = analysis.get('sentiment', {})
        st.markdown(f"**📊 긍정 감성 비율:** {sentiment.get('positive', 0)}% / 부정: {sentiment.get('negative', 0)}% / 중립: {sentiment.get('neutral', 0)}%")
