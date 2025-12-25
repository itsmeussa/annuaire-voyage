
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function seedAdminProfile() {
    const email = "admin@example.com";

    // 1. Get Admin User ID
    // Since we can't easily query auth.users directly with client unless we use listUsers (admin api) or sign in
    // Let's rely on listUsers

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("Error listing users:", listError);
        return;
    }

    const adminUser = users.find(u => u.email === email);

    if (!adminUser) {
        console.error("Admin user not found!");
        return;
    }

    console.log(`Found Admin User: ${adminUser.id}`);

    // 2. Check if profile exists
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', adminUser.id)
        .single();

    if (profile) {
        console.log("Admin profile already exists:", profile);
        return;
    }

    // 3. Create Profile
    const { error: insertError } = await supabase
        .from('profiles')
        .insert({
            id: adminUser.id,
            full_name: "System Admin",
            referral_code: "ADMIN-START",
            referred_by: null
        });

    if (insertError) {
        console.error("Error creating admin profile:", insertError);
    } else {
        console.log("Admin profile created successfully with code: ADMIN-START");
    }
}

seedAdminProfile();
