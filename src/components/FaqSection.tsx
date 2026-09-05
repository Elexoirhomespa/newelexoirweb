'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the best home spa in Bali?",
      a: "We are highly rated as one of the best luxury mobile spas in Bali. We specialize in bringing 5-star professional spa treatments, premium organic oils, and certified therapists directly to your private villa or hotel across the island."
    },
    {
      q: "Do you provide massage services in Canggu and Seminyak?",
      a: "Yes, we offer premium mobile massage and spa services directly to your villa or hotel in Canggu, Seminyak, Umalas, and surrounding areas. Skip the Bali traffic and let our therapists bring the luxury spa experience to your doorstep."
    },
    {
      q: "Is in-villa massage available in Ubud?",
      a: "Absolutely! Ubud is our home base. Whether you are staying in a jungle resort or a private villa in the cultural heart of Bali, our mobile spa service delivers profound relaxation with authentic Balinese techniques."
    },
    {
      q: "Do you offer couples massage?",
      a: "Our couples massage packages are our most popular service. Perfect for honeymooners and partners wanting to share a deeply relaxing, synchronized wellness experience without leaving the comfort of their accommodation."
    },
    {
      q: "Which massage is best after hiking Mount Batur or surfing?",
      a: "We highly recommend our Deep Tissue Massage or our specialized Back & Shoulder Massage. These treatments specifically target muscle tension, lactic acid buildup, and fatigue, ensuring a rapid and relaxing recovery after your Bali adventures."
    },
    {
      q: "Can therapists come to hotels and resorts in Nusa Dua or Uluwatu?",
      a: "Yes, our certified professional therapists can provide mobile massage services directly to your hotel room or private estate in Nusa Dua, Jimbaran, and Uluwatu. We operate seamlessly within Bali's top resorts to ensure utmost privacy."
    },
    {
      q: "What makes your mobile spa luxury?",
      a: "We recreate a premium spa environment in your space. We use luxurious 100% natural massage oils, bring fresh high-quality linens, soothing aromatherapy, and our therapists are rigorously trained in 5-star hospitality and advanced massage techniques."
    },
    {
      q: "How do I book a home spa treatment?",
      a: "Booking is simple and fast. Browse our treatments, select your duration and group size, and securely confirm your appointment instantly via WhatsApp with our concierge team. We even offer same-day booking depending on availability."
    }
  ];

  return (
    <section className="mb-12 md:mb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-0">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-3 block">FAQ</span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-white border ${openIdx === idx ? 'border-primary/30 shadow-[0_10px_30px_rgb(0,0,0,0.04)]' : 'border-border/50'} rounded-3xl overflow-hidden transition-all duration-300`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 md:p-8 text-left focus:outline-none"
              >
                <h3 className="font-bold text-sm md:text-base text-primary pr-6 md:pr-8">{faq.q}</h3>
                <div className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-300 ${openIdx === idx ? 'bg-primary text-white border-primary' : 'bg-surface text-primary border-border'}`}>
                  {openIdx === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 md:px-8 pb-5 md:pb-8 pt-0">
                      <p className="text-sm md:text-base text-text-muted font-light leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
