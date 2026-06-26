import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("NAVER_CLIENT_ID")
CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET")

api_url = "https://openapi.naver.com/v1/search/shop.json"
api_headers = {"X-Naver-Client-Id": CLIENT_ID, "X-Naver-Client-Secret": CLIENT_SECRET}

response = requests.get(api_url, headers=api_headers, params={"query": "강아지 유모차", "display": 5, "sort": "sim"})

if response.status_code == 200:
    items = response.json().get('items', [])
    print(json.dumps(items, ensure_ascii=False, indent=2))
else:
    print("Failed to call API:", response.status_code, response.text)
