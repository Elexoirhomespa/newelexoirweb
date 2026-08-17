'use client';

import React, { useEffect, useState } from 'react';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  // A completely Zero-React-Dependency splash screen!
  // This executes instantly during the HTML parsing phase, 
  // making it completely immune to slow network connections or JS bundle sizes.
  
  const [isReactDismissed, setIsReactDismissed] = useState(false);

  useEffect(() => {
    // If it's already done before React hydrates, dismiss instantly
    if (sessionStorage.getItem("splashDone") === "1" && document.documentElement.classList.contains("skip-splash")) {
      setIsReactDismissed(true);
    }

    const handleSplashComplete = () => {
      setIsReactDismissed(true);
    };

    window.addEventListener("splashComplete", handleSplashComplete);
    return () => window.removeEventListener("splashComplete", handleSplashComplete);
  }, []);

  const vanillaScript = `
    (function() {
      if (window.innerWidth >= 768 || sessionStorage.getItem("splashDone")) {
        document.documentElement.classList.add("skip-splash");
        return;
      }

      var minTime = 2000;
      var maxTime = 6000;
      var startTime = Date.now();
      var isLoaded = false;
      var isDismissed = false;
      var targetProgress = 15;
      var currentProgress = 0;

      function updateBar() {
        if (isDismissed) return;
        var diff = targetProgress - currentProgress;
        currentProgress += diff * 0.15;
        var bar = document.getElementById("splash-progress-bar");
        if (bar) bar.style.width = currentProgress + "%";
        var text = document.getElementById("splash-progress-text");
        if (text) text.innerText = Math.round(currentProgress) + "%";
        if (currentProgress < 99) requestAnimationFrame(updateBar);
      }
      requestAnimationFrame(updateBar);

      // Fake progress for HTML parsing
      setTimeout(function() { if (targetProgress < 40) targetProgress = 40; }, 200);
      
      // Track actual document readiness
      document.addEventListener("readystatechange", function() {
        if (document.readyState === "interactive") targetProgress = 60;
        if (document.readyState === "complete") targetProgress = 90;
      });

      function checkImages() {
        var images = document.querySelectorAll('img:not([loading="lazy"])');
        if (images.length === 0) return;
        var loaded = 0;
        for (var i = 0; i < images.length; i++) {
          if (images[i].complete) loaded++;
        }
        var imgProgress = 60 + ((loaded / images.length) * 35);
        if (imgProgress > targetProgress) targetProgress = imgProgress;
      }

      function dismiss() {
        if (isDismissed) return;
        isDismissed = true;
        sessionStorage.setItem("splashDone", "1");
        
        document.documentElement.classList.add("dismissing-splash");
        
        var splash = document.getElementById("splash-screen-container");
        if (splash) {
          var bar = document.getElementById("splash-progress-bar");
          if (bar) bar.style.width = "100%";
          setTimeout(function() { 
            document.documentElement.classList.remove("dismissing-splash");
            document.documentElement.classList.add("skip-splash");
            window.dispatchEvent(new Event("splashComplete"));
          }, 600);
        } else {
            document.documentElement.classList.add("skip-splash");
            window.dispatchEvent(new Event("splashComplete"));
        }
        
        var children = document.getElementById("splash-children-container");
        if (children) children.classList.add("!visible");
      }

      function checkDismiss() {
        var elapsed = Date.now() - startTime;
        if (isLoaded && elapsed >= minTime) {
          targetProgress = 100;
          setTimeout(dismiss, 100);
        }
      }

      window.addEventListener("load", function() {
        isLoaded = true;
        targetProgress = 95;
        checkDismiss();
      });

      var timer = setInterval(function() {
        checkImages();
        var elapsed = Date.now() - startTime;
        if (elapsed >= minTime) {
          checkDismiss();
          if (elapsed >= maxTime) {
            clearInterval(timer);
          }
        }
      }, 150);

      setTimeout(dismiss, maxTime);
    })();
  `;

  const splashHTML = `
    <div id="splash-screen-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffff; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; touch-action: none;">
      <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden;">
        <div style="position: absolute; top: 20%; left: 50%; transform: translateX(-50%); width: 400px; height: 400px; border-radius: 50%; background-color: rgba(210, 243, 76, 0.05); filter: blur(120px); opacity: 0.6;"></div>
      </div>
      <div style="position: relative; z-index: 10; width: 80%; max-width: 320px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px;">
          <h2 style="color: #1D1D1F; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 500; opacity: 0.8; margin: 0;">
            PREPARING SANCTUARY
          </h2>
          <span id="splash-progress-text" style="color: #1D1D1F; font-size: 11px; font-family: monospace; letter-spacing: 0.1em; opacity: 0.8;">
            0%
          </span>
        </div>
        <div style="width: 100%; height: 1px; background-color: rgba(0,0,0,0.1); position: relative; overflow: hidden;">
          <div id="splash-progress-bar" style="position: absolute; top: 0; left: 0; height: 100%; background-color: #1D1D1F; width: 0%;"></div>
        </div>
      </div>
    </div>
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: vanillaScript }} />
      <style dangerouslySetInnerHTML={{
        __html: `
          html.dismissing-splash #splash-screen-container { 
            opacity: 0 !important; 
            pointer-events: none !important;
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          html.skip-splash #splash-screen-container { display: none !important; }
          html.skip-splash #splash-children-container { visibility: visible !important; opacity: 1 !important; transition: opacity 0.4s ease-in; }
          
          @media (min-width: 768px) {
            #splash-screen-container { display: none !important; }
          }
        `
      }} />

      {!isReactDismissed && (
        <div dangerouslySetInnerHTML={{ __html: splashHTML }} />
      )}

      <div 
        id="splash-children-container"
        className={isReactDismissed ? "" : "max-md:invisible"}
      >
        {children}
      </div>
    </>
  );
}
