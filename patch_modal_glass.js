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

    // 1. Fix modal container backgrounds (which accidentally got liquid glass) to white
    const modalGlass = 'bg-white/10 backdrop-blur-[40px] border border-white/40 rounded-none md:rounded-[32px] p-6 md:p-8 w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md shadow-2xl relative';
    const modalWhite = 'bg-white rounded-none md:rounded-[32px] p-6 md:p-8 w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-md shadow-2xl relative';
    content = content.replace(new RegExp(modalGlass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), modalWhite);

    const liquidGlassClasses = 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]';

    // 2. Change inner cards to liquid glass
    content = content.replace(/bg-surface border border-border\/50 rounded-2xl p-4 shadow-sm relative/g, `${liquidGlassClasses} rounded-2xl p-4 relative`);
    
    // 3. Change inner inputs to liquid glass
    content = content.replace(/bg-surface border border-border\/50 rounded-xl/g, `${liquidGlassClasses} rounded-xl`);
    
    // 4. Change admin/dashboard specific cards
    content = content.replace(/bg-surface border border-border\/50 rounded-2xl h-\[50px\]/g, `${liquidGlassClasses} rounded-2xl h-[50px]`);
    
    // 5. Change Floating Calendar
    content = content.replace(/bg-surface\/80 backdrop-blur-xl border border-border\/50 rounded-2xl p-4 shadow-sm relative/g, `${liquidGlassClasses} rounded-2xl p-4 relative`);

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
    console.log("Done fixing modal backgrounds and inner cards!");
}

run();
