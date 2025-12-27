"""
IndexNow API - Instant Bing & Yandex Indexing
==============================================
"""

import requests
import os
import xml.etree.ElementTree as ET

API_KEY = "2b8aceb7cea24c529ede91c7a6d9ac34"
HOST = "www.travelagencies.world"
KEY_LOCATION = f"https://{HOST}/{API_KEY}.txt"
# Fetch from LOCALHOST to get the latest sitemap generation with all 4000+ pages
SITEMAP_URL = "http://localhost:3000/sitemap.xml"

# Explicitly list new pages that might not be in the sitemap yet
NEW_PAGES = [
    # ========== CAN 2025 BLOG POSTS ==========
    f"https://{HOST}/blog/can-2025-predictions-maroc-favori",
    f"https://{HOST}/blog/can-2025-qui-va-gagner-pronostics",
    f"https://{HOST}/blog/can-2025-maroc-parcours-mondial",
    f"https://{HOST}/blog/can-2025-calendrier-matchs-maroc",
    f"https://{HOST}/blog/can-2025-voyage-maroc-supporters",
    f"https://{HOST}/blog/can-2025-stades-maroc-villes-hotes",
    
    # ========== EXISTING BLOG POSTS ==========
    f"https://{HOST}/blog/how-to-choose-travel-agency",
    f"https://{HOST}/blog/top-destinations-2025",
    f"https://{HOST}/blog/morocco-travel-guide",
    f"https://{HOST}/blog/budget-travel-tips",
    f"https://{HOST}/blog/group-travel-benefits",
    f"https://{HOST}/blog/travel-insurance-guide",
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
        env_path = os.path.join("c:\\Users\\pc\\Desktop\\freelance\\annuaire-voyage", ".env.local")
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
        print("⚠️ Missing Supabase credentials, skipping DB fetch.")
        return []

    all_slugs = []
    offset = 0
    limit = 1000 # Supabase max rows per request
    
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
                all_slugs.extend([f"https://{HOST}/agencies/{item['slug']}" for item in data])
                
                if len(data) < limit:
                    break
                    
                offset += limit
            else:
                print(f"❌ Failed to fetch from DB: {response.status_code}")
                break
        except Exception as e:
            print(f"❌ Error fetching from DB: {e}")
            break
            
    print(f"✅ Found {len(all_slugs)} agencies in DB total.")
    return all_slugs

def submit_to_indexnow(urls: list, search_engine: str = "api.indexnow.org") -> dict:
    endpoint = f"https://{search_engine}/indexnow"
    payload = {"host": HOST, "key": API_KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
    # IndexNow accepts up to 10,000 URLs per batch
    response = requests.post(endpoint, json=payload, headers={"Content-Type": "application/json"})
    return {"search_engine": search_engine, "status_code": response.status_code, "urls_submitted": len(urls)}


def main():
    print("🚀 IndexNow - Instant Search Engine Notification")
    print("=" * 50)
    
    # 1. Get URLs from Sitemap
    sitemap_urls = get_sitemap_urls(SITEMAP_URL)
    
    # 2. Get Agencies from DB
    agency_urls = get_all_agencies_from_db()
    
    # 3. Combine and deduplicate
    all_urls = sorted(list(set(sitemap_urls + agency_urls + NEW_PAGES)))
    
    print(f"📝 Submitting {len(all_urls)} URLs...")
    print()
    
    engines = ["api.indexnow.org", "www.bing.com", "yandex.com"]
    
    for engine in engines:
        try:
            result = submit_to_indexnow(all_urls, engine)
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
