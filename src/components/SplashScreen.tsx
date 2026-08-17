'use client';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  // A completely Zero-React-Dependency splash screen!
  // This executes instantly during the HTML parsing phase, 
  // making it completely immune to slow network connections or JS bundle sizes.
  
  const vanillaScript = `
    (function() {
      // 1. If desktop or already seen, skip instantly
      if (window.innerWidth >= 768 || sessionStorage.getItem("splashDone")) {
        document.documentElement.classList.add("skip-splash");
        return;
      }

      // 2. Setup timers for the splash screen
      var minTime = 2000; // Let the 2s CSS animation finish
      var maxTime = 6000; // Fail-safe
      var startTime = Date.now();
      var isLoaded = false;
      var isDismissed = false;

      function dismiss() {
        if (isDismissed) return;
        isDismissed = true;
        sessionStorage.setItem("splashDone", "1");
        
        var splash = document.getElementById("splash-screen-container");
        if (splash) {
          splash.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
          splash.style.opacity = "0";
          setTimeout(function() {
            splash.style.display = "none";
          }, 600);
        }
        
        var children = document.getElementById("splash-children-container");
        if (children) {
          children.classList.add("!visible");
        }
      }

      function checkDismiss() {
        var elapsed = Date.now() - startTime;
        if (isLoaded && elapsed >= minTime) {
          dismiss();
        }
      }

      window.addEventListener("load", function() {
        isLoaded = true;
        checkDismiss();
      });

      var timer = setInterval(function() {
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
          html.skip-splash #splash-screen-container { display: none !important; }
          html.skip-splash #splash-children-container { visibility: visible !important; }
          
          @keyframes load-progress {
            0% { width: 0%; }
            60% { width: 85%; }
            100% { width: 100%; }
          }
          .animate-load-progress {
            animation: load-progress 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
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

        <div className="relative z-10 flex flex-col items-center justify-center w-[200px] mt-[-20px]">
          <div className="animate-pulse mb-5">
            <h2 className="text-[#1D1D1F] text-[13px] font-serif font-medium tracking-wider drop-shadow-sm opacity-80">
              Preparing your sanctuary...
            </h2>
          </div>

          {/* Progress section (Native CSS Animation) */}
          <div className="w-full h-[3px] bg-black/5 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-primary rounded-full animate-load-progress shadow-sm" />
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
