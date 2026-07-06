const fs = require("fs");
const path = require("path");

function processPageFiles(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, "utf8");

    const oldLogicRegex = /const isFuture = formData\.date && formData\.date !== todayStr;\s*const t = \{ \.\.\.rawT \} as any;\s*if \(isFuture && \(\!t\.availableDate \|\| t\.availableDate !== formData\.date\)\) \{\s*t\.status = 'Online';\s*\} else if \(t\.status === 'Busy' && t\.availableAt\) \{\s*const now = new Date\(\);\s*const currentTimeStr = now\.toTimeString\(\)\.split\(' '\)\[0\]\.substring\(0, 5\);\s*if \(\!formData\.date \|\| formData\.date === todayStr\) \{\s*if \(currentTimeStr >= t\.availableAt\) \{\s*t\.status = 'Online';\s*\}\s*\}\s*\}/g;

    const newLogic = `const isFuture = formData.date && formData.date !== todayStr;
                                            const t = { ...rawT } as any;
                                            if (isFuture && (!t.availableDate || t.availableDate !== formData.date)) {
                                                t.status = 'Online';
                                            } else if (t.status === 'Busy' && t.availableAt) {
                                                if (formData.time && formData.time >= t.availableAt) {
                                                    t.status = 'Online';
                                                } else {
                                                    const now = new Date();
                                                    const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);
                                                    if ((!formData.date || formData.date === todayStr) && currentTimeStr >= t.availableAt) {
                                                        t.status = 'Online';
                                                    }
                                                }
                                            }`;

    code = code.replace(oldLogicRegex, newLogic);
    
    fs.writeFileSync(filePath, code);
    console.log("Updated " + filePath);
}

processPageFiles("src/app/page.tsx");
processPageFiles("src/app/rituals/[id]/page.tsx");
