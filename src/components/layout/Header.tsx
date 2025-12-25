"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, Menu, X, MapPin, Phone, Globe } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/agencies", label: "Find Agencies" },
    { href: "/destinations", label: "Destinations" },
    { href: "/blog", label: "Travel Guide" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Worldwide Directory</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">2670+ Agencies Listed</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <a href="tel:+33745075668" className="hover:underline">
              +33 7 45 07 56 68
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/travellogos/travelagencies-text-blue-no-background.png"
              alt="TravelAgencies.World"
              width={180}
              height={44}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons / User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <Link href="/account" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                    {user.user_metadata?.full_name || user.email}
                  </Link>
                  { /* simplified user menu for now */}
                  <button
                    onClick={handleSignOut}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-foreground/80 hover:text-primary font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                  >
                    Register
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground/80 hover:text-primary font-medium transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              {!loading && (
                user ? (
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <Link href="/account" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-700 font-medium px-2 hover:text-primary transition-colors">
                      {user.user_metadata?.full_name || user.email}
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-2 py-2 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 mt-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center text-foreground/80 hover:text-primary font-medium transition-colors border border-gray-200 py-2 rounded-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-center hover:bg-primary/90 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
