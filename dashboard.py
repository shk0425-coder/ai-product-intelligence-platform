import streamlit as st
import pandas as pd
import requests
import plotly.express as px
import os
from dotenv import load_dotenv

# Import refactored dashboard modules per Sprint 4-5 specifications
from dashboard.api import APIClient
from dashboard.state import SessionStateManager
from dashboard.services import AnalysisService, JTBDService, StrategyService, CreativeService
from dashboard.components import render_loading, render_error, render_empty

# Load credentials
load_dotenv()

# Global Client and Service Layer Instantiations
client = APIClient()
# Auth token fallback from env
client.set_token(os.getenv("JWT_TOKEN", "mock-jwt-token"))

analysis_service = AnalysisService(client)
jtbd_service = JTBDService(client)
strategy_service = StrategyService(client)
creative_service = CreativeService(client)

state = SessionStateManager()

# Page configuration
st.set_page_config(
    page_title="AI Product Intelligence Dashboard",
    page_icon="📊",
    layout="wide",
)

# Sidebar setup for workspace and product selections
st.sidebar.title("🏢 Workspace Settings")
state.current_workspace_id = st.sidebar.text_input("Workspace UUID", value=state.current_workspace_id or "w-1234-uuid")
state.current_product_id = st.sidebar.text_input("Product UUID", value=state.current_product_id or "p-5678-uuid")

menu = st.sidebar.radio(
    "🧭 메뉴 이동",
    [
        "🔍 네이버 쇼핑 실시간 가격 분석",
        "🤖 AI 리뷰 분석 요약",
        "🎯 고객 결핍 & JTBD 상황 모델링",
        "💡 8단계 판매 스토리보드",
        "🎨 FLUX 이미지 프롬프트 빌더"
    ]
)

# Theme Toggle State
if "theme" not in st.session_state:
    st.session_state.theme = "dark"

def toggle_theme():
    st.session_state.theme = "light" if st.session_state.theme == "dark" else "dark"

IS_DARK = st.session_state.theme == "dark"

# Theme CSS
THEME_CSS = f"""
<style>
:root {{
    --bg: {"#09090b" if IS_DARK else "#ffffff"};
    --bg-subtle: {"#0c0c0f" if IS_DARK else "#f9fafb"};
    --card: {"#0c0c0f" if IS_DARK else "#ffffff"};
    --card-hover: {"#131316" if IS_DARK else "#f4f4f5"};
    --border: {"#1e1e24" if IS_DARK else "#e4e4e7"};
    --border-subtle: {"#16161a" if IS_DARK else "#f0f0f2"};
    --text: {"#fafafa" if IS_DARK else "#09090b"};
    --text-muted: #71717a;
    --text-dim: {"#52525b" if IS_DARK else "#a1a1aa"};
    --accent: #4f46e5;
    --accent-muted: #4338ca;
    --shadow: {"none" if IS_DARK else "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)"};
    --radius: 10px;
}}
html, body, [data-testid="stAppViewContainer"], [data-testid="stApp"], .main, .block-container, section[data-testid="stMain"] {{
    background-color: var(--bg) !important;
    color: var(--text) !important;
    font-family: 'DM Sans', -apple-system, sans-serif !important;
}}
.metric-card {{
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem 1.4rem;
    box-shadow: var(--shadow);
}}
.metric-label {{
    font-size: 0.78rem;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}}
.metric-value {{
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.03em;
    margin-top: 0.25rem;
}}
.chart-wrap {{
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow);
}}
.chart-header {{
    margin-bottom: 1.2rem;
}}
.chart-title {{
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
}}
.chart-subtitle {{
    font-size: 0.75rem;
    color: var(--text-dim);
}}
</style>
"""
st.markdown(THEME_CSS, unsafe_allow_html=True)

# Custom Metric Card helper
def custom_metric_card(label, value):
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">{label}</div>
        <div class="metric-value">{value}</div>
    </div>
    """, unsafe_allow_html=True)

# Plotly Layout Theming
PLOT_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="DM Sans, sans-serif", color="#71717a" if not IS_DARK else "#a1a1aa", size=11),
    margin=dict(l=40, r=20, t=10, b=40),
    xaxis=dict(
        gridcolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
        zerolinecolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
        tickfont=dict(size=10, color="#71717a" if not IS_DARK else "#a1a1aa"),
    ),
    yaxis=dict(
        gridcolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
        zerolinecolor="rgba(0,0,0,0.04)" if not IS_DARK else "rgba(255,255,255,0.04)",
        tickfont=dict(size=10, color="#71717a" if not IS_DARK else "#a1a1aa"),
    ),
)

# Header Section
head_left, head_right = st.columns([6, 1])
with head_left:
    st.markdown(f"""
    <div style="font-size: 1.5rem; font-weight: 700; color: var(--text);">
        📊 AI Product Intelligence <span>Dashboard</span>
    </div>
    """, unsafe_allow_html=True)
with head_right:
    theme_label = "☀️ Light" if IS_DARK else "🌙 Dark"
    st.button(theme_label, on_click=toggle_theme, use_container_width=True)

# Main Application Routing
if menu == "🔍 네이버 쇼핑 실시간 가격 분석":
    st.markdown("네이버 쇼핑 API를 활용하여 실시간으로 경쟁사 가격 및 브랜드 점유율 데이터를 분석합니다.")
    
    # Naver Shopping open API fetcher
    def fetch_naver_shopping(keyword, display=40):
        client_id = os.getenv("NAVER_CLIENT_ID", "여기에_CLIENT_ID_입력")
        client_secret = os.getenv("NAVER_CLIENT_SECRET", "여기에_CLIENT_SECRET_입력")
        url = "https://openapi.naver.com/v1/search/shop.json"
        headers = {"X-Naver-Client-Id": client_id, "X-Naver-Client-Secret": client_secret}
        params = {"query": keyword, "display": display, "sort": "sim"}
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            return response.json().get('items', []) if response.status_code == 200 else []
        except Exception:
            return []

    # Search UI
    col1, col2 = st.columns([4, 1])
    with col1:
        keyword = st.text_input("분석할 키워드를 입력하세요.", value="무선 이어폰")
    with col2:
        st.write("")
        st.write("")
        search_btn = st.button("분석 시작", use_container_width=True)

    if (search_btn or st.session_state.get('auto_run', True)) and keyword:
        st.session_state['auto_run'] = False
        with st.spinner('네이버 쇼핑 데이터를 수집하고 분석 중입니다...'):
            items = fetch_naver_shopping(keyword)
            if items:
                parsed_data = []
                for item in items:
                    title = item.get('title', '').replace('<b>', '').replace('</b>', '')
                    price = int(item.get('lprice', 0))
                    brand = item.get('brand') or item.get('maker') or item.get('mallName', '미지정')
                    link = item.get('link', '')
                    parsed_data.append({"상품명": title, "브랜드": brand, "가격": price, "링크": link})
                df = pd.DataFrame(parsed_data)
                
                st.write("")
                st.markdown(f"#### 🔍 '{keyword}' 상위 {len(df)}개 상품 지표 요약")
                metric_cols = st.columns(3)
                with metric_cols[0]:
                    custom_metric_card("평균 가격", f"{int(df['가격'].mean()):,}원")
                with metric_cols[1]:
                    custom_metric_card("최저 가격", f"{df['가격'].min():,}원")
                with metric_cols[2]:
                    custom_metric_card("최고 가격", f"{df['가격'].max():,}원")
                
                st.write("")
                chart_cols = st.columns(2)
                with chart_cols[0]:
                    st.markdown("""
                    <div class="chart-wrap">
                        <div class="chart-header">
                            <div class="chart-title">💰 가격대별 분포</div>
                        </div>
                    """, unsafe_allow_html=True)
                    fig_price = px.histogram(df, x="가격", nbins=10, color_discrete_sequence=['#4F46E5'])
                    fig_price.update_layout(xaxis_title="가격대 (원)", yaxis_title="상품 수", **PLOT_LAYOUT)
                    st.plotly_chart(fig_price, use_container_width=True)
                    st.markdown("</div>", unsafe_allow_html=True)
                with chart_cols[1]:
                    st.markdown("""
                    <div class="chart-wrap">
                        <div class="chart-header">
                            <div class="chart-title">👑 상위 브랜드 점유율</div>
                        </div>
                    """, unsafe_allow_html=True)
                    brand_counts = df['브랜드'].value_counts().reset_index()
                    brand_counts.columns = ['브랜드', '상품 수']
                    fig_brand = px.pie(brand_counts, names='브랜드', values='상품 수', hole=0.4)
                    fig_brand.update_layout(showlegend=True, **PLOT_LAYOUT)
                    fig_brand.update_layout(margin=dict(l=0, r=0, t=10, b=0))
                    st.plotly_chart(fig_brand, use_container_width=True)
                    st.markdown("</div>", unsafe_allow_html=True)
            else:
                st.error("데이터를 불러오지 못했습니다.")

elif menu == "🤖 AI 리뷰 분석 요약":
    from dashboard.pages import render_analysis_page
    render_analysis_page(analysis_service, state)

elif menu == "🎯 고객 결핍 & JTBD 상황 모델링":
    from dashboard.pages import render_jtbd_page
    render_jtbd_page(jtbd_service, state)

elif menu == "💡 8단계 판매 스토리보드":
    from dashboard.pages import render_strategy_page
    render_strategy_page(strategy_service, state)

elif menu == "🎨 FLUX 이미지 프롬프트 빌더":
    from dashboard.pages import render_creative_page
    render_creative_page(creative_service, state)
