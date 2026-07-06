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

    const oldGlass = 'bg-white/40 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
    const newLiquidGlass = 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]';

    // Replace the previous generic glassmorphism
    content = content.split(oldGlass).join(newLiquidGlass);
    
    // Pattern 6 from before
    content = content.replace(/bg-white\/40 backdrop-blur-3xl border border-white\/50/g, 'bg-white/10 backdrop-blur-[40px] border border-white/40');
    
    // Top Nav / specific search inputs like in LocationClient.tsx
    content = content.replace(/bg-white\/70 backdrop-blur-md border border-white\/50/g, 'bg-white/10 backdrop-blur-[40px] border border-white/40');
    
    // Other inputs with bg-white/50
    content = content.replace(/bg-white\/50 border border-border\/50/g, 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]');
    
    // TopNav specific active menu items
    content = content.replace(/bg-white\/70 saturate-\[1\.8\] backdrop-blur-xl border-white\/60/g, 'bg-white/10 backdrop-blur-[40px] border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]');
    content = content.replace(/bg-white\/95 backdrop-blur-3xl border border-border\/30/g, 'bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)]');

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
    console.log("Done patching liquid glass styles!");
}

run();
