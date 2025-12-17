import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - TravelAgencies.World",
  description:
    "Read the terms and conditions for using TravelAgencies.World travel agency directory.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/80">Last updated: December 2024</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using TravelAgencies.World ("the Website"), you
                accept and agree to be bound by these Terms of Service. If you do
                not agree to these terms, please do not use our website.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                TravelAgencies.World is a directory service that provides
                information about travel agencies worldwide. We aggregate
                publicly available data from Google Places to help users find and
                compare travel agencies.
              </p>

              <h2>3. Use of the Website</h2>
              <p>You agree to use this website only for lawful purposes. You may not:</p>
              <ul>
                <li>Use the website in any way that violates applicable laws</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Upload malicious code or content</li>
              </ul>

              <h2>4. Information Accuracy</h2>
              <p>
                While we strive to provide accurate and up-to-date information,
                the data displayed on our website is sourced from third-party
                services (primarily Google Places). We do not guarantee the
                accuracy, completeness, or reliability of this information.
              </p>
              <p>
                <strong>Important:</strong> Before engaging with any travel
                agency, we recommend verifying their credentials, reading
                reviews, and conducting your own due diligence.
              </p>

              <h2>5. No Endorsement</h2>
              <p>
                The inclusion of a travel agency in our directory does not
                constitute an endorsement or recommendation. We are not
                responsible for the services, quality, or reliability of any
                travel agency listed on our website.
              </p>

              <h2>6. Third-Party Links</h2>
              <p>
                Our website contains links to external websites, including
                travel agency websites and Google Maps. We are not responsible
                for the content, privacy practices, or services of these
                third-party sites.
              </p>

              <h2>7. Intellectual Property</h2>
              <p>
                The website design, logos, content, and code are the property of
                Orious Strategy and are protected by intellectual property laws.
                You may not reproduce, distribute, or create derivative works
                without our express written permission.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, TravelAgencies.World and
                its operators shall not be liable for any direct, indirect,
                incidental, special, or consequential damages resulting from your
                use of the website or any transactions with travel agencies found
                through our directory.
              </p>

              <h2>9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless TravelAgencies.World,
                its operators, and Orious Strategy from any claims, damages, or
                expenses arising from your use of the website or violation of
                these terms.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any
                time. Changes will be effective immediately upon posting to the
                website. Your continued use of the website constitutes acceptance
                of the modified terms.
              </p>

              <h2>11. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with
                applicable laws. Any disputes shall be resolved in the
                appropriate courts.
              </p>

              <h2>12. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>Email: contact@travelagencies.world</li>
                <li>
                  Developer: <a href="https://oriousstrategy.com">Orious Strategy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
