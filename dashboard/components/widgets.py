import streamlit as st
from typing import List, Dict, Any, Optional

def render_loading(text: str = "데이터를 불러오는 중입니다..."):
    return st.spinner(text)

def render_error(message: str):
    st.error(message)

def render_empty(text: str = "수집된 데이터가 없습니다."):
    st.info(text)

def render_status(status_text: str, status_type: str = "info"):
    if status_type == "success":
        st.success(status_text)
    elif status_type == "warning":
        st.warning(status_text)
    elif status_type == "error":
        st.error(status_text)
    else:
        st.info(status_text)

def render_section_header(title: str, subtitle: Optional[str] = None):
    st.markdown(f"### {title}")
    if subtitle:
        st.markdown(f"<span style='color: gray; font-size: 0.85em;'>{subtitle}</span>", unsafe_allow_html=True)
    st.write("")

def render_storyboard_card(step: Dict[str, Any]):
    current_emotion = step.get("customerEmotion", {}).get("current", "")
    desired_emotion = step.get("customerEmotion", {}).get("desired", "")
    question = step.get("customerQuestion", {}).get("question", "")
    answer = step.get("customerQuestion", {}).get("answer", "")
    hook = step.get("sellingPoint", {}).get("hook", "")
    desc = step.get("sellingPoint", {}).get("description", "")
    visual = step.get("recommendedContent", {}).get("visualLayout", "")
    copywriting: List[str] = step.get("recommendedContent", {}).get("copywriting", [])
    
    st.markdown(f"""
    <div style="border: 1px solid #1e1e24; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; background: #0c0c0f;">
        <h4 style="margin: 0; color: #4f46e5;">Step {step.get('step')}: {step.get('name')}</h4>
        <p style="font-weight: bold; font-size: 1.1em; margin: 0.5rem 0;">{step.get('title')}</p>
        <p style="color: #71717a; font-size: 0.9em; margin-bottom: 0.75rem;"><strong>목표:</strong> {step.get('objective')}</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.88em; border-top: 1px solid #1e1e24; padding-top: 0.75rem;">
            <div>
                <p><strong>🎯 고객 감정 변화</strong><br/>
                현재: {current_emotion}<br/>
                원함: {desired_emotion}</p>
                <p><strong>❓ 핵심 질문 & 답변</strong><br/>
                Q: {question}<br/>
                A: {answer}</p>
            </div>
            <div>
                <p><strong>💡 셀링 포인트 (USP)</strong><br/>
                훅: {hook}<br/>
                설명: {desc}</p>
                <p><strong>🖼️ 추천 비주얼 및 카피</strong><br/>
                레이아웃: {visual}<br/>
                카피: {', '.join(copywriting)}</p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_image_card(scene: Dict[str, Any]):
    style = scene.get("style", {})
    comp = scene.get("composition", {})
    cam = scene.get("cameraAngle", {})
    light = scene.get("lighting", {})
    
    st.markdown(f"""
    <div style="border: 1px solid #1e1e24; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; background: #0c0c0f;">
        <h4 style="margin: 0; color: #10b981;">Scene {scene.get('step')}: {scene.get('name')}</h4>
        <p style="font-weight: bold; font-size: 1.1em; margin: 0.5rem 0;">{scene.get('title')}</p>
        
        <div style="background: #131316; border-radius: 6px; padding: 0.75rem; margin: 0.75rem 0; font-family: monospace; font-size: 0.85em; color: #a1a1aa;">
            <strong>Prompt:</strong> {scene.get('imagePrompt')}<br/><br/>
            <strong>Negative:</strong> {scene.get('negativePrompt')}
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.88em;">
            <div>
                <strong>🎨 스타일:</strong> {style.get('styleName')} ({', '.join(style.get('elements', []))})<br/>
                <strong>📐 구도:</strong> {comp.get('focus')} (3분할법: {'Yes' if comp.get('ruleOfThirds') else 'No'})
            </div>
            <div>
                <strong>🎥 카메라 앵글:</strong> {cam.get('angle')} / {cam.get('shotType')}<br/>
                <strong>💡 조명 & 분위기:</strong> {light.get('type')} / {light.get('mood')}
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
