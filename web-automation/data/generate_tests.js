const fs = require('fs');
const path = require('path');

const distributions = {
    Authentication: 40,
    Authorization: 40,
    Navigation: 30,
    UIValidation: 50,
    Forms: 50,
    CRUD: 50,
    InputValidation: 40,
    ErrorHandling: 20,
    SessionManagement: 20,
    FileUpload: 20,
    Accessibility: 20,
    ResponsiveDesign: 20,
    PerformanceSmoke: 20,
    Regression: 50
};

function generateTests() {
    const tests = [];
    let idCounter = 1;
    
    for (const [module, count] of Object.entries(distributions)) {
        for (let i = 1; i <= count; i++) {
            const tcId = `TC_${module.toUpperCase()}_${String(i).padStart(3, '0')}`;
            tests.push({
                testId: tcId,
                module: module,
                testName: `Verify ${module} condition ${i} on LIVE deployment`,
                priority: i % 10 === 0 ? 'Critical' : 'Medium',
                preconditions: 'LIVE App URL is responding HTTP 200',
                testSteps: '1. Open URL 2. Interact with element 3. Verify assertions',
                expectedResult: 'System behaves as per requirements on LIVE env',
                action: module
            });
            idCounter++;
        }
    }
    
    const dir = __dirname;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(path.join(dir, 'test_data.json'), JSON.stringify(tests, null, 2));
    console.log(`Successfully generated ${tests.length} LIVE test cases in test_data.json`);
}

generateTests();
