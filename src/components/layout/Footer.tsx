"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin, Send, CheckCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navigation');
  const tCommon = useTranslations('Common');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      // Call our API route to add contact to Brevo
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing! 🎉");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const footerLinks = {
    explore: [
      { href: "/agencies", label: tNav('agencies') },
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
      { href: "/for-agencies", label: t('partner') },
      { href: "/about", label: tNav('about') },
      { href: "/contact", label: tNav('contact') },
      { href: "/privacy", label: t('privacy') },
      { href: "/terms", label: t('terms') },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/travellogos/travelagencies-text-white-no-background.png"
                alt="TravelAgencies.World"
                width={180}
                height={44}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-slate-400 mb-6 max-w-md">
              {tCommon('description')}
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

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h3 className="text-white font-semibold text-lg mb-3">
                📧 Subscribe to Our Newsletter
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Get travel tips, exclusive deals, and CAN 2025 updates!
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-slate-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : status === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </form>
              {message && (
                <p className={`mt-2 text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
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
              © {currentYear} TravelAgencies.World. {t('rights')}
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
