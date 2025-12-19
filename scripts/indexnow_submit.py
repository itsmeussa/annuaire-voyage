"""
IndexNow API - Instant Bing & Yandex Indexing
==============================================
No setup required! Just run this script.
IndexNow instantly notifies Bing and Yandex of your URLs.
"""

import requests
import json

# Your IndexNow API key (matches the .txt file in public/)
API_KEY = "2b8aceb7cea24c529ede91c7a6d9ac34"
HOST = "www.travelagencies.world"
KEY_LOCATION = f"https://{HOST}/{API_KEY}.txt"

# URLs to submit (max 10,000 per request)
URLS_TO_INDEX = [
    # Core pages
    f"https://{HOST}",
    f"https://{HOST}/agencies",
    f"https://{HOST}/destinations",
    f"https://{HOST}/blog",
    f"https://{HOST}/about",
    f"https://{HOST}/contact",
    
    # Top countries
    f"https://{HOST}/agencies/country/Morocco",
    f"https://{HOST}/agencies/country/France",
    f"https://{HOST}/agencies/country/United%20States",
    f"https://{HOST}/agencies/country/United%20Kingdom",
    f"https://{HOST}/agencies/country/Spain",
    f"https://{HOST}/agencies/country/Italy",
    f"https://{HOST}/agencies/country/Germany",
    f"https://{HOST}/agencies/country/Portugal",
    f"https://{HOST}/agencies/country/Netherlands",
    f"https://{HOST}/agencies/country/Belgium",
    
    # Top cities
    f"https://{HOST}/agencies/country/Morocco/city/Marrakech",
    f"https://{HOST}/agencies/country/Morocco/city/Casablanca",
    f"https://{HOST}/agencies/country/Morocco/city/Agadir",
    f"https://{HOST}/agencies/country/Morocco/city/Fes",
    f"https://{HOST}/agencies/country/France/city/Paris",
    f"https://{HOST}/agencies/country/France/city/Lyon",
    f"https://{HOST}/agencies/country/France/city/Marseille",
    f"https://{HOST}/agencies/country/United%20Kingdom/city/London",
    f"https://{HOST}/agencies/country/Spain/city/Barcelona",
    f"https://{HOST}/agencies/country/Spain/city/Madrid",
    f"https://{HOST}/agencies/country/United%20States/city/New%20York",
    f"https://{HOST}/agencies/country/Italy/city/Rome",
    f"https://{HOST}/agencies/country/Netherlands/city/Amsterdam",
    f"https://{HOST}/agencies/country/Portugal/city/Lisbon",
    
    # Categories
    f"https://{HOST}/agencies/category/Travel%20Agency",
    f"https://{HOST}/agencies/category/Tour%20operator",
    f"https://{HOST}/agencies/category/Tourism%20Agency",
    f"https://{HOST}/agencies/category/Adventure%20Tours",
    
    # Blog
    f"https://{HOST}/blog/how-to-choose-travel-agency",
    f"https://{HOST}/blog/top-destinations-2025",
    f"https://{HOST}/blog/morocco-travel-guide",
]


def submit_to_indexnow(urls: list, search_engine: str = "api.indexnow.org") -> dict:
    """Submit URLs to IndexNow (works for Bing, Yandex, Seznam, Naver)"""
    
    endpoint = f"https://{search_engine}/indexnow"
    
    payload = {
        "host": HOST,
        "key": API_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }
    
    response = requests.post(
        endpoint,
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    return {
        "search_engine": search_engine,
        "status_code": response.status_code,
        "urls_submitted": len(urls)
    }


def main():
    print("🚀 IndexNow - Instant Search Engine Notification")
    print("=" * 50)
    print(f"📝 Submitting {len(URLS_TO_INDEX)} URLs...")
    print()
    
    # Submit to all IndexNow-compatible search engines
    engines = [
        "api.indexnow.org",      # Generic (forwards to all)
        "www.bing.com",          # Bing directly
        "yandex.com",            # Yandex directly
    ]
    
    for engine in engines:
        try:
            result = submit_to_indexnow(URLS_TO_INDEX, engine)
            
            if result["status_code"] in [200, 202]:
                print(f"✅ {engine}: Submitted {result['urls_submitted']} URLs")
            elif result["status_code"] == 400:
                print(f"⚠️  {engine}: Bad request (check URL format)")
            elif result["status_code"] == 403:
                print(f"⚠️  {engine}: Key file not found at {KEY_LOCATION}")
            elif result["status_code"] == 422:
                print(f"⚠️  {engine}: Invalid URLs")
            else:
                print(f"❌ {engine}: Status {result['status_code']}")
                
        except Exception as e:
            print(f"❌ {engine}: Error - {str(e)}")
    
    print()
    print("=" * 50)
    print("✅ Done! Bing & Yandex will crawl your pages within minutes.")
    print()
    print("📌 Note: Google does NOT support IndexNow.")
    print("   For Google, use the Indexing API or submit sitemap manually.")


if __name__ == "__main__":
    main()
