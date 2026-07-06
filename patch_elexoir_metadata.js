const fs = require('fs');

const file = 'src/app/layout.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Replace Therapick Bali with Elexoir Home Spa
content = content.replace(/Therapick Bali/g, 'Elexoir Home Spa');
content = content.replace(/therapickbali\.vercel\.app/g, 'www.elexoirhomespaubud.com');

// Replace old image with the summer retreat image published on the website
content = content.replace(/6724391\/pexels-photo-6724391\.jpeg/g, '3757952/pexels-photo-3757952.jpeg');

fs.writeFileSync(file, content, 'utf-8');
console.log('Done replacing metadata');
