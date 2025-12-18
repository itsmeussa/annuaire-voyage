"""
Script to process and combine all agency data from JSON files.
Run this script to generate the processed agencies data.
"""

import json
import os
from pathlib import Path

def slugify(text):
    """Convert text to URL-friendly slug."""
    if not text:
        return ""
    slug = text.lower().strip()
    # Replace spaces with hyphens
    slug = slug.replace(" ", "-")
    # Remove special characters
    import re
    slug = re.sub(r'[^\w\-]', '', slug)
    # Remove multiple hyphens
    slug = re.sub(r'-+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def get_country_name(code):
    """Map country codes to country names."""
    countries = {
        "MA": "Morocco",
        "FR": "France",
        "ES": "Spain",
        "IT": "Italy",
        "DE": "Germany",
        "UK": "United Kingdom",
        "GB": "United Kingdom",
        "US": "United States",
        "AE": "United Arab Emirates",
        "SA": "Saudi Arabia",
        "EG": "Egypt",
        "TN": "Tunisia",
        "DZ": "Algeria",
        "CA": "Canada",
        "NL": "Netherlands",
        "MY": "Malaysia",
        "NZ": "New Zealand",
        "IE": "Ireland",
        "AU": "Australia",
        "PT": "Portugal",
        "BE": "Belgium",
        "CH": "Switzerland",
        "AT": "Austria",
        "PL": "Poland",
        "SE": "Sweden",
        "NO": "Norway",
        "DK": "Denmark",
        "FI": "Finland",
        "GR": "Greece",
        "TR": "Turkey",
        "IN": "India",
        "SG": "Singapore",
        "TH": "Thailand",
        "JP": "Japan",
        "KR": "South Korea",
        "CN": "China",
        "HK": "Hong Kong",
        "PH": "Philippines",
        "ID": "Indonesia",
        "VN": "Vietnam",
        "BR": "Brazil",
        "MX": "Mexico",
        "AR": "Argentina",
        "CO": "Colombia",
        "ZA": "South Africa",
        "NG": "Nigeria",
        "KE": "Kenya",
        "EH": "Western Sahara",
    }
    return countries.get(code, code) if code else "Unknown"

def get_city_name(city):
    """Map Arabic city names to English."""
    if not city:
        return "Unknown"
    city_map = {
        "الدار البيضاء": "Casablanca",
        "مراكش": "Marrakech",
        "الرباط": "Rabat",
        "أگادير": "Agadir",
        "فاس": "Fes",
        "طنجة": "Tangier",
        "تمارة": "Temara",
        "مكناس": "Meknes",
        "إنزكان": "Inezgane",
        "جليز،": "Gueliz",
        "قلعة مكونة": "Kelaat M'Gouna",
    }
    return city_map.get(city, city)

def normalize_category(category):
    """Map Arabic/French categories to English."""
    if not category:
        return "Travel Agency"
    category_map = {
        "مكتب سفريات": "Travel Agency",
        "وكالة سياحية": "Tourism Agency",
        "وكالة عمل جولات في المعالم السياحية": "Tour Operator",
        "شركة سياحية لتنظيم رحلات غوص السكوبا": "Adventure Tours",
        "وكالة تسويق": "Marketing Agency",
        "Agence de voyages": "Travel Agency",
        "Agence de visites touristiques": "Tour Operator",
    }
    return category_map.get(category, category)

def main():
    data_dir = Path(__file__).parent / "data"
    output_file = Path(__file__).parent / "src" / "data" / "agencies-processed.json"
    
    # Create output directory if it doesn't exist
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    all_agencies = []
    seen_titles = set()  # Track unique agencies by title
    
    # Process all JSON files in the data directory
    json_files = list(data_dir.glob("*.json"))
    print(f"Found {len(json_files)} JSON files to process")
    
    for json_file in json_files:
        print(f"Processing: {json_file.name}")
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            for item in data:
                title = item.get('title', '')
                
                # Skip duplicates and empty titles
                if not title or title in seen_titles:
                    continue
                    
                seen_titles.add(title)
                
                # Process the agency data
                agency = {
                    "title": title,
                    "totalScore": item.get('totalScore'),
                    "reviewsCount": item.get('reviewsCount'),
                    "street": item.get('street'),
                    "city": item.get('city'),
                    "state": item.get('state'),
                    "countryCode": item.get('countryCode'),
                    "website": item.get('website'),
                    "phone": item.get('phone'),
                    "categoryName": item.get('categoryName'),
                    "url": item.get('url', ''),
                }
                
                all_agencies.append(agency)
                
        except Exception as e:
            print(f"Error processing {json_file.name}: {e}")
    
    # Sort by rating and review count
    all_agencies.sort(
        key=lambda x: (
            x.get('totalScore') or 0,
            x.get('reviewsCount') or 0
        ),
        reverse=True
    )
    
    print(f"\nTotal unique agencies: {len(all_agencies)}")
    
    # Write the processed data
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_agencies, f, ensure_ascii=False, indent=2)
    
    print(f"Processed data saved to: {output_file}")
    
    # Print some stats
    countries = {}
    cities = {}
    for agency in all_agencies:
        country = get_country_name(agency.get('countryCode'))
        city = get_city_name(agency.get('city'))
        countries[country] = countries.get(country, 0) + 1
        cities[city] = cities.get(city, 0) + 1
    
    print("\nAgencies by country:")
    for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {country}: {count}")
    
    print("\nTop cities:")
    for city, count in sorted(cities.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {city}: {count}")

if __name__ == "__main__":
    main()
