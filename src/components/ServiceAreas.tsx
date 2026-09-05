'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet
const ServiceMap = dynamic(() => import('./ServiceMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface/50 rounded-[28px] border border-border/40 flex items-center justify-center animate-pulse">
      <span className="text-xs font-bold uppercase tracking-widest text-primary/40">Loading Map...</span>
    </div>
  )
});

export default function ServiceAreas({ hideHeader = false }: { hideHeader?: boolean }) {
  const areas = [
    { name: "Ubud", slug: "ubud", desc: "Premium mobile spa in the cultural heart of Bali." },
    { name: "Canggu", slug: "canggu", desc: "Luxury home massage for the vibrant coastal lifestyle." },
    { name: "Seminyak", slug: "seminyak", desc: "Exclusive in-villa spa treatments in Seminyak." },
    { name: "Uluwatu", slug: "uluwatu", desc: "Relaxing cliff-side villa massage experiences." },
    { name: "Sanur", slug: "sanur", desc: "Tranquil mobile wellness brought to your Sanur hotel." },
    { name: "Nusa Dua", slug: "nusa-dua", desc: "5-star spa delivery to Nusa Dua resorts and villas." },
    { name: "Jimbaran", slug: "jimbaran", desc: "Sunset relaxation with our Jimbaran mobile spa." },
    { name: "Kuta", slug: "kuta", desc: "Professional massage therapies delivered to Kuta." }
  ];

  return (
    <section className="relative">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-2 md:mb-3 block">Service Areas</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary leading-tight mb-3 md:mb-4">We Come to Your Sanctuary</h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light domain-ubud-only">
              Elexoir Home Spa provides luxury mobile massage and wellness services directly to private villas, estates, and hotels across Bali's most prestigious locations.
            </p>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light domain-bali-only">
              We provide luxury mobile massage and wellness services directly to private villas, estates, and hotels across Bali's most prestigious locations.
            </p>
          </div>
        </div>
      )}

      {/* Map Integration */}
      <div className={`w-full ${hideHeader ? 'h-[320px] sm:h-[350px] mb-8 mt-2' : 'h-[260px] sm:h-[320px] md:h-[400px] mb-6 md:mb-8'} md:h-[400px] rounded-[24px] md:rounded-[36px] overflow-hidden shadow-soft border border-border/50`}>
        <ServiceMap />
      </div>

      {/* Responsive Grid Cards (Visible on both Mobile & Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {areas.map((area, idx) => (
          <Link href={`/locations/${area.slug}`} key={idx} className="group block outline-none">
            <div className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-[20px] md:rounded-3xl p-4 md:p-6 transition-all duration-300 hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] hover:border-primary/30 hover:-translate-y-1 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <h3 className="font-serif text-base sm:text-lg md:text-xl text-primary font-medium">{area.name}</h3>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                </div>
                <p className="text-[11px] md:text-xs text-text-muted leading-relaxed font-light line-clamp-2 md:line-clamp-none">{area.desc}</p>
              </div>
              <div className="mt-3 pt-2 md:pt-3 border-t border-border/40 flex items-center justify-between text-[10px] md:text-[11px] font-bold text-primary/70 uppercase tracking-wider group-hover:text-primary transition-colors">
                <span>View Treatments</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
