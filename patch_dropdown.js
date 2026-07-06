const fs = require("fs");
const path = require("path");

const navPath = "src/components/TopNav.tsx";
let code = fs.readFileSync(navPath, "utf8");

// 1. Fix mobileNavItems
const mobileNavSearch = `    const mobileNavItems = [
        { href: '/', label: 'HOME' },
        { href: '/philosophy', label: 'PHILOSOPHY' },
        { href: '/why-choose-us', label: 'WHY CHOOSE US' },
        { href: '/service-areas', label: 'SERVICE AREAS' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'CONTACT' },
    ];`;

const mobileNavReplace = `    const mobileNavItems = [
        { href: '/', label: 'HOME' },
        { href: '/philosophy', label: 'PHILOSOPHY' },
        { href: '/why-choose-us', label: 'WHY CHOOSE US' },
        { href: '/service-areas', label: 'SERVICE AREAS' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'CONTACT' },
        { href: '/therapist-login', label: 'THERAPIST PORTAL' },
    ];`;
code = code.replace(mobileNavSearch, mobileNavReplace);

// 2. Enhance dropdown logic to be full width
const dropdownClassSearch = `className=\`absolute top-[120%] right-0 w-48 shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col p-2 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] rounded-2xl z-50 md:hidden\``;

const dropdownClassReplace = `className=\`absolute top-[115%] left-0 right-0 w-full shadow-[0_30px_60px_rgb(0,0,0,0.12)] overflow-hidden flex flex-col p-3 bg-white/80 saturate-[1.5] backdrop-blur-[40px] border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] rounded-3xl z-50 md:hidden\``;

code = code.replace(dropdownClassSearch, dropdownClassReplace);

// Let's also style the Therapist Portal link specifically in the mobile menu to stand out!
const mobileMapSearch = `                                        className={\`px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors \${
                                            isActive 
                                                ? 'bg-surface text-primary' 
                                                : 'text-text-muted hover:bg-surface/50 hover:text-primary'
                                        }\`}`;
                                        
const mobileMapReplace = `                                        className={\`px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors \${
                                            item.href === '/therapist-login' 
                                                ? 'bg-[#292831] text-white mt-2 text-center' // Standout style for therapist portal
                                                : isActive 
                                                    ? 'bg-surface text-primary' 
                                                    : 'text-text-muted hover:bg-surface/50 hover:text-primary'
                                        }\`}`;

code = code.replace(mobileMapSearch, mobileMapReplace);


fs.writeFileSync(navPath, code);
console.log("Updated Dropdown");
