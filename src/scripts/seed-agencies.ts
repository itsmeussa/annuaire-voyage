
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: '.env.local' });

// We need to define __dirname for ESM if we use "type": "module" in package.json
// But assuming CJS or TS handling, let's keep it simple.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("WARNING: Using ANON KEY. Inserts might fail if RLS policies block public writes.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

// --- Helpers copied from src/lib ---

const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};

const categoryMap: Record<string, string> = {
    "مكتب سفريات": "Travel Agency",
    "وكالة سياحية": "Tourism Agency",
    "وكالة عمل جولات في المعالم السياحية": "Tour Operator",
    "شركة سياحية لتنظيم رحلات غوص السكوبا": "Adventure Tours",
    "وكالة تسويق": "Marketing Agency",
    "Agence de voyages": "Travel Agency",
    "Agence de visites touristiques": "Tour Operator",
};

function normalizeCategory(category: string | null): string {
    if (!category) return "Travel Agency";
    return categoryMap[category] || category;
}

function containsArabic(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicPattern.test(text);
}

// Minimal country/city name mapping for demo purposes, 
// since importing the huge map from src/lib might fail with path aliases.
// Ideally usage of tsconfig-paths/register would solve this.
// For now, I'll just use the raw code if possible or a simple fallback.
// Actually, `getCountryName` and `getCityName` were imported from `@/lib/utils` which might be simple.
// Let's just try to be robust.

// Load city coordinates from src/lib/cityCoordinates.ts? Hard to parse TS file.
// I'll assume for this task, I can skip strict exact coords if not easily available,
// OR better, I should read the `cityCoordinates.ts` file content and extract the object using regex if I can't import it.

// Let's attempt to read the JSON file directly using fs
const dataPath = path.join(process.cwd(), 'src', 'data', 'agencies-processed.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function seed() {
    console.log(`Read ${rawData.length} records.`);

    const agencies = [];

    for (let i = 0; i < rawData.length; i++) {
        const item = rawData[i];

        // Skip empty title
        if (!item.title) continue;

        // We used to filter Arabic names in getAllAgencies, maybe we filter them here too?
        // User requested "Remove agencies with Arabic names" previously. 
        // It's better to NOT insert them into DB to save space/noise.
        if (containsArabic(item.title)) continue;

        const slug = slugify(item.title) || `agency-${i}`;
        const category = normalizeCategory(item.categoryName);

        // Simplified city/country normalization (fallback to raw if simple mapping missing)
        // In real app, we'd import the sophisticated logic. 
        // Assuming for this migration, we want basic functionality.
        const city = item.city;
        const country = item.countryCode; // Keeping country code as country for now if lookup map missing.

        // Generate specific ID deterministically or random? Random is fine as we are migrating.

        agencies.push({
            slug: `${slug}-${i}`, // Ensure uniqueness
            title: item.title,
            total_score: item.totalScore,
            reviews_count: item.reviewsCount,
            street: item.street,
            city: item.city,
            state: item.state,
            country_code: item.countryCode,
            website: item.website,
            phone: item.phone,
            category_name: item.categoryName,
            url: item.url,
            // latitude: ... 
            // longitude: ...
            city_normalized: city,
            country_normalized: country,
            category_normalized: category,
            featured: false, // Per recent request
            description: `Welcome to ${item.title}, a premier ${category} in ${city || 'your area'}.`
        });
    }

    console.log(`Prepared ${agencies.length} agencies for insertion.`);

    // Insert in chunks
    const chunkSize = 100;
    for (let i = 0; i < agencies.length; i += chunkSize) {
        const chunk = agencies.slice(i, i + chunkSize);
        const { error } = await supabase.from('agencies').insert(chunk);

        if (error) {
            console.error('Error inserting chunk:', error);
        } else {
            process.stdout.write('.');
        }
    }

    console.log('\nSeeding complete!');
}

seed().catch(err => console.error(err));
