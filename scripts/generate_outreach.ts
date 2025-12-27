import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OUTPUT_DIR = path.join(__dirname, '../generated_emails');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// ------------------------------------------------------------------
// PERSISTENCE LOGGING
// ------------------------------------------------------------------
const LOG_FILE = path.join(OUTPUT_DIR, 'sent_agencies.json');
let sentLog: Record<string, string> = {};

if (fs.existsSync(LOG_FILE)) {
    try {
        sentLog = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
    } catch (e) {
        console.error('Error reading sent log, starting fresh.');
    }
}

function logSentEmail(agencyId: string) {
    sentLog[agencyId] = new Date().toISOString();
    fs.writeFileSync(LOG_FILE, JSON.stringify(sentLog, null, 2));
}

function hasSentEmail(agencyId: string): boolean {
    return !!sentLog[agencyId];
}

// --- SMTP CONFIGURATION ---
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDER_EMAIL = '"Oussama at TravelAgencies.World" <contact@travelagencies.world>';

let transporter: nodemailer.Transporter | null = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
    console.log(`✅ SMTP Configured: ${SMTP_HOST} (${SMTP_USER})`);
} else {
    console.log('⚠️ SMTP Credentials missing. Sending disabled.');
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const JUNK_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'js', 'css', 'woff', 'woff2', 'ttf', 'eot', 'mp4'];
const JUNK_DOMAINS = ['sentry', 'example.com', 'domain.com', 'email.com', 'wixpress.com', 'cloudflare.com'];

function isValidEmail(email: string): boolean {
    if (!email || email.length > 100) return false;
    if (email.includes('noreply') || email.includes('no-reply')) return false;
    const lower = email.toLowerCase();
    if (JUNK_EXTENSIONS.some(ext => lower.endsWith(`.${ext}`))) return false;
    if (JUNK_DOMAINS.some(domain => lower.includes(domain))) return false;
    return true;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeEmail(url: string): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const text = await response.text();
        const mailtoMatch = text.match(/href=["']mailto:([^"'\?]+)/i);
        if (mailtoMatch && mailtoMatch[1]) {
            const email = mailtoMatch[1].trim();
            if (isValidEmail(email)) return email;
        }

        const matches = text.match(EMAIL_REGEX);
        if (matches && matches.length > 0) {
            const validEmails = matches.filter(isValidEmail);
            const priority = validEmails.find(e => e.toLowerCase().startsWith('info') || e.toLowerCase().startsWith('contact'));
            if (priority) return priority;
            if (validEmails.length > 0) return validEmails[0];
        }

        return null;
    } catch (error) {
        return null;
    }
}

function getEmailContent(agency: any, paymentLink: string) {
    const referralCode = "ORIO-6DF4";
    const profileUrl = `https://travelagencies.world/agencies/${agency.slug}`;
    const subject = `Invitation: Activate your profile on TravelAgencies.World`;

    // 1. CLEAN HTML FOR SENDING
    const emailHtmlV1 = `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
    <p>Hello <strong>${agency.title}</strong>,</p>
    
    <p>I hope this email finds you well.</p>
    
    <p>I am writing to inform you that <strong>${agency.title}</strong> is featured on 
    <a href="https://travelagencies.world" style="color: #2563eb; text-decoration: none;">TravelAgencies.World</a> 
    — the next-generation global directory connecting travelers with trusted travel professionals.</p>

    <p><strong>You can view your public profile here:</strong><br>
    <a href="${profileUrl}" style="color: #2563eb;">${profileUrl}</a></p>

    <h3>Why TravelAgencies.World?</h3>
    <p>We are building the smartest travel ecosystem on the web, combining a comprehensive directory with cutting-edge AI technology to drive growth for agencies like yours.</p>

    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
        <strong>🚀 Our Vision & Strategy:</strong><br>
        We believe the future of travel belongs to expert human agents empowered by technology. Our platform is aggressively expanding its SEO strategy to capture high-intent travelers and direct them straight to you, bypassing the noise of generic OTAs.
    </div>

    <p><strong>✨ Key Features:</strong></p>
    <ul>
        <li><strong>AI-Powered Chatbot:</strong> Our intelligent assistant understands traveler needs and recommends the specific agencies best suited to help them.</li>
        <li><strong>AI Trip Planner (Coming Soon):</strong> A revolutionary tool that builds complex itineraries and directly connects users with <em>Verified Agencies</em> to book them.</li>
        <li><strong>Global Visibility:</strong> Enhanced profiles with verified reviews, services, and direct contact options.</li>
    </ul>

    <h3>Exclusive Invitation</h3>
    <p>We are currently selecting our <strong>Founding Partners</strong>. I would like to invite you to claim your profile and become a Verified Agency to ensure you don't miss out on this wave of innovation.</p>

    <h3>Step 1: Create your account & Request Access</h3>
    <p>Please verify your ownership to unlock full control over your listing (photos, contacts, services).</p>

    <p>Use this <strong>VIP Referral Code</strong> during sign-up to fast-track your verification:<br>
    <span style="font-size: 18px; font-weight: bold; color: #2563eb; background: #eff6ff; padding: 5px 10px; border-radius: 4px;">${referralCode}</span></p>

    <p>Once you request access, I will personally send you the details to finalize your Founding Member status.</p>

    <p>Let’s build the future of travel together.</p>

    <p>Kind regards,<br>
    <strong>Oussama</strong><br>
    TravelAgencies.World</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 12px; color: #888;">You are receiving this notification because your business is listed in our public directory. 
    <a href="mailto:contact@travelagencies.world" style="color: #888;">Unsubscribe</a></p>
</div>`;

    // 2. DASHBOARD HTML (For manual use)
    const dashboardHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f9; padding: 20px; }
  .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 30px; }
  .agency-name { font-size: 24px; font-weight: 800; color: #2563eb; margin: 0; }
  .email-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1 class="agency-name">${agency.title}</h1>
    <p>Email: <strong>${agency.email || 'None'}</strong></p>
    <p>Profile: <a href="${profileUrl}">${profileUrl}</a></p>
  </div>
  <div class="email-card">
    <h3>Sent Content (HTML)</h3>
    ${emailHtmlV1}
  </div>
</div>
</body>
</html>`;

    return { subject, htmlBody: emailHtmlV1, dashboardHtml };
}

async function sendEmail(to: string, subject: string, html: string) {
    if (!transporter) return false;
    try {
        await transporter.sendMail({ from: SENDER_EMAIL, to, subject, html });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

async function main() {
    console.log('--- Starting Advanced Outreach Generator & Sender ---');

    let page = 0;
    const pageSize = 1000;
    let hasMore = true;
    let processedCount = 0;
    let sentCount = 0;
    let sendingRateLimitReached = false;

    while (hasMore) {
        console.log(`Fetching page ${page + 1}...`);

        const { data: agencies, error } = await supabase
            .from('agencies')
            .select('*')
            .not('website', 'is', null)
            .is('owner_id', null)
            .range(page * pageSize, (page + 1) * pageSize - 1)
            .order('id', { ascending: true });

        if (error || !agencies || agencies.length === 0) {
            hasMore = false;
            break;
        }

        console.log(`Processing ${agencies.length} agencies...`);

        for (const agency of agencies) {
            let email = agency.email;
            let emailUpdated = false;

            // 1. Scraping if needed
            if (!email || !isValidEmail(email)) {
                if (agency.website) {
                    process.stdout.write(`Scraping ${agency.title.substring(0, 30)}... `);
                    const scrapedEmail = await scrapeEmail(agency.website);
                    if (scrapedEmail) {
                        console.log(`Found: ${scrapedEmail}`);
                        email = scrapedEmail;
                        emailUpdated = true;
                    } else {
                        console.log('No email found.');
                    }
                }
            }

            // 2. Update DB
            if (emailUpdated && email) {
                await supabase.from('agencies').update({ email }).eq('id', agency.id);
            }

            // 3. Generate Dashboard & Prepare Content
            agency.email = email;

            // Only generate logs for agencies we actually have data for
            const content = getEmailContent(agency, '');
            const safeSlug = agency.slug || `agency-${agency.id}`;
            const filename = path.join(OUTPUT_DIR, `${safeSlug}.html`);
            fs.writeFileSync(filename, content.dashboardHtml);
            processedCount++;

            // 4. Send Email logic
            if (transporter && email && isValidEmail(email)) {
                if (hasSentEmail(agency.id)) {
                    // console.log(`⏩ Already sent to ${agency.id}`);
                    continue;
                }

                if (sentCount >= 100) {
                    if (!sendingRateLimitReached) {
                        console.log('\n🛑 Daily Limit of 100 emails reached. Switching to Scrape-Only mode.');
                        sendingRateLimitReached = true;
                    }
                } else {
                    process.stdout.write(`Sending to ${email}... `);
                    const sent = await sendEmail(email, content.subject, content.htmlBody);
                    if (sent) {
                        console.log('✅ Sent');
                        sentCount++;
                        logSentEmail(agency.id);
                        await sleep(5000);
                    } else {
                        console.log('❌ Failed');
                        await sleep(5000); // Wait on fail too to be safe
                    }
                }
            }
        }
        page++;
    }

    console.log('--- Finished ---');
    console.log(`Total Processed: ${processedCount}`);
    console.log(`Emails Sent Today: ${sentCount}`);
}

main().catch(console.error);
