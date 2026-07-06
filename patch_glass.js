const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = [
    'src/app',
    'src/components'
];

function scanDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath, fileList);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function replaceStylesInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Pattern 1: standard card
    content = content.replace(/bg-white border border-\[\#E5E7EB\]/g, 'bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
    
    // Pattern 2: bordered card
    content = content.replace(/bg-white border border-border\/50/g, 'bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
    content = content.replace(/bg-white border border-border\/40/g, 'bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
    
    // Pattern 3: therapist dashboard and specific cards
    content = content.replace(/bg-white p-6 md:p-10 rounded-\[32px\] border border-border\/50 shadow-soft/g, 'bg-white/40 backdrop-blur-2xl p-6 md:p-10 rounded-[32px] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
    content = content.replace(/bg-white p-6 rounded-\[24px\] border border-border\/50 shadow-sm/g, 'bg-white/40 backdrop-blur-2xl p-6 rounded-[24px] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
    
    // Pattern 4: admin/payment cards
    content = content.replace(/bg-white rounded-\[40px\] p-10 md:p-16 text-center max-w-lg w-full shadow-\[0_20px_40px_rgb\(0,0,0,0\.08\)\] border border-border\/50/g, 'bg-white/40 backdrop-blur-2xl rounded-[40px] p-10 md:p-16 text-center max-w-lg w-full shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-white/50');
    content = content.replace(/bg-white rounded-\[32px\] p-6 flex flex-col items-center text-center shadow-sm/g, 'bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[32px] p-6 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
    
    // Pattern 5: ServiceAreas and WhyChooseUs
    content = content.replace(/bg-white rounded-3xl p-5 transition-all duration-300 shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\]/g, 'bg-white/40 backdrop-blur-2xl border border-white/50 rounded-3xl p-5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
    content = content.replace(/bg-white md:bg-transparent p-6 md:p-0 rounded-\[24px\] md:rounded-none shadow-sm md:shadow-none border border-black\/5 md:border-transparent/g, 'bg-white/40 backdrop-blur-2xl md:bg-transparent p-6 md:p-0 rounded-[24px] md:rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:shadow-none border border-white/50 md:border-transparent');
    
    // Pattern 6: Mobile sidebars / modals
    content = content.replace(/bg-white rounded-none md:rounded-\[32px\] p-6 md:p-8 w-full h-\[100dvh\] md:h-auto md:max-h-\[90vh\] md:max-w-md shadow-2xl relative/g, 'bg-white/40 backdrop-blur-3xl border border-white/50 rounded-none md:rounded-[32px] p-6 md:p-8 w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md shadow-2xl relative');
    
    // Pattern 7: Modals / Admin Login
    content = content.replace(/w-full max-w-md bg-white rounded-\[32px\] shadow-\[0_20px_40px_rgb\(0,0,0,0\.08\)\] p-8 border border-border\/50/g, 'w-full max-w-md bg-white/40 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_40px_rgb(0,0,0,0.08)] p-8 border border-white/50');
    
    // Pattern 8: Store items
    content = content.replace(/bg-white p-3 rounded-2xl shadow-sm border border-\[\#F3F4F6\]/g, 'bg-white/40 backdrop-blur-2xl p-3 rounded-2xl shadow-sm border border-white/50');
    
    // Pattern 9: Generic catch-all for bg-white on some other rounded elements (like autocomplete dropdown)
    // Only replacing very specific ones so we don't break simple white text or icons
    content = content.replace(/bg-white border border-border rounded-none shadow-none max-h-60/g, 'bg-white/40 backdrop-blur-2xl border border-white/50 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-h-60');
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
}

function run() {
    const files = [];
    DIRECTORIES_TO_SCAN.forEach(dir => {
        files.push(...scanDir(path.join(__dirname, dir)));
    });

    for (const file of files) {
        replaceStylesInFile(file);
    }
    console.log("Done patching glassmorphism styles!");
}

run();
