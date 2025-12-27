const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function countAgencies() {
    console.log("Counting approved agencies...");
    // count operations are 'head' or 'count'
    const { count, error } = await supabase
        .from('agencies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

    if (error) {
        console.error("Error counting agencies:", error);
    } else {
        console.log(`✅ Total Approved Agencies in DB: ${count}`);
    }
}

countAgencies();
