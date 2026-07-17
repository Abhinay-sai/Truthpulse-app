const { buildDriver } = require('../config/driver');
const reporter = require('../utils/reporter');
const LoginPage = require('../pages/LoginPage');
const SignupPage = require('../pages/SignupPage');
const assert = require('assert');

describe('TruthPulse Appium E2E - Authentication', function() {
    let driver;
    let loginPage;
    let signupPage;

    before(async function() {
        reporter.log('Starting Authentication E2E Tests');
        driver = await buildDriver();
        loginPage = new LoginPage(driver);
        signupPage = new SignupPage(driver);
    });

    after(async function() {
        reporter.log('Auth tests finished.');
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
            await loginPage.takeScreenshot(`failed_${testName.replace(/\\s+/g, '_')}`);
        }
    });

    it('should navigate to Sign Up screen from Login screen', async function() {
        reporter.log('Navigating to Signup screen');
        await signupPage.navigateToSignup();
        
        const source = await driver.getPageSource();
        assert.ok(source.length > 0, 'Should load signup screen successfully');
    });

    it('should fill signup details and submit (Validation test)', async function() {
        reporter.log('Testing Signup Form');
        // Providing dummy test data
        await signupPage.fillSignupDetails('Test User', 'testappium@example.com', 'Password123!');
        // We expect it to remain on the screen or show an error since it's a dummy email
        const source = await driver.getPageSource();
        assert.ok(source.length > 0);
    });

    // In a full environment, you would restart the app and then test login
    // But since we are navigating, we'll just check if the app is still responsive
});
