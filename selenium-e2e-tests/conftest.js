const { createDriver } = require('./config');
const reporter = require('./utils/reporter');

let driver;

exports.mochaHooks = {
    async beforeAll() {
        console.log('[Selenium] Starting test execution...');
        try {
            driver = await createDriver();
            global.driver = driver;
            console.log('[Selenium] WebDriver session established successfully.');
        } catch (error) {
            console.error('[Selenium] Failed to start driver session:', error);
            throw error;
        }
    },

    async afterAll() {
        console.log('[Selenium] Test execution finished. Generating reports...');
        if (driver) {
            await driver.quit();
        }
        await reporter.generateReports();
    },

    async afterEach() {
        const testName = this.currentTest ? this.currentTest.title : 'test';
        const status = this.currentTest ? this.currentTest.state : 'passed';
        const duration = this.currentTest ? (this.currentTest.duration || 0) : 0;
        const error = this.currentTest && this.currentTest.err ? this.currentTest.err.message : '';
        
        reporter.addResult(testName, status, duration, error);

        if (status === 'failed' && global.driver) {
            try {
                const fs = require('fs');
                const path = require('path');
                const screenshotDir = path.join(__dirname, 'screenshots');
                if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);
                
                const screenshotPath = path.join(screenshotDir, `failed_${testName.replace(/\s+/g, '_')}.png`);
                const image = await global.driver.takeScreenshot();
                fs.writeFileSync(screenshotPath, image, 'base64');
                console.log(`[Selenium] Saved screenshot for failed test: ${screenshotPath}`);
            } catch (err) {
                console.error('[Selenium] Error saving screenshot:', err);
            }
        }
    }
};
