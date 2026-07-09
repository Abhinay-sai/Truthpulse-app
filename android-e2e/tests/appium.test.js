const { buildDriver } = require('../config/driver');
const reporter = require('../utils/reporter');
const BasePage = require('../pages/BasePage');
const assert = require('assert');

describe('TruthPulse Appium E2E Tests', function() {
    let driver;
    let basePage;

    before(async function() {
        reporter.log('Starting Appium Test Suite Execution');
        driver = await buildDriver();
        basePage = new BasePage(driver);
    });

    after(async function() {
        reporter.log('Test Suite Execution Finished. Generating Reports...');
        if (driver) {
            await driver.deleteSession();
        }
        await reporter.generateReports();
    });

    afterEach(async function() {
        const testName = this.currentTest.title;
        const status = this.currentTest.state;
        const duration = this.currentTest.duration || 0;
        const error = this.currentTest.err ? this.currentTest.err.message : '';
        
        reporter.addResult(testName, status, duration, error);

        if (status === 'failed') {
            await basePage.takeScreenshot(`failed_${testName.replace(/\\s+/g, '_')}`);
        }
    });

    it('should launch the application successfully', async function() {
        reporter.log('Verifying application launch...');
        // Wait for some initial element or just wait a bit to ensure it mounted
        await driver.pause(5000);
        
        // Simple assertion to verify driver is active
        const source = await driver.getPageSource();
        reporter.log(`Page source length: ${source.length}`);
        assert.ok(source.length > 0, 'Page source should not be empty');
    });
});
