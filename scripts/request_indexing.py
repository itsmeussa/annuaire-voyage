"""
Google Indexing API - Request URL Indexing
============================================
"""

import json
import httplib2
import requests
import os
import xml.etree.ElementTree as ET
from oauth2client.service_account import ServiceAccountCredentials

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
# Define path relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.path.join(SCRIPT_DIR, "service_account.json")
# Fetch from LOCALHOST to get the latest sitemap generation with all 4000+ pages
SITEMAP_URL = "http://localhost:3000/sitemap.xml"

# Explicitly list new pages that might not be in the sitemap yet (e.g. new blogs)
NEW_PAGES = [
    # ========== CAN 2025 BLOG POSTS ==========
    "https://www.travelagencies.world/blog/can-2025-predictions-maroc-favori",
    "https://www.travelagencies.world/blog/can-2025-qui-va-gagner-pronostics",
    "https://www.travelagencies.world/blog/can-2025-maroc-parcours-mondial",
    "https://www.travelagencies.world/blog/can-2025-calendrier-matchs-maroc",
    "https://www.travelagencies.world/blog/can-2025-voyage-maroc-supporters",
    "https://www.travelagencies.world/blog/can-2025-stades-maroc-villes-hotes",
    
    # ========== EXISTING BLOG POSTS (Just in case) ==========
    "https://www.travelagencies.world/blog/how-to-choose-travel-agency",
    "https://www.travelagencies.world/blog/top-destinations-2025",
    "https://www.travelagencies.world/blog/morocco-travel-guide",
    "https://www.travelagencies.world/blog/budget-travel-tips",
    "https://www.travelagencies.world/blog/group-travel-benefits",
    "https://www.travelagencies.world/blog/travel-insurance-guide",
]

def get_sitemap_urls(sitemap_url):
    """Fetches all URLs from the XML sitemap."""
    try:
        print(f"📡 Fetching sitemap from {sitemap_url}...")
        response = requests.get(sitemap_url)
        if response.status_code != 200:
            print(f"⚠️ Failed to fetch sitemap: Status {response.status_code}")
            return []
        
        root = ET.fromstring(response.content)
        # Namespace usually present in sitemaps
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        urls = []
        for url in root.findall('ns:url', namespace):
            loc = url.find('ns:loc', namespace)
            if loc is not None and loc.text:
                urls.append(loc.text)
        
        print(f"✅ Found {len(urls)} URLs in sitemap.")
        return urls
    except Exception as e:
        print(f"❌ Error parsing sitemap: {e}")
        return []


def get_env_var(name):
    """Reads .env.local to find a variable."""
    try:
        env_path = os.path.join(os.path.dirname(SCRIPT_DIR), ".env.local")
        with open(env_path, "r") as f:
            for line in f:
                if line.startswith(name + "="):
                    return line.strip().split("=", 1)[1].strip('"').strip("'")
    except Exception as e:
        print(f"⚠️ Could not read {name} from .env.local: {e}")
    return None

def get_all_agencies_from_db():
    """Fetches all agency slugs directly from Supabase to bypass sitemap limits."""
    print("📡 Fetching ALL agencies from Supabase DB...")
    
    sb_url = get_env_var("NEXT_PUBLIC_SUPABASE_URL")
    sb_key = get_env_var("SUPABASE_SERVICE_ROLE_KEY")
    
    if not sb_url or not sb_key:
        print("⚠️ Missing Supabase credentials in .env.local, skipping DB fetch.")
        return []

    all_slugs = []
    offset = 0
    limit = 1000
    
    while True:
        headers = {
            "apikey": sb_key,
            "Authorization": f"Bearer {sb_key}",
            "Range": f"{offset}-{offset + limit - 1}"
        }
        
        try:
            url = f"{sb_url}/rest/v1/agencies?select=slug&status=eq.approved"
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if not data:
                    break
                
                print(f"   Fetched {len(data)} agencies (offset {offset})...")
                all_slugs.extend([f"https://www.travelagencies.world/agencies/{item['slug']}" for item in data])
                
                if len(data) < limit:
                    break
                
                offset += limit
            else:
                print(f"❌ Failed to fetch from DB: {response.status_code} - {response.text}")
                break
        except Exception as e:
            print(f"❌ Error fetching from DB: {e}")
            break
            
    print(f"✅ Found {len(all_slugs)} agencies in DB total.")
    return all_slugs

def request_indexing(url: str, credentials) -> dict:
    http = credentials.authorize(httplib2.Http())
    # ... (rest of function as before, but I need to make sure I don't delete it or break indentation)
    content = json.dumps({"url": url, "type": "URL_UPDATED"})
    response, content = http.request(ENDPOINT, method="POST", body=content, headers={"Content-Type": "application/json"})
    return {"url": url, "status": response.status, "response": json.loads(content.decode()) if content else None}


def main():
    print("🔍 Google Indexing API - Bulk URL Submission")
    print("=" * 50)
    
    # 1. Get URLs from Sitemap (for static pages, categories, etc.)
    # We still fetch sitemap to get standard pages
    sitemap_urls = get_sitemap_urls(SITEMAP_URL)
    
    # 2. Get Agencies from DB (source of truth for >4000)
    agency_urls = get_all_agencies_from_db()
    
    # 3. Combine with explicit new pages and deduplicate
    all_urls = sorted(list(set(sitemap_urls + agency_urls + NEW_PAGES)))
    
    print(f"📝 Submitting {len(all_urls)} URLs to Google...")
    print()
    
    try:
        credentials = ServiceAccountCredentials.from_json_keyfile_name(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    except FileNotFoundError:
        print("❌ Error: service_account.json not found!")
        return
    
    success = 0
    failed = 0
    
    for url in all_urls:
        # Simple logging to show progress without spamming too much if list is huge
        # But for ~100-200 urls, printing each line is fine.
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
