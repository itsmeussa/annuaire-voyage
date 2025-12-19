"""
Google Indexing API - Request URL Indexing
============================================
Setup:
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project or select existing
3. Enable "Indexing API"
4. Create a Service Account and download JSON key
5. Add the service account email as an OWNER in Google Search Console
6. Save the JSON key as 'service_account.json' in this folder
"""

import json
import httplib2
from oauth2client.service_account import ServiceAccountCredentials

# Configuration
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
SERVICE_ACCOUNT_FILE = "service_account.json"  # Download from Google Cloud Console

# URLs to index (Priority order)
URLS_TO_INDEX = [
    # Core pages
    "https://www.travelagencies.world",
    "https://www.travelagencies.world/agencies",
    "https://www.travelagencies.world/destinations",
    "https://www.travelagencies.world/blog",
    "https://www.travelagencies.world/about",
    "https://www.travelagencies.world/contact",
    
    # Top countries
    "https://www.travelagencies.world/agencies/country/Morocco",
    "https://www.travelagencies.world/agencies/country/France",
    "https://www.travelagencies.world/agencies/country/United%20States",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom",
    "https://www.travelagencies.world/agencies/country/Spain",
    "https://www.travelagencies.world/agencies/country/Italy",
    "https://www.travelagencies.world/agencies/country/Germany",
    "https://www.travelagencies.world/agencies/country/Portugal",
    
    # Top cities
    "https://www.travelagencies.world/agencies/country/Morocco/city/Marrakech",
    "https://www.travelagencies.world/agencies/country/Morocco/city/Casablanca",
    "https://www.travelagencies.world/agencies/country/France/city/Paris",
    "https://www.travelagencies.world/agencies/country/United%20Kingdom/city/London",
    "https://www.travelagencies.world/agencies/country/Spain/city/Barcelona",
    
    # Categories
    "https://www.travelagencies.world/agencies/category/Travel%20Agency",
    "https://www.travelagencies.world/agencies/category/Tour%20operator",
    
    # Blog
    "https://www.travelagencies.world/blog/how-to-choose-travel-agency",
    "https://www.travelagencies.world/blog/top-destinations-2025",
    "https://www.travelagencies.world/blog/morocco-travel-guide",
]


def request_indexing(url: str, credentials) -> dict:
    """Request Google to index a URL"""
    http = credentials.authorize(httplib2.Http())
    
    content = json.dumps({
        "url": url,
        "type": "URL_UPDATED"  # or "URL_DELETED" to remove
    })
    
    response, content = http.request(
        ENDPOINT,
        method="POST",
        body=content,
        headers={"Content-Type": "application/json"}
    )
    
    return {
        "url": url,
        "status": response.status,
        "response": json.loads(content.decode()) if content else None
    }


def main():
    print("🔍 Google Indexing API - Bulk URL Submission")
    print("=" * 50)
    
    try:
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            SERVICE_ACCOUNT_FILE, 
            scopes=SCOPES
        )
    except FileNotFoundError:
        print("❌ Error: service_account.json not found!")
        print("\nSetup instructions:")
        print("1. Go to https://console.cloud.google.com")
        print("2. Create project → Enable 'Indexing API'")
        print("3. Create Service Account → Download JSON key")
        print("4. Add service account email as OWNER in Search Console")
        print("5. Save JSON as 'service_account.json' in this folder")
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
            if result["response"]:
                print(f"   Error: {result['response'].get('error', {}).get('message', 'Unknown')}")
            failed += 1
    
    print("\n" + "=" * 50)
    print(f"✅ Success: {success} | ❌ Failed: {failed}")
    print("\n⚠️  Note: Google may take hours/days to actually index the pages.")


if __name__ == "__main__":
    main()
