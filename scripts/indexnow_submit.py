"""
IndexNow API - Instant Bing & Yandex Indexing
==============================================
"""

import requests

API_KEY = "2b8aceb7cea24c529ede91c7a6d9ac34"
HOST = "www.travelagencies.world"
KEY_LOCATION = f"https://{HOST}/{API_KEY}.txt"

URLS_TO_INDEX = [
    # ========== CORE PAGES ==========
    f"https://{HOST}",
    f"https://{HOST}/agencies",
    f"https://{HOST}/destinations",
    f"https://{HOST}/blog",
    f"https://{HOST}/about",
    f"https://{HOST}/contact",
    f"https://{HOST}/privacy",
    f"https://{HOST}/terms",
    
    # ========== ALL COUNTRY PAGES ==========
    f"https://{HOST}/agencies/country/Australia",
    f"https://{HOST}/agencies/country/Austria",
    f"https://{HOST}/agencies/country/Bahrain",
    f"https://{HOST}/agencies/country/Belgium",
    f"https://{HOST}/agencies/country/Canada",
    f"https://{HOST}/agencies/country/Denmark",
    f"https://{HOST}/agencies/country/France",
    f"https://{HOST}/agencies/country/Germany",
    f"https://{HOST}/agencies/country/Hong%20Kong",
    f"https://{HOST}/agencies/country/Iceland",
    f"https://{HOST}/agencies/country/Ireland",
    f"https://{HOST}/agencies/country/Italy",
    f"https://{HOST}/agencies/country/Japan",
    f"https://{HOST}/agencies/country/Malaysia",
    f"https://{HOST}/agencies/country/Morocco",
    f"https://{HOST}/agencies/country/Netherlands",
    f"https://{HOST}/agencies/country/New%20Zealand",
    f"https://{HOST}/agencies/country/Norway",
    f"https://{HOST}/agencies/country/Portugal",
    f"https://{HOST}/agencies/country/South%20Korea",
    f"https://{HOST}/agencies/country/Spain",
    f"https://{HOST}/agencies/country/Sweden",
    f"https://{HOST}/agencies/country/United%20Arab%20Emirates",
    f"https://{HOST}/agencies/country/United%20Kingdom",
    f"https://{HOST}/agencies/country/United%20States",
    
    # ========== TOP CITY PAGES ==========
    f"https://{HOST}/agencies/country/Morocco/city/Marrakech",
    f"https://{HOST}/agencies/country/Morocco/city/Casablanca",
    f"https://{HOST}/agencies/country/Morocco/city/Agadir",
    f"https://{HOST}/agencies/country/Morocco/city/Fes",
    f"https://{HOST}/agencies/country/Morocco/city/Tangier",
    f"https://{HOST}/agencies/country/Morocco/city/Rabat",
    f"https://{HOST}/agencies/country/Morocco/city/Essaouira",
    f"https://{HOST}/agencies/country/Morocco/city/Ouarzazate",
    f"https://{HOST}/agencies/country/France/city/Paris",
    f"https://{HOST}/agencies/country/France/city/Lyon",
    f"https://{HOST}/agencies/country/France/city/Marseille",
    f"https://{HOST}/agencies/country/France/city/Nice",
    f"https://{HOST}/agencies/country/France/city/Toulouse",
    f"https://{HOST}/agencies/country/France/city/Bordeaux",
    f"https://{HOST}/agencies/country/United%20Kingdom/city/London",
    f"https://{HOST}/agencies/country/United%20Kingdom/city/Manchester",
    f"https://{HOST}/agencies/country/United%20Kingdom/city/Birmingham",
    f"https://{HOST}/agencies/country/United%20Kingdom/city/Edinburgh",
    f"https://{HOST}/agencies/country/United%20Kingdom/city/Glasgow",
    f"https://{HOST}/agencies/country/United%20Kingdom/city/Liverpool",
    f"https://{HOST}/agencies/country/Spain/city/Barcelona",
    f"https://{HOST}/agencies/country/Spain/city/Madrid",
    f"https://{HOST}/agencies/country/Spain/city/Seville",
    f"https://{HOST}/agencies/country/Spain/city/Valencia",
    f"https://{HOST}/agencies/country/Spain/city/Malaga",
    f"https://{HOST}/agencies/country/Italy/city/Rome",
    f"https://{HOST}/agencies/country/Italy/city/Milan",
    f"https://{HOST}/agencies/country/Italy/city/Florence",
    f"https://{HOST}/agencies/country/Italy/city/Venice",
    f"https://{HOST}/agencies/country/Italy/city/Naples",
    f"https://{HOST}/agencies/country/United%20States/city/New%20York",
    f"https://{HOST}/agencies/country/United%20States/city/Los%20Angeles",
    f"https://{HOST}/agencies/country/United%20States/city/Miami",
    f"https://{HOST}/agencies/country/United%20States/city/Las%20Vegas",
    f"https://{HOST}/agencies/country/United%20States/city/San%20Francisco",
    f"https://{HOST}/agencies/country/United%20States/city/Chicago",
    f"https://{HOST}/agencies/country/Germany/city/Berlin",
    f"https://{HOST}/agencies/country/Germany/city/Munich",
    f"https://{HOST}/agencies/country/Germany/city/Frankfurt",
    f"https://{HOST}/agencies/country/Germany/city/Hamburg",
    f"https://{HOST}/agencies/country/Netherlands/city/Amsterdam",
    f"https://{HOST}/agencies/country/Netherlands/city/Rotterdam",
    f"https://{HOST}/agencies/country/Portugal/city/Lisbon",
    f"https://{HOST}/agencies/country/Portugal/city/Porto",
    f"https://{HOST}/agencies/country/Belgium/city/Brussels",
    f"https://{HOST}/agencies/country/Belgium/city/Antwerp",
    f"https://{HOST}/agencies/country/Japan/city/Tokyo",
    f"https://{HOST}/agencies/country/Japan/city/Osaka",
    f"https://{HOST}/agencies/country/Australia/city/Sydney",
    f"https://{HOST}/agencies/country/Australia/city/Melbourne",
    f"https://{HOST}/agencies/country/Canada/city/Toronto",
    f"https://{HOST}/agencies/country/Canada/city/Vancouver",
    f"https://{HOST}/agencies/country/United%20Arab%20Emirates/city/Dubai",
    f"https://{HOST}/agencies/country/Ireland/city/Dublin",
    
    # ========== CATEGORY PAGES ==========
    f"https://{HOST}/agencies/category/Travel%20Agency",
    f"https://{HOST}/agencies/category/Tour%20operator",
    f"https://{HOST}/agencies/category/Tourism%20Agency",
    f"https://{HOST}/agencies/category/Adventure%20Tours",
    f"https://{HOST}/agencies/category/Boat%20tour%20agency",
    f"https://{HOST}/agencies/category/Bus%20tour%20agency",
    f"https://{HOST}/agencies/category/Tourist%20attraction",
    f"https://{HOST}/agencies/category/Sightseeing%20tour%20agency",
    
    # ========== BLOG PAGES ==========
    f"https://{HOST}/blog/how-to-choose-travel-agency",
    f"https://{HOST}/blog/top-destinations-2025",
    f"https://{HOST}/blog/morocco-travel-guide",
    f"https://{HOST}/blog/budget-travel-tips",
    f"https://{HOST}/blog/group-travel-benefits",
    f"https://{HOST}/blog/travel-insurance-guide",
]


def submit_to_indexnow(urls: list, search_engine: str = "api.indexnow.org") -> dict:
    endpoint = f"https://{search_engine}/indexnow"
    payload = {"host": HOST, "key": API_KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
    response = requests.post(endpoint, json=payload, headers={"Content-Type": "application/json"})
    return {"search_engine": search_engine, "status_code": response.status_code, "urls_submitted": len(urls)}


def main():
    print("🚀 IndexNow - Instant Search Engine Notification")
    print("=" * 50)
    print(f"📝 Submitting {len(URLS_TO_INDEX)} URLs...")
    print()
    
    engines = ["api.indexnow.org", "www.bing.com", "yandex.com"]
    
    for engine in engines:
        try:
            result = submit_to_indexnow(URLS_TO_INDEX, engine)
            if result["status_code"] in [200, 202]:
                print(f"✅ {engine}: Submitted {result['urls_submitted']} URLs")
            else:
                print(f"❌ {engine}: Status {result['status_code']}")
        except Exception as e:
            print(f"❌ {engine}: Error - {str(e)}")
    
    print()
    print("=" * 50)
    print("✅ Done! Bing & Yandex will crawl your pages within minutes.")


if __name__ == "__main__":
    main()
