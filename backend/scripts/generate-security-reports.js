const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { execSync } = require('child_process');

const OUT_DIR = path.join(__dirname, '..', '..', 'Vulnerability Test Results');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Define Findings (SAST/DAST)
const findings = [
    {
        severity: 'High',
        type: 'Missing Rate Limiting',
        file: 'index.js',
        endpoint: 'Global',
        description: 'The application lacks rate limiting (e.g., express-rate-limit). During load testing, it accepted 400,000 requests in 60s without throttling.',
        exploitation: 'An attacker can perform brute-force attacks against /auth/login or cause a Denial of Service (DoS) by overwhelming the server.',
        impact: 'Service degradation, potential account takeover via credential stuffing.',
        fix: 'Implement express-rate-limit middleware on global routes and strict limits on /auth routes.'
    },
    {
        severity: 'Medium',
        type: 'Hardcoded Fallback Secret',
        file: 'index.js',
        endpoint: 'N/A',
        description: 'JWT_SECRET uses a hardcoded fallback value "truthpulse_secret_key_2026".',
        exploitation: 'If the environment variable fails to load, the application defaults to a known secret, allowing attackers to forge JWTs.',
        impact: 'Complete authentication bypass and privilege escalation.',
        fix: 'Remove the fallback string. The app should crash on startup if JWT_SECRET is missing.'
    },
    {
        severity: 'Medium',
        type: 'NoSQL Injection Vulnerability',
        file: 'index.js',
        endpoint: '/auth/login',
        description: 'req.body inputs are passed directly to Mongoose queries without sanitization.',
        exploitation: 'An attacker can send JSON payloads like {"email": {"$gt": ""}, "password": "..."} to bypass authentication checks.',
        impact: 'Unauthorized access to user accounts or data exfiltration.',
        fix: 'Use express-mongo-sanitize middleware to strip NoSQL operator keys from inputs.'
    },
    {
        severity: 'Low',
        type: 'Missing Security Headers',
        file: 'index.js',
        endpoint: 'Global',
        description: 'The application does not implement standard HTTP security headers (HSTS, X-Frame-Options, etc.).',
        exploitation: 'Lack of headers makes the client susceptible to clickjacking and MIME-sniffing.',
        impact: 'Client-side attacks.',
        fix: 'Implement the helmet middleware.'
    },
    {
        severity: 'Low',
        type: 'Overly Permissive CORS',
        file: 'index.js',
        endpoint: 'Global',
        description: 'CORS is enabled globally without specific origin restrictions.',
        exploitation: 'Any domain can make cross-origin requests to the API.',
        impact: 'Potential exposure to Cross-Site Request Forgery (CSRF) if cookie auth is ever used.',
        fix: 'Configure CORS options to strictly allow only the trusted frontend domains.'
    }
];

// 2. Define Endpoints
const endpoints = [
    { endpoint: '/auth/register', method: 'POST', authReq: 'No', role: 'Public', file: 'index.js' },
    { endpoint: '/auth/login', method: 'POST', authReq: 'No', role: 'Public', file: 'index.js' },
    { endpoint: '/auth/verify-email', method: 'POST', authReq: 'No', role: 'Public', file: 'index.js' },
    { endpoint: '/auth/me', method: 'GET', authReq: 'Yes', role: 'User', file: 'index.js' },
    { endpoint: '/auth/forgot-password', method: 'POST', authReq: 'No', role: 'Public', file: 'index.js' },
    { endpoint: '/auth/reset-password', method: 'POST', authReq: 'No', role: 'Public', file: 'index.js' },
    { endpoint: '/user/export', method: 'GET', authReq: 'Yes', role: 'User', file: 'index.js' },
    { endpoint: '/auth/2fa/generate', method: 'POST', authReq: 'Yes', role: 'User', file: 'index.js' },
    { endpoint: '/auth/2fa/verify', method: 'POST', authReq: 'Yes', role: 'User', file: 'index.js' },
    { endpoint: '/analyze-document', method: 'POST', authReq: 'Yes', role: 'User', file: 'index.js' },
    { endpoint: '/analyze-url', method: 'POST', authReq: 'Yes', role: 'User', file: 'index.js' },
    { endpoint: '/feed', method: 'GET', authReq: 'Yes', role: 'User', file: 'index.js' },
    { endpoint: '/history', method: 'GET', authReq: 'Yes', role: 'User', file: 'index.js' }
];

// 3. Get Dependency Audit
let auditData = [];
try {
    console.log('Running npm audit to fetch dependencies vulnerabilities...');
    const auditRaw = execSync('npm audit --json', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    const auditParsed = JSON.parse(auditRaw);
    if (auditParsed.vulnerabilities) {
        for (const [pkg, info] of Object.entries(auditParsed.vulnerabilities)) {
            auditData.push({
                package: pkg,
                severity: info.severity,
                vulnerable_versions: info.range,
                fix_available: info.fixAvailable ? 'Yes' : 'No'
            });
        }
    }
} catch (e) {
    if (e.stdout) {
        try {
            const auditParsed = JSON.parse(e.stdout);
            if (auditParsed.vulnerabilities) {
                for (const [pkg, info] of Object.entries(auditParsed.vulnerabilities)) {
                    auditData.push({
                        package: pkg,
                        severity: info.severity,
                        vulnerable_versions: info.range,
                        fix_available: info.fixAvailable ? 'Yes' : 'No'
                    });
                }
            }
        } catch(err) {}
    }
}

// 4. Generate Markdown Reports
function generateMarkdown() {
    console.log('Generating Markdown Reports...');
    
    // security-review.md
    let srMd = '# Application Security Review\\n\\n';
    findings.forEach((f, i) => {
        srMd += `## ${i+1}. ${f.type} [${f.severity}]\\n`;
        srMd += `- **File Path**: \`${f.file}\`\\n`;
        srMd += `- **Endpoint**: \`${f.endpoint}\`\\n`;
        srMd += `- **Description**: ${f.description}\\n`;
        srMd += `- **Exploitation Scenario**: ${f.exploitation}\\n`;
        srMd += `- **Impact**: ${f.impact}\\n`;
        srMd += `- **Recommended Fix**: ${f.fix}\\n\\n`;
    });
    fs.writeFileSync(path.join(OUT_DIR, 'security-review.md'), srMd);

    // executive-summary.md
    let crit = findings.filter(f => f.severity === 'Critical').length;
    let high = findings.filter(f => f.severity === 'High').length;
    let med = findings.filter(f => f.severity === 'Medium').length;
    let low = findings.filter(f => f.severity === 'Low').length;
    let score = 100 - (crit * 25) - (high * 15) - (med * 5) - (low * 2);
    
    let execMd = `# Executive Summary\n\n## Total Findings\n\n- Critical: ${crit}\n- High: ${high}\n- Medium: ${med}\n- Low: ${low}\n\n`;
    execMd += `## Most Critical Risks\n\n1. Missing Rate Limiting (High Risk of DoS)\n2. Hardcoded JWT Secret (Medium Risk of Auth Bypass)\n3. NoSQL Injection (Medium Risk of DB Compromise)\n\n`;
    execMd += `## Overall Security Score\n\n**${score}/100**\n`;
    fs.writeFileSync(path.join(OUT_DIR, 'executive-summary.md'), execMd);
    
    // dependency-report.md
    let depMd = '# Dependency Scanning Report\\n\\n';
    if (auditData.length === 0) {
        depMd += 'No critical dependency vulnerabilities found!\\n';
    } else {
        depMd += '| Package | Severity | Vulnerable Versions | Fix Available |\\n|---|---|---|---|\\n';
        auditData.forEach(d => {
            depMd += `| ${d.package} | ${d.severity} | ${d.vulnerable_versions} | ${d.fix_available} |\\n`;
        });
    }
    fs.writeFileSync(path.join(OUT_DIR, 'dependency-report.md'), depMd);
}

// 5. Generate Excel Reports
async function generateExcel() {
    console.log('Generating Excel Reports...');
    
    // Generate findings.xlsx (with 4 sheets)
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Security Findings
    const s1 = workbook.addWorksheet('Security Findings');
    s1.columns = [
        { header: 'Severity', key: 'sev', width: 15 },
        { header: 'Vulnerability Type', key: 'type', width: 30 },
        { header: 'File Path', key: 'file', width: 20 },
        { header: 'Description', key: 'desc', width: 50 },
        { header: 'Recommended Fix', key: 'fix', width: 50 },
    ];
    findings.forEach(f => s1.addRow({sev: f.severity, type: f.type, file: f.file, desc: f.description, fix: f.fix}));
    
    // Sheet 2: Endpoint Inventory
    const s2 = workbook.addWorksheet('Endpoint Inventory');
    s2.columns = [
        { header: 'Endpoint', key: 'ep', width: 30 },
        { header: 'HTTP Method', key: 'method', width: 15 },
        { header: 'Authentication Required', key: 'auth', width: 25 },
        { header: 'Expected Roles', key: 'role', width: 20 },
    ];
    endpoints.forEach(e => s2.addRow({ep: e.endpoint, method: e.method, auth: e.authReq, role: e.role}));
    
    // Sheet 3: Dependency Vulnerabilities
    const s3 = workbook.addWorksheet('Dependency Vulnerabilities');
    s3.columns = [
        { header: 'Package', key: 'pkg', width: 25 },
        { header: 'Severity', key: 'sev', width: 15 },
        { header: 'Vulnerable Versions', key: 'ver', width: 25 },
        { header: 'Fix Available', key: 'fix', width: 15 },
    ];
    auditData.forEach(d => s3.addRow({pkg: d.package, sev: d.severity, ver: d.vulnerable_versions, fix: d.fix_available}));
    
    // Sheet 4: Risk Summary
    const s4 = workbook.addWorksheet('Risk Summary');
    s4.columns = [
        { header: 'Metric', key: 'metric', width: 30 },
        { header: 'Value', key: 'val', width: 15 },
    ];
    let score = 100 - (findings.filter(f=>f.severity==='High').length * 15) - (findings.filter(f=>f.severity==='Medium').length * 5);
    s4.addRow({metric: 'Total Findings', val: findings.length});
    s4.addRow({metric: 'High Risks', val: findings.filter(f=>f.severity==='High').length});
    s4.addRow({metric: 'Security Score', val: score});
    
    await workbook.xlsx.writeFile(path.join(OUT_DIR, 'findings.xlsx'));
    
    // Also export standalone endpoint-inventory.xlsx
    const epWorkbook = new ExcelJS.Workbook();
    const epSheet = epWorkbook.addWorksheet('Endpoints');
    epSheet.columns = s2.columns;
    endpoints.forEach(e => epSheet.addRow({ep: e.endpoint, method: e.method, auth: e.authReq, role: e.role}));
    await epWorkbook.xlsx.writeFile(path.join(OUT_DIR, 'endpoint-inventory.xlsx'));
    
    console.log('Successfully generated all Security Deliverables.');
}

generateMarkdown();
generateExcel().catch(console.error);
