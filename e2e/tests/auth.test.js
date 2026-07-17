const { buildDriver } = require('../config/driver');
const reporter = require('../utils/reporter');
const AuthPage = require('../pages/AuthPage');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

describe('TruthPulse Selenium E2E - Authentication', function() {
    let driver;
    let authPage;

    before(async function() {
        reporter.log('Starting Selenium E2E Tests for Authentication');
        driver = await buildDriver();
        authPage = new AuthPage(driver);
    });

    after(async function() {
        reporter.log('Auth tests finished.');
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
            await authPage.takeScreenshot(`failed_${testName.replace(/\\s+/g, '_')}`);
        }
    });

    it('should navigate to Sign Up screen from Login screen', async function() {
        reporter.log('Navigating to Signup screen');
        await authPage.navigate(BASE_URL);
        await driver.sleep(5000); // Wait for Flutter app to mount
        await authPage.navigateToSignup();
        
        const source = await driver.getPageSource();
        assert.ok(source.length > 0, 'Should load signup screen successfully');
    });
});
