const fs = require("fs");
const path = require("path");

const navPath = "src/components/TopNav.tsx";
let code = fs.readFileSync(navPath, "utf8");

// 1. Add to Mobile Nav Items
const mobileItemsSearch = `        { href: '/contact', label: 'CONTACT' },
    ];`;
const mobileItemsReplace = `        { href: '/contact', label: 'CONTACT' },
        { href: '/therapist-login', label: 'THERAPIST PORTAL' },
    ];`;
code = code.replace(mobileItemsSearch, mobileItemsReplace);

// 2. Add to Desktop Nav (Styled as a pill next to the regular nav)
const desktopNavSearch = `                </nav>

                {/* Dropdown Toggle Button (Visible on mobile ALWAYS) */}`;
const desktopNavReplace = `                </nav>
                
                {/* Desktop Therapist Portal Button */}
                <a 
                    href="/therapist-login"
                    className="hidden md:flex items-center justify-center bg-white/40 hover:bg-white/60 text-primary border border-white/60 px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors shadow-sm ml-2"
                >
                    THERAPIST PORTAL
                </a>

                {/* Dropdown Toggle Button (Visible on mobile ALWAYS) */}`;
code = code.replace(desktopNavSearch, desktopNavReplace);

fs.writeFileSync(navPath, code);
console.log("Updated TopNav");
