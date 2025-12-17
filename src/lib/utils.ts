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
    MA: "Morocco",
    FR: "France",
    ES: "Spain",
    IT: "Italy",
    DE: "Germany",
    UK: "United Kingdom",
    US: "United States",
    AE: "United Arab Emirates",
    SA: "Saudi Arabia",
    EG: "Egypt",
    TN: "Tunisia",
    DZ: "Algeria",
    EH: "Morocco", // Western Sahara is part of Morocco
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
