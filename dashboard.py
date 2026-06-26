import streamlit as st
import pandas as pd
import requests
import plotly.express as px
import os
import re

from dotenv import load_dotenv

# Load Naver API credentials from .env
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="시장 분석 대시보드",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Theme Toggle State
if "theme" not in st.session_state:
    st.session_state.theme = "dark"

def toggle_theme():
    st.session_state.theme = "light" if st.session_state.theme == "dark" else "dark"

IS_DARK = st.session_state.theme == "dark"

# CSS Variables mapping based on theme
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

/* Hide default Streamlit chrome */
header[data-testid="stHeader"], #MainMenu, footer, [data-testid="stToolbar"],
[data-testid="stDecoration"], [data-testid="stStatusWidget"], .stDeployButton,
div[data-testid="stSidebarCollapsedControl"] {{
    display: none !important;
}}

/* Global app styling */
html, body, [data-testid="stAppViewContainer"], [data-testid="stApp"], .main, .block-container, section[data-testid="stMain"] {{
    background-color: var(--bg) !important;
    color: var(--text) !important;
    font-family: 'DM Sans', -apple-system, sans-serif !important;
}}
.block-container {{
    padding: 2rem 2.5rem 3rem !important;
    max-width: 1360px !important;
}}

/* Column spacing */
[data-testid="stHorizontalBlock"] {{
    gap: 1.25rem !important;
}}

/* Brand header design */
.brand-container {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
}}
.brand {{
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
}}
.brand span {{
    color: var(--accent);
}}

/* Metric Card design */
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

/* Chart Container design */
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
    st.markdown("""
    <div class="brand">
        📊 키워드 기반 <span>시장 분석 대시보드</span>
    </div>
    """, unsafe_allow_html=True)
with head_right:
    theme_label = "☀️ Light" if IS_DARK else "🌙 Dark"
    st.button(theme_label, on_click=toggle_theme, use_container_width=True)

st.markdown("네이버 쇼핑 API를 활용하여 실시간으로 경쟁사 가격 및 브랜드 점유율 데이터를 분석합니다.")

# Naver Shopping API Fetcher
def fetch_naver_shopping(keyword, display=40):
    client_id = os.getenv("NAVER_CLIENT_ID", "여기에_CLIENT_ID_입력")
    client_secret = os.getenv("NAVER_CLIENT_SECRET", "여기에_CLIENT_SECRET_입력")
    
    url = "https://openapi.naver.com/v1/search/shop.json"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret
    }
    params = {"query": keyword, "display": display, "sort": "sim"}
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            return response.json().get('items', [])
        else:
            st.error(f"Naver API Error (Status: {response.status_code})")
            return []
    except Exception as e:
        st.error(f"Connection Error: {e}")
        return []

# Search UI
col1, col2 = st.columns([4, 1])
with col1:
    keyword = st.text_input("분석할 키워드를 입력하세요.", value="무선 이어폰")
with col2:
    st.write("")
    st.write("")
    search_btn = st.button("분석 시작", use_container_width=True)

# Run Analysis
if (search_btn or st.session_state.get('auto_run', True)) and keyword:
    st.session_state['auto_run'] = False
    
    with st.spinner('네이버 쇼핑 데이터를 수집하고 분석 중입니다...'):
        items = fetch_naver_shopping(keyword)
        
        if items:
            # Parse Data
            parsed_data = []
            for item in items:
                title = item.get('title', '').replace('<b>', '').replace('</b>', '')
                price = int(item.get('lprice', 0))
                brand = item.get('brand') or item.get('maker') or item.get('mallName', '미지정')
                link = item.get('link', '')
                product_id = item.get('productId', '')
                
                parsed_data.append({
                    "상품명": title,
                    "브랜드": brand,
                    "가격": price,
                    "링크": link,
                    "productId": product_id
                })
            
            df = pd.DataFrame(parsed_data)
            
            # --- 1. Summary Cards ---
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
            st.write("")
            
            # --- 2. Chart Layout ---
            chart_cols = st.columns(2)
            
            # Histogram Chart
            with chart_cols[0]:
                st.markdown(f"""
                <div class="chart-wrap">
                    <div class="chart-header">
                        <div class="chart-title">💰 가격대별 분포</div>
                        <div class="chart-subtitle">수집된 상품의 가격대별 빈도 분포를 분석합니다.</div>
                    </div>
                """, unsafe_allow_html=True)
                
                fig_price = px.histogram(
                    df, 
                    x="가격", 
                    nbins=10, 
                    color_discrete_sequence=['#4F46E5' if IS_DARK else '#312E81']
                )
                fig_price.update_layout(
                    xaxis_title="가격대 (원)",
                    yaxis_title="상품 수",
                    **PLOT_LAYOUT
                )
                st.plotly_chart(fig_price, use_container_width=True, config={"displayModeBar": False})
                st.markdown("</div>", unsafe_allow_html=True)
                
            # Pie Chart
            with chart_cols[1]:
                st.markdown(f"""
                <div class="chart-wrap">
                    <div class="chart-header">
                        <div class="chart-title">👑 상위 브랜드 점유율</div>
                        <div class="chart-subtitle">어떤 브랜드가 검색 상위를 차지하는지 비율을 시각화합니다.</div>
                    </div>
                """, unsafe_allow_html=True)
                
                brand_counts = df['브랜드'].value_counts().reset_index()
                brand_counts.columns = ['브랜드', '상품 수']
                
                # Make color scheme match theme
                fig_brand = px.pie(
                    brand_counts, 
                    names='브랜드', 
                    values='상품 수', 
                    hole=0.4,
                    color_discrete_sequence=px.colors.qualitative.Prism
                )
                fig_brand.update_layout(
                    showlegend=True,
                    **PLOT_LAYOUT
                )
                # Remove margins for pie chart to prevent squishing
                fig_brand.update_layout(margin=dict(l=0, r=0, t=10, b=0))
                st.plotly_chart(fig_brand, use_container_width=True, config={"displayModeBar": False})
                st.markdown("</div>", unsafe_allow_html=True)
                
            st.write("")
            st.write("")
            
            # --- 3. Raw Data Table ---
            st.markdown(f"""
            <div class="chart-wrap">
                <div class="chart-header">
                    <div class="chart-title">📋 전체 수집 데이터 (Raw Data)</div>
                    <div class="chart-subtitle">네이버 쇼핑 API에서 파싱한 로우 데이터 세부 정보입니다.</div>
                </div>
            """, unsafe_allow_html=True)
            
            display_df = df[["상품명", "브랜드", "가격", "링크"]]
            st.dataframe(
                display_df,
                column_config={
                    "링크": st.column_config.LinkColumn("상품 바로가기")
                },
                use_container_width=True,
                height=350
            )
            st.markdown("</div>", unsafe_allow_html=True)
 
            # --- 4. GenAI Prompt Section ---
            st.write("")
            st.write("")
            
            st.markdown(f"""
            <div class="chart-wrap">
                <div class="chart-header">
                    <div class="chart-title">🤖 생성형 AI 분석용 프롬프트 복사</div>
                    <div class="chart-subtitle">아래 텍스트 블록 전체를 복사하여 ChatGPT나 Gemini에 입력하면 상세한 시장 분석 보고서를 작성해 줍니다.</div>
                </div>
            """, unsafe_allow_html=True)
            
            # Format brand distribution text
            brand_dist = df['브랜드'].value_counts()
            brand_dist_str = "\n".join([f"- {b}: {c}개 (약 {c/len(df)*100:.1f}%)" for b, c in brand_dist.items()])
            
            # Format top products list text
            top_products_str = "\n".join([f"- [{p['상품명']}] (브랜드: {p['브랜드']} | 가격: {p['가격']:,}원 | 링크: {p['링크']})" for _, p in df.head(15).iterrows()])
            
            ai_prompt = f"""[네이버 쇼핑 시장 분석 데이터]
- 조사 키워드: {keyword}
- 수집 상품 수: {len(df)}개
- 평균 가격: {int(df['가격'].mean()):,}원
- 최저 가격: {df['가격'].min():,}원
- 최고 가격: {df['가격'].max():,}원
 
[브랜드 점유율 분포]
{brand_dist_str}
 
[상위 노출 상품 목록 (TOP 15)]
{top_products_str}
 
위 데이터를 바탕으로 시장 분석 보고서를 한국어로 작성해줘. 다음 핵심 요구사항을 반드시 충족해야 해:
1. **가격 포지셔닝 분석**: 평균 가격 대비 저가/고가 구간의 특징을 비교하고, 마진과 경쟁력을 확보하기 좋은 '최적의 진입 가격 구간'을 산출해줘.
2. **브랜드 독점도 분석**: 주요 상위 브랜드들이 시장을 독점하고 있는지, 아니면 중소형 스토어들이 침투할 여지가 있는지 점유율 평가를 해줘.
3. **경쟁 우위 확보 전략**: 상위 노출되는 상품들의 작명 방식이나 정보들을 분석하여 신규 셀러가 차별화할 수 있는 마케팅 소구점(USP) 및 상품 기획 방향성을 도출해줘.
"""
            st.code(ai_prompt, language="markdown")
            st.markdown("</div>", unsafe_allow_html=True)
        else:
            st.error("데이터를 불러오지 못했습니다. 네이버 API 키 설정을 확인하거나 잠시 후 다시 실행해 주세요.")
