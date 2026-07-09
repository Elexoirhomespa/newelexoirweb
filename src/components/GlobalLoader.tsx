'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpa } from '@/context/SpaContext';

export default function GlobalLoader() {
    const { isLoading, siteBrandFilter } = useSpa();
    const [showLoader, setShowLoader] = useState(true);

    // Add a slight delay before unmounting the loader to ensure a smooth transition
    // and wait for the rest of the application to render.
    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 500); // 500ms extra padding for hydration and image rendering
            return () => clearTimeout(timer);
        } else {
            setShowLoader(true);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {showLoader && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="flex flex-col items-center gap-10">
                        {/* Elegant spinning loading animation */}
                        <div className="relative flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 border-2 border-white/10 border-t-[#D2F34C] rounded-full absolute"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border border-white/5 border-b-white/50 rounded-full absolute"
                            />
                        </div>

                        {/* Premium Copy */}
                        <div className="flex flex-col items-center gap-3 mt-8">
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-white font-serif tracking-[0.3em] md:tracking-[0.4em] text-xl md:text-2xl uppercase"
                            >
                                {siteBrandFilter === 'bali' ? 'Bali Home Spa' : 'Elexoir'}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-white/60 text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans font-light"
                            >
                                Preparing Your Sanctuary
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
