const fs = require('fs');

const file = 'src/app/layout.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Update Title
content = content.replace(/Elexoir Home Spa \| Choose Available Therapists in Your Area/g, 'Elexoir Home Spa | Premium Mobile Massage & Spa in Bali');
content = content.replace(/Elexoir Home Spa - Find Massage Therapists/g, 'Elexoir Home Spa - Premium Mobile Massage in Bali');

// Update Description
content = content.replace(/Find and book available professional massage therapists in your area on-demand\. Browse therapist profiles, check availability, and book your premium home spa experience in Bali( today\.)?/g, 'Experience luxury mobile massage and premium in-villa spa services across Ubud, Seminyak, Canggu, and Bali. Professional therapists brought directly to your door for the ultimate relaxation.');

// Update Image
content = content.replace(/3757952\/pexels-photo-3757952\.jpeg/g, '3951375/pexels-photo-3951375.jpeg');
content = content.replace(/6724391\/pexels-photo-6724391\.jpeg/g, '3951375/pexels-photo-3951375.jpeg');

fs.writeFileSync(file, content, 'utf-8');
console.log('Fixed Elexoir SEO');
