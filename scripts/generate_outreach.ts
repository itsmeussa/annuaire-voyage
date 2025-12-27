import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const OUTPUT_DIR = path.join(process.cwd(), 'generated_emails');
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

function getEmailContent(agency: any) {
    const referralCode = "ORIO-6DF4";
    const profileUrl = `https://travelagencies.world/agencies/${agency.slug}`;
    const claimUrl = `https://travelagencies.world/claim-agency?agency_id=${agency.id}`;

    // Subject for Email 1
    const subject1 = `Invitation: Activate your profile on TravelAgencies.World`;

    // ---------------------------------------------------------
    // EMAIL 1: INVITATION (HTML for Sending)
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // EMAIL 2: PAYMENT / FOLLOW-UP (HTML for Dashboard only)
    // ---------------------------------------------------------
    const emailHtmlV2 = `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
    <p>Hello again <strong>${agency.title}</strong>,</p>
    
    <p>Thank you for requesting access to your profile! We have received your request.</p>
    
    <p><strong>Step 2: Finalize Verification (Founding Offer)</strong><br>
    Since you are among the first 200 agencies to claim your profile, you are eligible for our one-time Founding Member price of €100 (instead of the future monthly subscription).</p>

    <p>This secures:</p>
    <ul>
        <li>Permanent Verified Badge (Trust Signal)</li>
        <li>Full control to edit your listing (Photos, Contacts, Services)</li>
        <li>Priority ranking in search results</li>
    </ul>

    <p style="text-align: center; margin: 30px 0;">
        <a href="${claimUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">Activate Ownership Now</a>
    </p>

    <p><small>(Link: <a href="${claimUrl}">${claimUrl}</a>)</small></p>

    <p>Welcome to the verified network!</p>
    
    <p>Kind regards,<br>
    <strong>Oussama</strong><br>
    TravelAgencies.World</p>
</div>`;

    // ---------------------------------------------------------
    // DASHBOARD HTML (With Copy Buttons)
    // ---------------------------------------------------------
    const dashboardHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f9; padding: 20px; }
  .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 30px; }
  .agency-name { font-size: 24px; font-weight: 800; color: #2563eb; margin: 0; }
  .meta { font-size: 14px; color: #666; margin-top: 5px; }
  .email-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 30px; position: relative; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
  .card-title { font-weight: 700; font-size: 18px; color: #111; margin: 0; }
  .btn-copy { background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; transition: background 0.2s; }
  .btn-copy:hover { background: #1d4ed8; }
  .btn-copy:active { transform: translateY(1px); }
  .content-preview { background: #fafafa; border: 1px solid #eee; padding: 15px; border-radius: 4px; font-size: 14px; overflow-x: auto; }
</style>
<script>
async function copyToClipboard(id) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        await navigator.clipboard.writeText(el.innerText);
        alert('Copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy', err);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = el.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied to clipboard!');
    }
}
</script>
</head>
<body>
<div class="container">
  <div class="header">
    <h1 class="agency-name">${agency.title}</h1>
    <div class="meta">
        <p>Email: <strong>${agency.email || 'None'}</strong></p>
        <p>Profile: <a href="${profileUrl}" target="_blank">${profileUrl}</a></p>
        <p>Payment Link: <a href="${claimUrl}" target="_blank">${claimUrl}</a></p>
    </div>
  </div>

  <!-- EMAIL 1 -->
  <div class="email-card">
    <div class="card-header">
        <h3 class="card-title">Email 1: Invitation (Sent Automatically)</h3>
        <button class="btn-copy" onclick="copyToClipboard('email1')">Copy HTML</button>
    </div>
    <div id="email1" style="display:none;">${emailHtmlV1}</div>
    <div class="content-preview">
        ${emailHtmlV1}
    </div>
  </div>

  <!-- EMAIL 2 -->
  <div class="email-card">
    <div class="card-header">
        <h3 class="card-title">Email 2: Payment / Follow-up (Manual)</h3>
        <button class="btn-copy" onclick="copyToClipboard('email2')">Copy HTML</button>
    </div>
    <div id="email2" style="display:none;">${emailHtmlV2}</div>
    <div class="content-preview">
        ${emailHtmlV2}
    </div>
  </div>

</div>
</body>
</html>`;

    return { subject: subject1, htmlBody: emailHtmlV1, dashboardHtml };
}

async function sendEmail(to: string, subject: string, html: string) {
    if (!transporter) return false;
    try {
        const info = await transporter.sendMail({
            from: SENDER_EMAIL,
            to,
            bcc: 'contact@travelagencies.world',
            subject,
            html
        });
        console.log(`SMTP Response: ${info.response}`);
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

            // 3. Generate Dashboard & Prepare Content (ALWAYS DO THIS)
            agency.email = email;
            const content = getEmailContent(agency); // Generates V1 and V2 HTML

            const safeSlug = agency.slug || `agency-${agency.id}`;
            const filename = path.join(OUTPUT_DIR, `${safeSlug}.html`);
            fs.writeFileSync(filename, content.dashboardHtml);
            processedCount++;

            // 4. Send Email logic
            if (transporter && email && isValidEmail(email)) {

                // SKIP MOROCCO & FRANCE (Sending only)
                const country = agency.country?.toLowerCase() || '';
                if (country.includes('morocco') || country.includes('maroc') || country.includes('france')) {
                    // console.log(`Skipping email send for ${agency.title} (${agency.country})`);
                    continue;
                }

                if (hasSentEmail(agency.id)) {
                    // console.log(`⏩ Already sent to ${agency.id}`);
                    continue;
                }

                if (sentCount >= 100) {
                    if (!sendingRateLimitReached) {
                        console.log('\n🛑 Daily Limit of 100 emails reached. Switching to file-generation mode only.');
                        sendingRateLimitReached = true;
                    }
                } else {
                    process.stdout.write(`Sending to ${email}... `);
                    const sent = await sendEmail(email, content.subject, content.htmlBody); // Sending V1
                    if (sent) {
                        console.log('✅ Sent');
                        sentCount++;
                        logSentEmail(agency.id);

                        // FIXED DELAY (Anti-Spam)
                        console.log(`⏳ Waiting 10s...`);
                        await sleep(10000);
                    } else {
                        console.log('❌ Failed');
                        await sleep(5000); // 5s wait on failure
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
