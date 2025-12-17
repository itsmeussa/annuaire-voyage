import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - TravelAgencies.World",
  description:
    "Learn about how TravelAgencies.World collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/80">Last updated: December 2024</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2>Introduction</h2>
              <p>
                TravelAgencies.World ("we," "our," or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, and safeguard your information when you visit our
                website.
              </p>

              <h2>Information We Collect</h2>
              <p>We may collect information about you in various ways:</p>
              <ul>
                <li>
                  <strong>Personal Data:</strong> When you contact us through our
                  forms, we collect your name, email address, and any message
                  content you provide.
                </li>
                <li>
                  <strong>Usage Data:</strong> We automatically collect
                  information about how you access and use our website, including
                  your IP address, browser type, pages visited, and time spent on
                  pages.
                </li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our service</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Improve our website and user experience</li>
                <li>Send you relevant updates (with your consent)</li>
                <li>Analyze usage patterns and trends</li>
              </ul>

              <h2>Data Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to outside parties. This does not include trusted
                third parties who assist us in operating our website, conducting
                our business, or servicing you, as long as those parties agree to
                keep this information confidential.
              </p>

              <h2>Cookies</h2>
              <p>
                Our website may use cookies to enhance your experience. Cookies
                are small files stored on your device that help us understand how
                you use our site. You can choose to disable cookies through your
                browser settings.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                Our website displays information sourced from Google Places. By
                using our website, you acknowledge that this data is provided by
                Google and is subject to Google's privacy policies.
              </p>

              <h2>Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over the
                Internet is 100% secure, and we cannot guarantee absolute
                security.
              </p>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <ul>
                <li>Email: contact@travelagencies.world</li>
                <li>
                  Website: <a href="https://oriousstrategy.com">Orious Strategy</a>
                </li>
              </ul>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
