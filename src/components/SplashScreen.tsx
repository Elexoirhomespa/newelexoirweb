'use client';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  // A completely Zero-React-Dependency splash screen!
  // This executes instantly during the HTML parsing phase, 
  // making it completely immune to slow network connections or JS bundle sizes.
  
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
          }, 600);
        } else {
            document.documentElement.classList.add("skip-splash");
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
          html.skip-splash #splash-children-container { visibility: visible !important; }
        `
      }} />

      <div
        id="splash-screen-container"
        className="md:hidden fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white"
        style={{ touchAction: "none" }}
      >
        {/* Soft ambient gradient for light theme */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] opacity-60" />
        </div>

        <div className="relative z-10 w-[80%] max-w-[320px]">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-[#1D1D1F] text-[10px] uppercase tracking-[0.2em] font-medium opacity-80">
              PREPARING SANCTUARY
            </h2>
            <span id="splash-progress-text" className="text-[#1D1D1F] text-[11px] font-mono tracking-widest opacity-80">
              0%
            </span>
          </div>

          {/* Thin Line Progress Bar */}
          <div className="w-full h-[1px] bg-black/10 relative overflow-hidden">
            <div id="splash-progress-bar" className="absolute top-0 left-0 h-full bg-[#1D1D1F]" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      <div 
        id="splash-children-container"
        className="max-md:invisible"
      >
        {children}
      </div>
    </>
  );
}
