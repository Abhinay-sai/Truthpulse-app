const fs = require('fs');
const path = require('path');

const distributions = {
    Authentication: 40,
    Authorization: 30,
    Registration: 20,
    ProfileManagement: 20,
    Navigation: 30,
    Dashboard: 20,
    Forms: 40,
    CRUD: 40,
    Search: 20,
    Filters: 20,
    InputValidation: 40,
    ErrorHandling: 20,
    SessionManagement: 20,
    Notifications: 20,
    FileUpload: 20,
    OfflineHandling: 10,
    Accessibility: 20,
    ResponsiveUI: 10,
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
                testName: `Verify ${module} functionality ${i}`,
                priority: i % 5 === 0 ? 'High' : 'Medium',
                preconditions: 'App launched successfully',
                testSteps: '1. Navigate to module 2. Perform action 3. Verify result',
                testData: 'dummy_data',
                expectedResult: 'Action completes successfully',
                action: module // Maps to an action in our test runner
            });
            idCounter++;
        }
    }
    
    const dir = __dirname;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(path.join(dir, 'test_data.json'), JSON.stringify(tests, null, 2));
    console.log(`Successfully generated ${tests.length} test cases in test_data.json`);
}

generateTests();
