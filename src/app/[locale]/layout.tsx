import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import "leaflet/dist/leaflet.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PromoBanner from "@/components/ui/PromoBanner";
import ChatBot from "@/components/ui/ChatBot";
import { ChatBotProvider } from "@/components/ui/ChatBotContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravelAgencies.World - 2670+ Verified Travel Agencies Worldwide | CAN 2025 Morocco",
    template: "%s | TravelAgencies.World",
  },
  description:
    "Find and compare 2670+ verified travel agencies worldwide. Best Morocco travel agencies for CAN 2025 Africa Cup of Nations. Top-rated agencies in Casablanca, Marrakech, Rabat, France, USA, Canada & UK. Real Google reviews & direct contact.",
  keywords: [
    "travel agencies",
    "tour operators",
    "travel directory",
    "CAN 2025",
    "Africa Cup of Nations 2025",
    "Morocco travel agencies",
    "AFCON 2025 travel",
    "Casablanca travel agency",
    "Marrakech travel agency",
    "Rabat travel agency",
    "agence de voyage Maroc",
    "agence voyage Casablanca",
    "voyage CAN 2025",
    "Morocco tour operators",
    "best travel agencies 2025",
    "USA travel agents",
    "Canada tour operators",
    "France travel agencies",
    "worldwide travel agencies",
    "travel agency reviews",
    "New York travel agency",
    "Toronto travel agency",
    "travel agency near me",
    "book travel agent",
    "top rated travel agencies",
    "vacation planning 2025",
    "tour packages Morocco",
    "football travel packages",
    "sports travel agency",
  ],
  authors: [{ name: "Orious Strategy", url: "https://orioustrategy.com" }],
  creator: "Orious Strategy",
  publisher: "Orious Strategy",
  metadataBase: new URL("https://www.travelagencies.world"),
  icons: {
    icon: [
      { url: "/travellogos/144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="icon" href="/travellogos/144x144.png" type="image/png" />
      </head>
      <body className={poppins.className}>
        <NextIntlClientProvider messages={messages}>
          <ChatBotProvider>
            <div className="flex flex-col min-h-screen">
              {/* <PromoBanner /> */}
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ScrollToTop />
            <ChatBot />
          </ChatBotProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
