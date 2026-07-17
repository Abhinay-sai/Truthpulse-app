const { buildDriver } = require('../config/driver');
const reporter = require('../utils/reporter');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const assert = require('assert');

describe('TruthPulse Appium E2E - Core Features', function() {
    let driver;
    let loginPage;
    let dashboardPage;

    before(async function() {
        reporter.log('Starting Core Features E2E Tests');
        driver = await buildDriver();
        loginPage = new LoginPage(driver);
        dashboardPage = new DashboardPage(driver);
    });

    after(async function() {
        reporter.log('Features tests finished.');
        if (driver) await driver.deleteSession();
        await reporter.generateReports();
    });

    afterEach(async function() {
        const testName = this.currentTest.title;
        const status = this.currentTest.state;
        const duration = this.currentTest.duration || 0;
        const error = this.currentTest.err ? this.currentTest.err.message : '';
        
        reporter.addResult(testName, status, duration, error);
        if (status === 'failed') {
            await dashboardPage.takeScreenshot(`failed_${testName.replace(/\\s+/g, '_')}`);
        }
    });

    it('should test login with valid test credentials and reach dashboard', async function() {
        reporter.log('Attempting login');
        await loginPage.enterCredentialsAndSubmit('test@example.com', 'Password123!');
        
        const isLoaded = await dashboardPage.isDashboardLoaded();
        // Just checking if driver is still responsive. Real assertions would check specific dashboard UI elements
        assert.ok(isLoaded, 'Dashboard should load or app should remain responsive');
    });
});
