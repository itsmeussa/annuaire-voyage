
const { createClient } = require("@supabase/supabase-js");

const NEXT_PUBLIC_SUPABASE_URL = "https://pccjdwxoeutgwqhmekfe.supabase.co";
// Use SERVICE_ROLE_KEY to bypass RLS and admin restrictions
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function createAdminUser() {
    const email = "admin@example.com";
    const password = "adminpassword123";

    console.log(`Attempting to create user: ${email}`);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) {
        console.error("Error creating user:", error.message);
    } else {
        console.log("User created successfully:", data.user.email);
        console.log("ID:", data.user.id);
    }
}

createAdminUser();
