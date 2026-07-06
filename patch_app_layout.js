const fs = require("fs");
const path = require("path");

// 1. Hide TopNav on Therapist Routes
const navPath = "src/components/TopNav.tsx";
let navCode = fs.readFileSync(navPath, "utf8");

const hideNavSearch = `    if (pathname?.startsWith('/admin') || pathname?.startsWith('/store')) {
        return null;
    }`;
const hideNavReplace = `    if (
        pathname?.startsWith('/admin') || 
        pathname?.startsWith('/store') || 
        pathname?.startsWith('/therapist-login') || 
        pathname?.startsWith('/therapistdashboard')
    ) {
        return null;
    }`;

navCode = navCode.replace(hideNavSearch, hideNavReplace);
fs.writeFileSync(navPath, navCode);


// 2. Remove "required" from Therapist Login fields so user can just click next
const loginPath = "src/app/therapist-login/page.tsx";
let loginCode = fs.readFileSync(loginPath, "utf8");

// We'll just replace `required` with `/* optional for now */` or simply remove it.
loginCode = loginCode.replace(/required/g, '');

// Wait, the TopNav is also imported and rendered directly in therapist-login:
// `<TopNav />` inside `src/app/therapist-login/page.tsx`
// If it returns null, that's fine. But we can also remove it from the layout entirely.
// Actually, it's better if the TopNav handles its own visibility, which it now does.
// To make it an "app layout", maybe we should add a custom back button to the login page?
const backButtonHTML = `
            {/* Custom App-like Back Button */}
            <div className="absolute top-6 left-4 z-50">
                <button 
                    onClick={() => router.push('/')}
                    className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-white/60 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
            </div>
`;
const mainSearch = `<main className="min-h-screen bg-[#FDFDFD] selection:bg-primary/10 relative overflow-hidden flex flex-col">
            {/* Minimal Background Gradients */}`;
const mainReplace = `<main className="min-h-screen bg-[#FDFDFD] selection:bg-primary/10 relative overflow-hidden flex flex-col">
${backButtonHTML}
            {/* Minimal Background Gradients */}`;

if (!loginCode.includes('Custom App-like Back Button')) {
    loginCode = loginCode.replace(mainSearch, mainReplace);
}

fs.writeFileSync(loginPath, loginCode);
console.log("Updated Routes");
