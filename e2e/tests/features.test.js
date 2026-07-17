const { buildDriver } = require('../config/driver');
const reporter = require('../utils/reporter');
const AuthPage = require('../pages/AuthPage');
const DashboardPage = require('../pages/DashboardPage');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

describe('TruthPulse Selenium E2E - Core Features', function() {
    let driver;
    let authPage;
    let dashboardPage;

    before(async function() {
        reporter.log('Starting Selenium E2E Tests for Features');
        driver = await buildDriver();
        authPage = new AuthPage(driver);
        dashboardPage = new DashboardPage(driver);
    });

    after(async function() {
        reporter.log('Features tests finished.');
        if (driver) await driver.quit();
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
        await authPage.navigate(BASE_URL);
        await driver.sleep(5000); // Wait for Flutter app to mount

        await authPage.enterCredentialsAndSubmit('test@example.com', 'Password123!');
        
        const isLoaded = await dashboardPage.isDashboardLoaded();
        assert.ok(isLoaded, 'Dashboard canvas or glass pane should be rendered');
    });
});
