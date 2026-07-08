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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "www.therapickhomespaubud.com";
  const isBaliDomain = host.includes("balihomespaandmassage.com");

  if (isBaliDomain) {
    return {
      metadataBase: new URL('https://www.balihomespaandmassage.com'),
      title: {
        default: "Bali Home Spa & Massage | Best In-Villa Massage Delivery Bali",
        template: "%s | Bali Home Spa"
      },
      description: "Looking for the best massage in Bali? We deliver premium, 5-star professional spa treatments directly to your private villa or hotel. Serving Seminyak, Canggu, Kuta, and Nusa Dua. Book now for ultimate relaxation!",
      keywords: [
        "Best Massage Bali", "Bali Home Spa", "In Villa Massage Bali", "Mobile Spa Bali", "Luxury Home Spa Bali", 
        "Balinese Massage Bali", "Deep Tissue Massage Bali", "Couples Massage Bali", "Massage near me Bali",
        "Spa Treatment Bali", "Massage Delivery Bali", "Canggu Home Spa", "Seminyak Home Spa", "Sanur Home Spa", 
        "Nusa Dua Home Spa", "Jimbaran Home Spa", "Kuta Massage", "Professional Massage Bali"
      ],
      authors: [{ name: "Bali Home Spa & Massage" }],
      creator: "Bali Home Spa & Massage",
      publisher: "Bali Home Spa & Massage",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/icon.png',
      },
      openGraph: {
        title: "Bali Home Spa & Massage | Premium In-Villa Massage Delivery",
        description: "Voted Bali's premier mobile spa. Elevate your relaxation with our signature professional massages and couples treatments delivered to your door.",
        url: 'https://www.balihomespaandmassage.com',
        siteName: 'Bali Home Spa & Massage',
        images: [
          {
            url: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
            width: 1200,
            height: 630,
            alt: 'Bali Home Spa - Luxury Mobile Spa & Massage in Bali',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Bali Home Spa & Massage | Best In-Villa Massage Delivery Bali',
        description: 'Voted Bali\'s premier mobile spa. Elevate your relaxation with signature professional massages delivered directly to your villa.',
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

  return {
    metadataBase: new URL('https://www.therapickhomespaubud.com'),
    title: {
      default: "Therapick Home Spa | #1 Luxury Mobile Spa & In-Villa Massage Ubud",
      template: "%s | Therapick Home Spa Bali"
    },
    description: "Experience Bali's top-rated luxury mobile spa. Professional in-villa massages, couples treatments & holistic rituals delivered directly to your hotel or villa in Ubud. Book your 5-star sanctuary today!",
    keywords: [
      "Ubud Massage", "Best Spa Ubud", "Ubud Home Spa", "In Villa Massage Ubud", "Mobile Spa Ubud",
      "Private Massage Ubud", "Luxury Home Spa Bali", "Couples Massage Ubud", "Deep Tissue Massage Ubud",
      "Balinese Massage Ubud", "Massage Delivery Ubud", "Spa Treatment Ubud", "Wellness Ubud", 
      "Professional Massage Bali"
    ],
    authors: [{ name: "Therapick Spa" }],
    creator: "Therapick Spa",
    publisher: "Therapick Spa",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
    openGraph: {
      title: "Therapick Home Spa | #1 Luxury Mobile Spa & In-Villa Massage Ubud",
      description: "Experience Bali's top-rated luxury mobile spa. Professional in-villa massages & holistic treatments delivered directly to your hotel or villa in Ubud.",
      url: 'https://www.therapickhomespaubud.com',
      siteName: 'Therapick Home Spa Bali',
      images: [
        {
          url: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
          width: 1200,
          height: 630,
          alt: 'Therapick Home Spa - Luxury Mobile Spa & Massage in Bali',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Therapick Home Spa | #1 Luxury Mobile Spa & In-Villa Massage Ubud',
      description: 'Experience Bali\'s top-rated luxury mobile spa. Professional in-villa massages & holistic treatments delivered directly to your hotel or villa in Ubud.',
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

export const viewport: Viewport = {
  themeColor: "#D2F34C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") || "www.therapickhomespaubud.com";
  const isBaliDomain = host.includes("balihomespaandmassage.com");

  const name = isBaliDomain ? "Bali Home Spa & Massage" : "Therapick Home Spa";
  const url = isBaliDomain ? "https://www.balihomespaandmassage.com" : "https://www.therapickhomespaubud.com";
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'DaySpa'],
    name: name,
    image: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg',
    '@id': url,
    url: url,
    telephone: '+6285174119423',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Sri Wedari, Ubud',
      addressLocality: 'Gianyar',
      addressRegion: 'Bali',
      postalCode: '80571',
      addressCountry: 'ID'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -8.5069,
      longitude: 115.2625
    },
    areaServed: isBaliDomain ? [
      { '@type': 'City', name: 'Seminyak' },
      { '@type': 'City', name: 'Canggu' },
      { '@type': 'City', name: 'Kuta' },
      { '@type': 'City', name: 'Legian' },
      { '@type': 'City', name: 'Jimbaran' },
      { '@type': 'City', name: 'Nusa Dua' },
      { '@type': 'City', name: 'Uluwatu' },
      { '@type': 'City', name: 'Sanur' },
      { '@type': 'City', name: 'Ubud' }
    ] : [
      { '@type': 'City', name: 'Ubud' },
      { '@type': 'City', name: 'Canggu' },
      { '@type': 'City', name: 'Seminyak' },
      { '@type': 'City', name: 'Uluwatu' },
      { '@type': 'City', name: 'Sanur' },
      { '@type': 'City', name: 'Nusa Dua' },
      { '@type': 'City', name: 'Jimbaran' },
      { '@type': 'City', name: 'Kuta' }
    ],
    priceRange: "$$$",
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ],
      opens: '09:00',
      closes: '22:00'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '154',
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: [
      'https://instagram.com/therapickspa'
    ],
    description: isBaliDomain 
      ? 'Looking for the best massage in Bali? We deliver premium, 5-star professional spa treatments directly to your private villa or hotel. Serving Seminyak, Canggu, Kuta, and Nusa Dua. Book now for ultimate relaxation!' 
      : 'Experience Bali\'s top-rated luxury mobile spa. Professional in-villa massages, couples treatments & holistic rituals delivered directly to your hotel or villa in Ubud. Book your 5-star sanctuary today!'
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Luxury Mobile Massage and In-Villa Spa Service',
    provider: {
      '@type': 'LocalBusiness',
      name: name,
      image: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg'
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '-8.5069',
        longitude: '115.2625'
      },
      geoRadius: '50000'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: '250000',
      highPrice: '1500000',
      offerCount: '20'
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best home spa in Bali?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${name} is highly rated as one of the best luxury mobile spas in Bali, offering 5-star professional treatments directly to your villa or hotel.`
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide massage in villas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isBaliDomain 
            ? 'Yes, we specialize in in-villa massages and home spa services across Bali, including Seminyak, Canggu, Kuta, Jimbaran, and Nusa Dua.'
            : 'Yes, we specialize in in-villa massages and home spa services across Bali, including Ubud, Canggu, Seminyak, and Uluwatu.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer couples massage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Our couples massage packages are perfect for honeymooners and partners wanting to relax together in the comfort of their own accommodation.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can therapists come to hotels?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our certified professional therapists can provide mobile massage services directly to your hotel room or private villa with instant confirmation.'
        }
      }
    ]
  };

  return (
    <html lang="en" className="antialiased scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body
        data-domain={isBaliDomain ? "bali" : "ubud"}
        className={`${jakarta.variable} ${newsreader.variable} font-sans bg-transparent text-text min-h-screen selection:bg-primary selection:text-white pb-20`}
      >
        <SpaProvider>
            <TopNav />
            <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
              {children}
            </main>
        </SpaProvider>
      </body>
    </html>
  );
}
