'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet
const ServiceMap = dynamic(() => import('./ServiceMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface/50 rounded-3xl border border-border/40 flex items-center justify-center animate-pulse">
      <span className="text-xs font-bold uppercase tracking-widest text-primary/40">Loading Map...</span>
    </div>
  )
});

export default function ServiceAreas() {
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
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-3 block">Service Areas</span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-4">We Come to Your Sanctuary</h2>
          <p className="text-sm text-text-muted leading-relaxed font-light domain-ubud-only">
            Elexoir Home Spa provides luxury mobile massage and wellness services directly to private villas, estates, and hotels across Bali's most prestigious locations.
          </p>
          <p className="text-sm text-text-muted leading-relaxed font-light domain-bali-only">
            We provide luxury mobile massage and wellness services directly to private villas, estates, and hotels across Bali's most prestigious locations.
          </p>
        </div>
      </div>

      {/* Mobile Map Integration */}
      <div className="md:hidden w-full h-[450px] mb-6">
        <ServiceMap />
      </div>

      {/* Desktop Grid Cards (Hidden on Mobile) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 md:pb-0">
        {areas.map((area, idx) => (
          <Link href={`/locations/${area.slug}`} key={idx} className="group block outline-none shrink-0 w-[260px] md:w-auto snap-center">
            <div className="bg-white border border-border/40 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:border-primary/20 hover:-translate-y-1 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl text-primary font-medium">{area.name}</h3>
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed font-light flex-1">{area.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
