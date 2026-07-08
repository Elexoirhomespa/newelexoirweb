import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { SpaProvider } from "@/context/SpaContext";
import { headers } from "next/headers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#D2F34C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "www.elexoirhomespaubud.com";
  const isBaliDomain = host.includes("balihomespaandmassage.com");

  const name = isBaliDomain ? "Bali Home Spa & Massage" : "Elexoir Home Spa";
  const url = isBaliDomain ? "https://www.balihomespaandmassage.com" : "https://www.elexoirhomespaubud.com";
  const title = isBaliDomain ? "Bali Home Spa & Massage | Luxury Mobile Spa" : "Elexoir Home Spa | #1 Luxury Mobile Spa & In-Villa Massage Ubud";
  const description = isBaliDomain 
      ? 'Looking for the best massage in Bali? We deliver premium, 5-star professional spa treatments directly to your private villa or hotel. Serving Seminyak, Canggu, Kuta, and Nusa Dua. Book now for ultimate relaxation!' 
      : 'Experience Bali\'s top-rated luxury mobile spa. Professional in-villa massages, couples treatments & holistic rituals delivered directly to your hotel or villa in Ubud. Book your 5-star sanctuary today!';

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s | ${name}`
    },
    description: description,
    keywords: [
      name, "Choose Massage Therapist Bali", "Book Available Therapist Bali", 
      "On-Demand Massage Bali", "Mobile Spa Bali", "In Villa Massage Bali", 
      "Bali Therapist Booking", "Professional Massage Bali", "Ubud Massage Therapist", 
      "Canggu Massage Therapist", "Seminyak Massage Therapist", "Massage near me Bali"
    ],
    authors: [{ name: name }],
    creator: name,
    publisher: name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: name,
      images: [
        {
          url: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
          width: 1200,
          height: 630,
          alt: `${name} - Luxury Mobile Spa & Massage in Bali`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg'],
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    manifest: "/manifest.json",
    other: {
      'geo.region': 'ID-BA',
      'geo.placename': 'Bali',
      'geo.position': '-8.4095;115.1889',
      'ICBM': '-8.4095, 115.1889',
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") || "www.elexoirhomespaubud.com";
  const isBaliDomain = host.includes("balihomespaandmassage.com");

  const name = isBaliDomain ? "Bali Home Spa & Massage" : "Elexoir Home Spa";
  const url = isBaliDomain ? "https://www.balihomespaandmassage.com" : "https://www.elexoirhomespaubud.com";
  
  return (
    <html lang="en" className="antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        data-domain={isBaliDomain ? "bali" : "ubud"}
        className={`${jakarta.variable} ${newsreader.variable} font-sans bg-transparent text-text min-h-screen selection:bg-primary selection:text-white pb-20`}
      >
        <SpaProvider>
          <div className="flex flex-col min-h-screen w-full relative">
            <TopNav />
            <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
              {children}
            </main>
          </div>
        </SpaProvider>
      </body>
    </html>
  );
}
