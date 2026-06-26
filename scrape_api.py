import urllib.request
import urllib.parse
import json
import re
import requests

def scrape_naver_shopping_api(keyword: str, max_items: int = 40):
    client_id = "i4sbEWJ1TdrIjuPSUlul"
    client_secret = "ZwKnbtpw09"
    
    # URL encode the keyword
    enc_text = urllib.parse.quote(keyword)
    url = f"https://openapi.naver.com/v1/search/shop.json?query={enc_text}&display={max_items}"
    
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    
    try:
        response = urllib.request.urlopen(request)
        res_code = response.getcode()
        
        if res_code == 200:
            response_body = response.read().decode('utf-8')
            data = json.loads(response_body)
            items = data.get("items", [])
            
            results = []
            for idx, item in enumerate(items):
                # Clean HTML tags like <b> from the title
                title = re.sub(r'<.*?>', '', item.get("title", ""))
                
                price = item.get("lprice", "0")
                # Format price with commas
                try:
                    price_val = int(price)
                    price_str = f"{price_val:,}원"
                except ValueError:
                    price_str = f"{price}원"
                    
                brand = item.get("brand") or item.get("mallName") or "미지정"
                link = item.get("link", "")
                product_id = item.get("productId", "")
                
                results.append({
                    "rank": idx + 1,
                    "title": title,
                    "price": price_str,
                    "brand": brand,
                    "link": link,
                    "productId": product_id
                })
                
            return results
        else:
            print(f"Error Code: {res_code}")
            return []
    except Exception as e:
        print(f"API Error: {e}")
        return []

def main():
    keyword = "무선 이어폰"
    print(f"Calling Naver Shopping Search API for keyword: '{keyword}'...")
    results = scrape_naver_shopping_api(keyword, max_items=40)
    
    print(f"\nSuccessfully retrieved {len(results)} items from API.")
    
    # Save results to results.json
    with open("results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
    print("Saved results to results.json")
    
    # Print the top 10 items for preview
    print("\nTop 10 Scraped Items:")
    print("-" * 80)
    for item in results[:10]:
        print(f"Rank {item['rank']}: {item['title']}")
        print(f"  Brand: {item['brand']} | Price: {item['price']}")
        print(f"  Link: {item['link']}")
        print("-" * 80)

if __name__ == "__main__":
    main()
