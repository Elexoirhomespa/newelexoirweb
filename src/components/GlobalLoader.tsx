'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpa } from '@/context/SpaContext';

export default function GlobalLoader() {
    const { isLoaded, siteBrandFilter } = useSpa();
    const [showLoader, setShowLoader] = useState(true);
    const [progress, setProgress] = useState(1);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (!isLoaded) {
            setShowLoader(true);
            setProgress(1);
            
            // Fast continuous progress while waiting
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return 90; // Wait at 90%
                    return prev + 5; 
                });
            }, 50);
        } else {
            // Data is ready - shoot to 100% and gracefully exit
            setProgress(100);
            setTimeout(() => {
                setShowLoader(false);
            }, 300); // 300ms pause at 100% before fading out
        }
        
        return () => clearInterval(interval);
    }, [isLoaded]);

    return (
        <AnimatePresence>
            {showLoader && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="flex flex-col items-center justify-center w-full max-w-sm px-8">
                        <div className="flex flex-col items-center gap-10 w-full">
                            
                            {/* Removed brand title per request */}

                            {/* Progress Section */}
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-white/60 text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans font-light">
                                        Preparing Sanctuary
                                    </span>
                                    <span className="text-white font-mono text-xs md:text-sm tracking-widest font-light">
                                        {progress}%
                                    </span>
                                </div>
                                
                                {/* Thin Line Progress Bar */}
                                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                                    <motion.div 
                                        className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        initial={{ width: "1%" }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.1, ease: "linear" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
