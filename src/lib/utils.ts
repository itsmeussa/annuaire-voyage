import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatPhoneNumber(phone: string | null): string {
  if (!phone) return "";
  return phone.replace(/\s+/g, " ").trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getCountryName(code: string | null): string {
  const countries: Record<string, string> = {
    // Africa
    MA: "Morocco",
    EG: "Egypt",
    TN: "Tunisia",
    DZ: "Algeria",
    ZA: "South Africa",
    KE: "Kenya",
    NG: "Nigeria",
    GH: "Ghana",
    EH: "Morocco", // Western Sahara
    
    // Europe
    FR: "France",
    ES: "Spain",
    IT: "Italy",
    DE: "Germany",
    GB: "United Kingdom",
    UK: "United Kingdom",
    NL: "Netherlands",
    BE: "Belgium",
    AT: "Austria",
    CH: "Switzerland",
    PT: "Portugal",
    IE: "Ireland",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    PL: "Poland",
    CZ: "Czech Republic",
    GR: "Greece",
    TR: "Turkey",
    RU: "Russia",
    IS: "Iceland",
    HU: "Hungary",
    RO: "Romania",
    BG: "Bulgaria",
    HR: "Croatia",
    SK: "Slovakia",
    SI: "Slovenia",
    LU: "Luxembourg",
    MT: "Malta",
    CY: "Cyprus",
    
    // North America
    US: "United States",
    CA: "Canada",
    MX: "Mexico",
    
    // South America
    BR: "Brazil",
    AR: "Argentina",
    CL: "Chile",
    CO: "Colombia",
    PE: "Peru",
    VE: "Venezuela",
    EC: "Ecuador",
    UY: "Uruguay",
    
    // Asia
    AE: "United Arab Emirates",
    SA: "Saudi Arabia",
    QA: "Qatar",
    KW: "Kuwait",
    BH: "Bahrain",
    OM: "Oman",
    JO: "Jordan",
    LB: "Lebanon",
    IL: "Israel",
    JP: "Japan",
    KR: "South Korea",
    CN: "China",
    HK: "Hong Kong",
    TW: "Taiwan",
    SG: "Singapore",
    MY: "Malaysia",
    TH: "Thailand",
    VN: "Vietnam",
    ID: "Indonesia",
    PH: "Philippines",
    IN: "India",
    PK: "Pakistan",
    BD: "Bangladesh",
    LK: "Sri Lanka",
    NP: "Nepal",
    MM: "Myanmar",
    KH: "Cambodia",
    LA: "Laos",
    
    // Oceania
    AU: "Australia",
    NZ: "New Zealand",
    FJ: "Fiji",
    
    // Caribbean
    JM: "Jamaica",
    CU: "Cuba",
    DO: "Dominican Republic",
    PR: "Puerto Rico",
    TT: "Trinidad and Tobago",
    BS: "Bahamas",
  };
  return code ? countries[code] || code : "Unknown";
}

export function getCityName(city: string | null): string {
  if (!city) return "Unknown";
  // Map Arabic city names to English
  const cityMap: Record<string, string> = {
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
    "Tanger": "Tangier",
    "Fès": "Fes",
    "Marrakesh": "Marrakech",
    "Tétouan": "Tetouan",
    "Ouarzazate": "Ouarzazate",
    "Mhamid": "M'hamid",
  };
  return cityMap[city] || city;
}
