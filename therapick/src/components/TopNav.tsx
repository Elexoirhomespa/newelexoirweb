'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Store, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const desktopNavItems = [
        { href: '/', label: 'HOME' },
        { href: '/store', label: 'STORE' },
        { href: '/rituals', label: 'TREATMENT' },
        { href: '/review', label: 'REVIEW' },
        { href: '/contact', label: 'CONTACT' },
    ];

    const mobileNavItems = [
        { href: '/', label: 'HOME' },
        { href: '/philosophy', label: 'PHILOSOPHY' },
        { href: '/why-choose-us', label: 'WHY CHOOSE US' },
        { href: '/service-areas', label: 'SERVICE AREAS' },
        { href: '/faq', label: 'FAQ' },
        { href: '/review', label: 'REVIEW' },
        { href: '/contact', label: 'CONTACT' },
    ];

    // Scroll listener for dynamic navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Hide TopNav on admin and store routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/store')) {
        return null;
    }

    return (
        <div className="fixed top-0 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none md:px-4">
            <header 
                className={`pointer-events-auto flex items-center justify-between relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border will-change-auto
                    ${isScrolled 
                        ? 'translate-y-4 md:translate-y-0 w-[calc(100%-32px)] md:w-full max-w-6xl bg-white/70 saturate-[1.8] backdrop-blur-xl border-white/60 rounded-[32px] md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 py-2 md:py-3' 
                        : 'translate-y-0 md:translate-y-0 w-full md:w-full max-w-7xl md:max-w-6xl bg-transparent md:bg-white/70 md:saturate-[1.8] md:backdrop-blur-xl border-transparent md:border-white/60 shadow-none md:shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-none md:rounded-full px-4 md:px-8 py-4 md:py-3'}
                `} 
                ref={dropdownRef}
                style={{ transformOrigin: 'top center' }}
            >
                
                {/* Brand / Store (Left) */}
                <a href="/store" className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 shadow-sm rounded-full pl-3 pr-4 h-9 transition-colors hover:bg-white/30 text-primary shrink-0">
                    <Store size={16} strokeWidth={2.5} />
                    <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase mt-0.5">
                        STORE
                    </span>
                </a>

                {/* Logo (Center) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer group">
                    <img src="/logo.png" alt="Therapick Logo" className="h-16 md:h-20 w-auto object-contain scale-[1.5] md:scale-[1.7]" />
                </div>

                {/* Desktop Inline Links (Always visible on desktop) */}
                <nav className={`hidden md:flex items-center gap-4 md:gap-8`}>
                    {desktopNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <a 
                                key={item.href}
                                href={item.href} 
                                className={`text-[11px] md:text-[13px] font-semibold tracking-wider transition-colors whitespace-nowrap ${
                                    isActive ? 'text-primary' : 'text-primary/60 hover:text-primary'
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Dropdown Toggle Button (Visible on mobile ALWAYS) */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-primary transition-colors hover:bg-black/5 shrink-0 md:hidden`}
                    aria-label="Toggle Navigation"
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* Dropdown Menu (Mobile Only) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute top-[120%] right-0 w-48 shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col p-2 bg-white/95 backdrop-blur-3xl border border-border/30 rounded-2xl z-50 md:hidden`}
                        >
                            {mobileNavItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <a 
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors ${
                                            isActive 
                                                ? 'bg-surface text-primary' 
                                                : 'text-text-muted hover:bg-surface/50 hover:text-primary'
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

            </header>
        </div>
    );
}
