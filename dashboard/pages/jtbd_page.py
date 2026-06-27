import streamlit as st
from ..services import JTBDService
from ..state import SessionStateManager
from ..components import render_section_header, render_error, render_empty

def render_jtbd_page(service: JTBDService, state: SessionStateManager):
    render_section_header("🎯 고객 결핍 & JTBD 상황 모델링", "고객들이 제품을 사용하는 정황적 맥락과 결핍(PainPoints), 기대하는 유익(Outcomes)을 추출합니다.")
    
    workspace_id = state.current_workspace_id
    product_id = state.current_product_id
    
    if not workspace_id or not product_id:
        render_empty("워크스페이스와 상품을 먼저 선택해주세요.")
        return
    
    if st.button("JTBD 분석 가져오기"):
        state.is_loading = True
        state.error_message = None
        try:
            result = service.get_jtbd_analysis(workspace_id, product_id)
            state.jtbd_result = result
        except Exception as e:
            state.error_message = str(e)
        finally:
            state.is_loading = False

    if state.error_message:
        render_error(state.error_message)

    jtbd = state.jtbd_result
    if jtbd:
        # JTBD Situations
        st.markdown("#### 🏃‍♂️ Core Job & 상황 맥락 (JTBD)")
        for j in jtbd.get('jtbd', []):
            st.markdown(f"- **상황:** {j.get('situation')}")
            st.markdown(f"  * **핵심 과업:** {j.get('coreJob')}")
            st.markdown(f"  * **감정적 결과:** {j.get('emotionalOutcome')}")
        
        st.write("")
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("#### ⚠️ 페인 포인트 (Pain Points)")
            for p in jtbd.get('painPoints', []):
                st.markdown(f"- [{p.get('severity')}] {p.get('category')}: {p.get('description')}")
        with col2:
            st.markdown("#### ✨ 기대 유익 (Desired Outcomes)")
            for d in jtbd.get('desiredOutcomes', []):
                st.markdown(f"- [{d.get('priority')}] {d.get('outcome')}")
