const fs = require("fs");
const path = require("path");

function getTodayDateStr() {
    const now = new Date();
    return new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
}

function processPageFiles(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, "utf8");

    // 1. Calendar Title
    code = code.replace(/<h2 className="font-serif text-2xl text-primary">When would you like this\?<\/h2>/g, '<h2 className="font-serif text-2xl text-primary">Select Date & Time</h2>');

    // 2. Fix Therapist Card Cutoff
    code = code.replace(/<div className="space-y-3 overflow-y-auto pb-8 pr-1 no-scrollbar">/g, '<div className="space-y-3 overflow-y-auto pb-8 px-2 -mx-2 no-scrollbar">');

    // 3. Capitalize Availability Labels
    code = code.replace(/Handling customer • Ready at/g, 'HANDLING CUSTOMER • READY AT');
    code = code.replace(/Ready to accept jobs/g, 'READY TO ACCEPT JOBS');

    // 4. Modal State Injection
    if (!code.includes('const [popupState, setPopupState] = useState')) {
        const modalState = `const [popupState, setPopupState] = useState<{isOpen: boolean, type: 'group' | 'time' | null, therapistId: string | null, availableAt: string, availableDate?: string}>({isOpen: false, type: null, therapistId: null, availableAt: ''});`;
        code = code.replace(/(const \[formData, setFormData\] = useState.*?;\n)/, `$1    ${modalState}\n`);
    }
    
    // Inject Custom Modal UI
    if (!code.includes('popupState.isOpen')) {
        const modalUI = `
            {/* Custom Therapist Popup Modal */}
            <AnimatePresence>
                {popupState.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setPopupState({ ...popupState, isOpen: false })}
                        ></div>
                        
                        {/* Modal Content */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white/70 backdrop-blur-[40px] border border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,1)] rounded-3xl p-6 sm:p-8 overflow-hidden text-center"
                        >
                            {popupState.type === 'group' ? (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-primary mb-2">Group Booking Alert</h3>
                                    <p className="text-sm text-text-muted mb-8 leading-relaxed">
                                        For group bookings, please select therapists who are currently <strong className="text-primary font-bold">'READY TO ACCEPT JOBS'</strong> to ensure synchronized scheduling.
                                    </p>
                                    <button 
                                        onClick={() => setPopupState({ ...popupState, isOpen: false })}
                                        className="w-full bg-[#292831] text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:bg-[#292831]/90 active:scale-95 transition-all"
                                    >
                                        Understood
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-primary mb-2">Adjust Booking Time?</h3>
                                    <p className="text-sm text-text-muted mb-8 leading-relaxed">
                                        This therapist will be ready at <strong className="text-primary font-bold">{popupState.availableAt}</strong>. Your booking time will be automatically updated to match their availability.
                                    </p>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setPopupState({ ...popupState, isOpen: false })}
                                            className="flex-1 bg-white/20 border border-white/40 text-primary px-4 py-3.5 rounded-2xl text-sm font-bold shadow-sm hover:bg-white/40 active:scale-95 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setFormData({ ...formData, time: popupState.availableAt, date: popupState.availableDate || formData.date });
                                                setSelectedTherapists([...selectedTherapists, popupState.therapistId as string]);
                                                setPopupState({ ...popupState, isOpen: false });
                                            }}
                                            className="flex-1 bg-[#292831] text-white px-4 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:bg-[#292831]/90 active:scale-95 transition-all"
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
`;
        const lastDivIndex = code.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
            code = code.substring(0, lastDivIndex) + modalUI + '\n' + code.substring(lastDivIndex);
        }
    }

    // 5. Replace alert and confirm with custom modal
    const clickRegex = /if \(t\.status === 'Busy'\) \{\s*if \(totalGuests > 1\) \{\s*alert\("For group bookings, please select therapists who are currently 'Ready to accept jobs'\."\);\s*return;\s*\}\s*if \(t\.availableAt\) \{\s*if \(confirm\(`This therapist will be ready at \$\{t\.availableAt\}\. Your booking time will be automatically updated to \$\{t\.availableAt\}\. Do you want to proceed\?`\)\) \{\s*setFormData\(\{\.\.\.formData, time: t\.availableAt\}\);\s*setSelectedTherapists\(\[\.\.\.selectedTherapists, t\.id\]\);\s*\}\s*\} else \{\s*setSelectedTherapists\(\[\.\.\.selectedTherapists, t\.id\]\);\s*\}\s*\}/g;
    const newLogic = `if (t.status === 'Busy') {
                                                            if (totalGuests > 1) {
                                                                setPopupState({ isOpen: true, type: 'group', therapistId: null, availableAt: '' });
                                                                return;
                                                            }
                                                            if (t.availableAt) {
                                                                setPopupState({ isOpen: true, type: 'time', therapistId: t.id, availableAt: t.availableAt, availableDate: t.availableDate });
                                                            } else {
                                                                setSelectedTherapists([...selectedTherapists, t.id]);
                                                            }
                                                        }`;
    code = code.replace(clickRegex, newLogic);
    
    // 6. Next-Day Availability Logic
    if (!code.includes('const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split("T")[0];')) {
        code = code.replace(/(const \[selectedTherapists, setSelectedTherapists\] = useState<string\[\]>\(\[\]\);)/, `$1\n    const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];\n`);
    }

    // Replace the filter/map strictly for MOCK_THERAPISTS
    const oldMapRegex = /\{MOCK_THERAPISTS\.filter\(t => t\.location === selectedArea\)\.map\(t => \(/g;
    const newMap = `{MOCK_THERAPISTS.filter(t => t.location === selectedArea).map(rawT => {
                                            const isFuture = formData.date && formData.date !== todayStr;
                                            const t = { ...rawT };
                                            if (isFuture && (!t.availableDate || t.availableDate !== formData.date)) {
                                                t.status = 'Online';
                                            }
                                            return (`;
    code = code.replace(oldMapRegex, newMap);
    
    // Explicitly find the specific closing string to avoid matching other map functions
    const targetCloseString = `                                        ))}
                                        {MOCK_THERAPISTS.filter(t => t.location === selectedArea).length === 0 && (`;
    
    const replacementCloseString = `                                        );})}
                                        {MOCK_THERAPISTS.filter(t => t.location === selectedArea).length === 0 && (`;
                                        
    code = code.replace(targetCloseString, replacementCloseString);

    fs.writeFileSync(filePath, code);
    console.log("Updated " + filePath);
}

function processDashboard(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, "utf8");

    // Add availableDate state
    if (!code.includes('const [availableDate, setAvailableDate] = useState')) {
        code = code.replace(`const [availableAt, setAvailableAt] = useState('');`, `const [availableAt, setAvailableAt] = useState('');\n    const [availableDate, setAvailableDate] = useState('');`);
    }

    // Add floating calendar next to time input
    const oldTimeInput = `<div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-top-2">
                                                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Available At:</span>
                                                        <input 
                                                            type="time" 
                                                            value={availableAt} 
                                                            onChange={e => setAvailableAt(e.target.value)} 
                                                            className="text-xs bg-transparent border-none focus:outline-none text-amber-900 font-bold w-20"
                                                        />
                                                    </div>`;
    
    const newInputs = `<div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-[20px] animate-in fade-in slide-in-from-top-2 shadow-sm">
                                                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Date & Time:</span>
                                                        <input 
                                                            type="date" 
                                                            value={availableDate} 
                                                            onChange={e => setAvailableDate(e.target.value)} 
                                                            className="text-xs bg-transparent border-none focus:outline-none text-amber-900 font-bold w-24 cursor-pointer"
                                                        />
                                                        <div className="w-[1px] h-4 bg-amber-200/50"></div>
                                                        <input 
                                                            type="time" 
                                                            value={availableAt} 
                                                            onChange={e => setAvailableAt(e.target.value)} 
                                                            className="text-xs bg-transparent border-none focus:outline-none text-amber-900 font-bold w-20 cursor-pointer"
                                                        />
                                                    </div>`;
    
    code = code.replace(oldTimeInput, newInputs);
    fs.writeFileSync(filePath, code);
    console.log("Updated " + filePath);
}

processPageFiles("src/app/page.tsx");
processPageFiles("src/app/rituals/[id]/page.tsx");
processDashboard("src/app/therapistdashboard/page.tsx");
