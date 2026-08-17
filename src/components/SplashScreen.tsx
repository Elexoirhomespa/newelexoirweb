'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setMounted(true);

    if (sessionStorage.getItem("splashDone")) {
      setShowSplash(false);
      setIsReady(true);
    }
  }, []);

  const checkReady = useCallback(() => {
    if (document.readyState !== "complete") return false;
    const images = document.querySelectorAll("img");
    for (const img of images) {
      if (img.loading === "lazy") continue;
      if (!img.complete) return false;
    }
    return true;
  }, []);

  // Smooth progress interpolation — animates toward target
  useEffect(() => {
    if (!showSplash || isReady) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.5) return targetProgress;
        // Ease toward target: fast when far, slow when close
        return prev + diff * 0.08;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [targetProgress, showSplash, isReady]);

  useEffect(() => {
    if (!mounted || !showSplash) return;
    if (!isMobile) {
      setIsReady(true);
      return;
    }

    const MIN_SPLASH_MS = 2000;
    const MAX_SPLASH_MS = 6000;
    let minTimerDone = false;
    let resourcesReady = false;

    // Stage-based progress targets
    const stageTimer1 = setTimeout(() => setTargetProgress(25), 200);
    const stageTimer2 = setTimeout(() => setTargetProgress(45), 600);
    const stageTimer3 = setTimeout(() => setTargetProgress(65), 1000);
    const stageTimer4 = setTimeout(() => setTargetProgress(80), 1500);

    const tryDismiss = () => {
      if (minTimerDone && resourcesReady) {
        setTargetProgress(100);
        setTimeout(() => {
          setIsReady(true);
          sessionStorage.setItem("splashDone", "1");
        }, 400);
      }
    };

    const minTimer = setTimeout(() => {
      minTimerDone = true;
      tryDismiss();
    }, MIN_SPLASH_MS);

    const maxTimer = setTimeout(() => {
      setTargetProgress(100);
      setTimeout(() => {
        setIsReady(true);
        sessionStorage.setItem("splashDone", "1");
      }, 300);
    }, MAX_SPLASH_MS);

    const poll = setInterval(() => {
      if (checkReady()) {
        resourcesReady = true;
        setTargetProgress(92);
        clearInterval(poll);
        tryDismiss();
      }
    }, 150);

    const onLoad = () => {
      resourcesReady = true;
      setTargetProgress(92);
      clearInterval(poll);
      tryDismiss();
    };
    window.addEventListener("load", onLoad);

    const onAppReady = () => {
      resourcesReady = true;
      setTargetProgress(92);
      clearInterval(poll);
      tryDismiss();
    };
    window.addEventListener("app-content-ready", onAppReady);

    return () => {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      clearTimeout(stageTimer4);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearInterval(poll);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("app-content-ready", onAppReady);
    };
  }, [mounted, isMobile, showSplash, checkReady]);

  if ((!isMobile && mounted) || !showSplash) return <>{children}</>;
  if (!mounted) return <div style={{ visibility: "hidden" }}>{children}</div>;

  return (
    <>
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black"
            style={{ touchAction: "none" }}
          >
            {/* Soft ambient gradient */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-white text-black/8 blur-[120px] opacity-10" />
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-gray-200/20 blur-[100px] opacity-10" />
            </div>

            {/* Logo container removed per request */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-8">
                {/* No Logo */}
              </div>
            </div>

            {/* Progress section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="absolute bottom-[14%] flex flex-col items-center gap-3 w-[200px]"
            >
              <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="text-white/60 text-[11px] font-bold tabular-nums tracking-wide">
                {Math.round(progress)}%
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-[6%] text-white text-[10px] font-semibold tracking-[0.15em] uppercase"
            >
              Bali, Indonesia
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ visibility: isReady ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
