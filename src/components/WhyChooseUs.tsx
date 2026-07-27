'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  const reasons = [
    { title: "Certified Therapists", desc: "Highly trained professionals with years of luxury wellness experience." },
    { title: "Premium Massage Oils", desc: "100% organic, locally sourced essential oils for deep nourishment." },
    { title: "Villa & Hotel Service", desc: "We bring the complete spa setup directly to your private accommodation." },
    { title: "Same-Day Booking", desc: "Flexible scheduling to fit your perfect Bali holiday itinerary." },
    { title: "Professional Wellness", desc: "Curated therapies focusing on holistic healing and deep relaxation." },
    { title: "Hygiene Standards", desc: "Impeccable cleanliness and sanitized equipment for every session." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.section 
      className="mb-24 relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-primary/[0.02] rounded-[40px] -z-10"></div>
      <div className="py-16 px-6 md:px-12 rounded-[40px] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-3 block">
            <span className="domain-ubud-only">Elexoir Standard</span>
            <span className="domain-bali-only">Our Standard</span>
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">Why Choose Our Mobile Spa</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => (
            <motion.div variants={itemVariants} key={idx} className="flex gap-5 group bg-white md:bg-transparent p-6 md:p-0 rounded-[24px] md:rounded-none shadow-sm md:shadow-none border border-black/5 md:border-transparent">
              <div>
                <h3 className="font-bold text-sm text-primary mb-2 uppercase tracking-wider">{item.title}</h3>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
