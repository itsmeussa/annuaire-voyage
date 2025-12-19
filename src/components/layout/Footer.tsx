import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { href: "/agencies", label: "Browse Agencies" },
      { href: "/destinations", label: "Destinations" },
      { href: "/blog", label: "Travel Guide" },
      { href: "/agencies?rating=5", label: "Top Rated" },
    ],
    destinations: [
      { href: "/agencies?country=MA", label: "Morocco" },
      { href: "/agencies?country=FR", label: "France" },
      { href: "/agencies?country=US", label: "USA" },
      { href: "/agencies?country=CA", label: "Canada" },
      { href: "/agencies?country=GB", label: "United Kingdom" },
      { href: "/agencies?country=AE", label: "UAE" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  TravelAgencies
                </span>
                <span className="text-xs text-slate-400 -mt-1">.World</span>
              </div>
            </Link>
            <p className="text-slate-400 mb-6 max-w-md">
              Your trusted free global directory with 4000+ verified travel agencies
              worldwide. Compare ratings, read real Google reviews, and connect directly with
              travel professionals in Morocco, France, USA, Canada & more.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/orioustrategy/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/orioustrategy/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/orioustrategy"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/orioustrategy"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Top Destinations
            </h3>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a
              href="mailto:contact@travelagencies.world"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              contact@travelagencies.world
            </a>
            <a
              href="tel:+33745075668"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              +33 7 45 07 56 68
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Worldwide Coverage
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>
              © {currentYear} TravelAgencies.World. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              Developed with ❤️ by{" "}
              <a
                href="https://orioustrategy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Orious Strategy
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
