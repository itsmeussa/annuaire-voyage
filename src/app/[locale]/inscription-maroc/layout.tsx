import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription Agence de Voyage Maroc | Rejoignez +4000 Agences",
  description: "Inscrivez votre agence de voyage au Maroc sur l'annuaire leader. Rejoignez plus de 4000 professionnels, améliorez votre visibilité et recevez des leads qualifiés.",
  keywords: [
    "inscription agence voyage Maroc",
    "CAN 2025 agence voyage",
    "agence voyage Casablanca",
    "agence voyage Marrakech",
    "agence voyage Rabat",
    "annuaire agence voyage Maroc",
    "référencer agence voyage",
    "visibilité agence voyage",
    "Coupe Afrique Nations 2025",
    "AFCON 2025 Maroc",
    "tourisme Maroc 2025",
    "agence voyage internationale",
    "listing agence voyage",
  ],
  openGraph: {
    title: "Inscrivez Votre Agence de Voyage | CAN 2025 Maroc",
    description: "Offre spéciale CAN 2025: Inscrivez votre agence marocaine pour 500 DH. Visibilité internationale. Casablanca, Marrakech, Rabat.",
    url: "https://www.travelagencies.world/inscription-maroc",
    type: "website",
    locale: "fr_MA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Inscription Agence de Voyage Maroc - CAN 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inscription Agence Voyage Maroc | CAN 2025",
    description: "500 DH pour une visibilité internationale. CAN 2025 opportunité unique.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/inscription-maroc",
    languages: {
      "fr-MA": "/inscription-maroc",
      "ar-MA": "/inscription-maroc",
      "en": "/inscription-maroc",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
