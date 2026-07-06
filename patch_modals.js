const fs = require('fs');
const path = require('path');

const pageFile = 'src/app/page.tsx';
const ritualFile = 'src/app/rituals/[id]/page.tsx';
const dashboardFile = 'src/app/therapistdashboard/page.tsx';

function updateFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Update MOCK_THERAPISTS
    content = content.replace(
        /status: 'Busy' \},/g,
        "status: 'Busy', availableAt: '13:00' },"
    );

    // Divider in When would you like this?
    content = content.replace(
        /<p className="text-xs text-text-muted mb-6 shrink-0">Select the date and time for your booking\.<\/p>/g,
        `<p className="text-xs text-text-muted mb-4 shrink-0">Select the date and time for your booking.</p>\n                                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 mb-6 shrink-0"></div>`
    );

    // Divider in Where are you staying?
    content = content.replace(
        /<p className="text-xs text-text-muted mb-6 shrink-0">Select your area in Bali so we can match you with nearby therapists\.<\/p>/g,
        `<p className="text-xs text-text-muted mb-4 shrink-0">Select your area in Bali so we can match you with nearby therapists.</p>\n                                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 mb-6 shrink-0"></div>`
    );

    // Therapist Modal Section
    const oldTherapistHeader = `<p className="text-xs text-text-muted mb-4 shrink-0">Therapists available in {selectedArea}. You need {totalGuests} therapist{totalGuests > 1 ? 's' : ''}. Selected: {selectedTherapists.length}/{totalGuests}</p>
                                    <div className="space-y-3 overflow-y-auto pb-8 pr-1 no-scrollbar">
                                        <button
                                            onClick={() => { setSelectedTherapists([]); setBookingStep(5); }}
                                            className={\`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all \${selectedTherapists.length === 0 ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:border-primary/30 bg-surface'}\`}
                                        >
                                            <span className="font-bold text-primary text-sm tracking-wide">Assign Automatically</span>
                                            <ArrowRight className="w-4 h-4 text-text-muted" />
                                        </button>`;
                                        
    const newTherapistHeader = `<p className="text-xs text-text-muted mb-4 shrink-0">Therapists available in {selectedArea}.</p>
                                    <div className="w-full h-[1px] bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 mb-6 shrink-0"></div>
                                    <div className="space-y-3 overflow-y-auto pb-8 pr-1 no-scrollbar">
                                        <button
                                            onClick={() => { setSelectedTherapists([]); setBookingStep(5); }}
                                            className={\`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all \${selectedTherapists.length === 0 ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:border-primary/30 bg-surface'}\`}
                                        >
                                            <span className="font-bold text-primary text-sm tracking-wide">Assign Automatically</span>
                                            <ArrowRight className="w-4 h-4 text-text-muted" />
                                        </button>
                                        <div className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] p-4 rounded-2xl flex items-center justify-between my-2">
                                            <span className="text-xs font-bold text-primary/80 uppercase tracking-widest">Therapists Needed</span>
                                            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{selectedTherapists.length} / {totalGuests}</span>
                                        </div>`;
                                        
    content = content.replace(oldTherapistHeader, newTherapistHeader);

    // Update Status display in Modal (Ready to Book, Online Available at)
    const oldStatusLabel = `{t.status === 'Off' ? (
                                                            <span className="text-[10px] font-bold text-red-500/80 bg-red-50 px-2 py-1 rounded">Offline</span>
                                                        ) : t.status === 'Busy' ? (
                                                            <span className="text-[10px] font-bold text-amber-600/80 bg-amber-50 px-2 py-1 rounded">Still handle customer</span>
                                                        ) : (
                                                            t.availability?.today?.slice(0,3).map(time => (
                                                                <span key={time} className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                                                                    {time}
                                                                </span>
                                                            ))
                                                        )}`;
                                                        
    const newStatusLabel = `{t.status === 'Off' ? (
                                                            <span className="text-[10px] font-bold text-red-500/80 bg-red-50 px-2 py-1 rounded">Offline</span>
                                                        ) : t.status === 'Busy' ? (
                                                            <span className="text-[10px] font-bold text-amber-600/90 bg-amber-50 px-2 py-1 rounded">Online • Available at {t.availableAt || '13:00'}</span>
                                                        ) : (
                                                            <>
                                                                <span className="text-[10px] font-bold text-green-600/90 bg-green-50 px-2 py-1 rounded mr-1">Ready to accept jobs</span>
                                                                {t.availability?.today?.slice(0,2).map((time: string) => (
                                                                    <span key={time} className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                                                                        {time}
                                                                    </span>
                                                                ))}
                                                            </>
                                                        )}`;
    content = content.replace(oldStatusLabel, newStatusLabel);
    
    // Sometimes time: string is not imported or needed, let's just make sure it compiles by removing type if in tsx without issues or keeping it. The file is tsx so `time: string` is fine.

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

updateFile(pageFile);
updateFile(ritualFile);

// Dashboard Update
function updateDashboard(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Add availableAt state
    if (!content.includes('const [availableAt')) {
        content = content.replace(
            `const [status, setStatus] = useState('Online');`,
            `const [status, setStatus] = useState('Online');\n    const [availableAt, setAvailableAt] = useState('');`
        );
    }

    // Update status buttons to show time input
    const oldStatusButtons = `<div className="flex bg-surface rounded-full p-1 border border-border/50 shadow-inner">
                                                {['Online', 'Busy', 'Off'].map(s => (
                                                    <button 
                                                        key={s}
                                                        onClick={() => setStatus(s)}
                                                        className={\`px-4 py-2 rounded-full text-xs font-bold transition-all \${
                                                            status === s 
                                                                ? (s === 'Online' ? 'bg-green-500 text-white shadow-sm' : s === 'Busy' ? 'bg-amber-500 text-white shadow-sm' : 'bg-red-500 text-white shadow-sm')
                                                                : 'text-text-muted hover:text-primary hover:bg-black/5'
                                                        }\`}
                                                    >
                                                        {s === 'Busy' ? 'Still handle customer' : s === 'Off' ? 'Offline' : s}
                                                    </button>
                                                ))}
                                            </div>`;
                                            
    const newStatusButtons = `<div className="flex flex-col items-end gap-2">
                                                <div className="flex bg-surface rounded-full p-1 border border-border/50 shadow-inner">
                                                    {['Online', 'Busy', 'Off'].map(s => (
                                                        <button 
                                                            key={s}
                                                            onClick={() => setStatus(s)}
                                                            className={\`px-4 py-2 rounded-full text-xs font-bold transition-all \${
                                                                status === s 
                                                                    ? (s === 'Online' ? 'bg-green-500 text-white shadow-sm' : s === 'Busy' ? 'bg-amber-500 text-white shadow-sm' : 'bg-red-500 text-white shadow-sm')
                                                                    : 'text-text-muted hover:text-primary hover:bg-black/5'
                                                            }\`}
                                                        >
                                                            {s === 'Busy' ? 'Handling customer' : s === 'Off' ? 'Offline' : 'Ready to accept jobs'}
                                                        </button>
                                                    ))}
                                                </div>
                                                {status === 'Busy' && (
                                                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-top-2">
                                                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Available At:</span>
                                                        <input 
                                                            type="time" 
                                                            value={availableAt} 
                                                            onChange={e => setAvailableAt(e.target.value)} 
                                                            className="text-xs bg-transparent border-none focus:outline-none text-amber-900 font-bold w-20"
                                                        />
                                                    </div>
                                                )}
                                            </div>`;
                                            
    content = content.replace(oldStatusButtons, newStatusButtons);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

updateDashboard(dashboardFile);

