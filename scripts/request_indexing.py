"""
Google Indexing API - Request URL Indexing
============================================
"""

import json
import httplib2
from oauth2client.service_account import ServiceAccountCredentials

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
SERVICE_ACCOUNT_FILE = "service_account.json"

URLS_TO_INDEX = [
    # ========== CORE PAGES ==========
    "https://www.travelagencies.world",
    "https://www.travelagencies.world/agencies",
    "https://www.travelagencies.world/destinations",
    "https://www.travelagencies.world/blog",
    "https://www.travelagencies.world/about",
    "https://www.travelagencies.world/contact",
    "https://www.travelagencies.world/privacy",
    "https://www.travelagencies.world/terms",
    
    # ========== ALL COUNTRY PAGES ==========
    "https://www.travelagencies.world/agencies/country/Australia",
    "https://www.travelagencies.world/agencies/country/Austria",
    "https://www.travelagencies.world/agencies/country/Bahrain",
    "https://www.travelagencies.world/agencies/country/Belgium",
    "https://www.travelagencies.world/agencies/country/Canada",
    "https://www.travelagencies.world/agencies/country/Denmark",
    "https://www.travelagencies.world/agencies/country/France",
    "https://www.travelagencies.world/agencies/country/Germany",
    "https://www.travelagencies.world/agencies/country/Hong%20Kong",
    "https://www.travelagencies.world/agencies/country/Iceland",
    "https://www.travelagencies.world/agencies/country/Ireland",
    "https://www.travelagencies.world/agencies/country/Italy",
    "https://www.travelagencies.world/agencies/country/Japan",
    "https://www.travelagencies.world/agencies/country/Malaysia",
    "https://www.travelagencies.world/agencies/country/Morocco",
    "https://www.travelagencies.world/agencies/country/Netherlands",
    "https://www.travelagencies.world/agencies/country/New%20Zealand",
    "https://www.travelagencies.world/agencies/country/Norway",
    "https://www.travelagencies.world/agencies/country/Portugal",
    "https://www.travelagencies.world/agencies/country/South%20Korea",
    "https://www.travelagencies.world/agencies/country/Spain",
    "https://www.travelagencies.world/agencies/country/Sweden",
    "https://www.travelagencies.world/agencies/country/United%20Arab%20Emirates",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom",
    "https://www.travelagencies.world/agencies/country/United%20States",
    
    # ========== TOP CITY PAGES ==========
    "https://www.travelagencies.world/agencies/country/Morocco/city/Marrakech",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Casablanca",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Agadir",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Fes",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Tangier",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Rabat",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Essaouira",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Ouarzazate",
    "https://www.travelagencies.world/agencies/country/France/city/Paris",
    "https://www.travelagencies.world/agencies/country/France/city/Lyon",
    "https://www.travelagencies.world/agencies/country/France/city/Marseille",
    "https://www.travelagencies.world/agencies/country/France/city/Nice",
    "https://www.travelagencies.world/agencies/country/France/city/Toulouse",
    "https://www.travelagencies.world/agencies/country/France/city/Bordeaux",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom/city/London",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom/city/Manchester",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom/city/Birmingham",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom/city/Edinburgh",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom/city/Glasgow",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom/city/Liverpool",
    "https://www.travelagencies.world/agencies/country/Spain/city/Barcelona",
    "https://www.travelagencies.world/agencies/country/Spain/city/Madrid",
    "https://www.travelagencies.world/agencies/country/Spain/city/Seville",
    "https://www.travelagencies.world/agencies/country/Spain/city/Valencia",
    "https://www.travelagencies.world/agencies/country/Spain/city/Malaga",
    "https://www.travelagencies.world/agencies/country/Italy/city/Rome",
    "https://www.travelagencies.world/agencies/country/Italy/city/Milan",
    "https://www.travelagencies.world/agencies/country/Italy/city/Florence",
    "https://www.travelagencies.world/agencies/country/Italy/city/Venice",
    "https://www.travelagencies.world/agencies/country/Italy/city/Naples",
    "https://www.travelagencies.world/agencies/country/United%20States/city/New%20York",
    "https://www.travelagencies.world/agencies/country/United%20States/city/Los%20Angeles",
    "https://www.travelagencies.world/agencies/country/United%20States/city/Miami",
    "https://www.travelagencies.world/agencies/country/United%20States/city/Las%20Vegas",
    "https://www.travelagencies.world/agencies/country/United%20States/city/San%20Francisco",
    "https://www.travelagencies.world/agencies/country/United%20States/city/Chicago",
    "https://www.travelagencies.world/agencies/country/Germany/city/Berlin",
    "https://www.travelagencies.world/agencies/country/Germany/city/Munich",
    "https://www.travelagencies.world/agencies/country/Germany/city/Frankfurt",
    "https://www.travelagencies.world/agencies/country/Germany/city/Hamburg",
    "https://www.travelagencies.world/agencies/country/Netherlands/city/Amsterdam",
    "https://www.travelagencies.world/agencies/country/Netherlands/city/Rotterdam",
    "https://www.travelagencies.world/agencies/country/Portugal/city/Lisbon",
    "https://www.travelagencies.world/agencies/country/Portugal/city/Porto",
    "https://www.travelagencies.world/agencies/country/Belgium/city/Brussels",
    "https://www.travelagencies.world/agencies/country/Belgium/city/Antwerp",
    "https://www.travelagencies.world/agencies/country/Japan/city/Tokyo",
    "https://www.travelagencies.world/agencies/country/Japan/city/Osaka",
    "https://www.travelagencies.world/agencies/country/Australia/city/Sydney",
    "https://www.travelagencies.world/agencies/country/Australia/city/Melbourne",
    "https://www.travelagencies.world/agencies/country/Canada/city/Toronto",
    "https://www.travelagencies.world/agencies/country/Canada/city/Vancouver",
    "https://www.travelagencies.world/agencies/country/United%20Arab%20Emirates/city/Dubai",
    "https://www.travelagencies.world/agencies/country/Ireland/city/Dublin",
    
    # ========== CATEGORY PAGES ==========
    "https://www.travelagencies.world/agencies/category/Travel%20Agency",
    "https://www.travelagencies.world/agencies/category/Tour%20operator",
    "https://www.travelagencies.world/agencies/category/Tourism%20Agency",
    "https://www.travelagencies.world/agencies/category/Adventure%20Tours",
    "https://www.travelagencies.world/agencies/category/Boat%20tour%20agency",
    "https://www.travelagencies.world/agencies/category/Bus%20tour%20agency",
    "https://www.travelagencies.world/agencies/category/Tourist%20attraction",
    "https://www.travelagencies.world/agencies/category/Sightseeing%20tour%20agency",
    
    # ========== BLOG PAGES ==========
    "https://www.travelagencies.world/blog/how-to-choose-travel-agency",
    "https://www.travelagencies.world/blog/top-destinations-2025",
    "https://www.travelagencies.world/blog/morocco-travel-guide",
    "https://www.travelagencies.world/blog/budget-travel-tips",
    "https://www.travelagencies.world/blog/group-travel-benefits",
    "https://www.travelagencies.world/blog/travel-insurance-guide",
]


def request_indexing(url: str, credentials) -> dict:
    http = credentials.authorize(httplib2.Http())
    content = json.dumps({"url": url, "type": "URL_UPDATED"})
    response, content = http.request(ENDPOINT, method="POST", body=content, headers={"Content-Type": "application/json"})
    return {"url": url, "status": response.status, "response": json.loads(content.decode()) if content else None}


def main():
    print("🔍 Google Indexing API - Bulk URL Submission")
    print("=" * 50)
    print(f"📝 Submitting {len(URLS_TO_INDEX)} URLs to Google...")
    print()
    
    try:
        credentials = ServiceAccountCredentials.from_json_keyfile_name(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    except FileNotFoundError:
        print("❌ Error: service_account.json not found!")
        return
    
    success = 0
    failed = 0
    
    for url in URLS_TO_INDEX:
        result = request_indexing(url, credentials)
        if result["status"] == 200:
            print(f"✅ {url}")
            success += 1
        else:
            print(f"❌ {url} - Status: {result['status']}")
            failed += 1
    
    print()
    print("=" * 50)
    print(f"✅ Success: {success} | ❌ Failed: {failed}")


if __name__ == "__main__":
    main()
