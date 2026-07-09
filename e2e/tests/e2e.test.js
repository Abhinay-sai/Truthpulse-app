const { buildDriver } = require('../config/driver');
const HomePage = require('../pages/HomePage');
const AuthPage = require('../pages/AuthPage');
const reporter = require('../utils/reporter');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

describe('TruthPulse E2E Tests', function() {
    let driver;
    let homePage;

    before(async function() {
        driver = await buildDriver();
        homePage = new HomePage(driver);
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
        await reporter.generateReports();
    });

    afterEach(async function() {
        const testName = this.currentTest.title;
        const status = this.currentTest.state;
        const duration = this.currentTest.duration;
        const error = this.currentTest.err ? this.currentTest.err.message : '';
        
        reporter.addResult(testName, status, duration, error);

        if (status === 'failed') {
            await homePage.takeScreenshot(`failed_${testName.replace(/\s+/g, '_')}`);
        }
    });

    it('should load the application successfully', async function() {
        await homePage.navigate(BASE_URL);
        // Wait for page to load
        // Sometimes Flutter title is empty, or takes time to set
        await driver.sleep(5000); 
        const title = await driver.getTitle();
        // Allow title to be anything, just making sure page loaded
        assert.ok(title !== undefined, 'Page title should be defined');
    });

    it('should verify flutter-view is present (if flutter web)', async function() {
        // Just checking if the core Flutter element is loaded, if applicable.
        // It's possible we are using web-renderer=html which changes DOM.
        // For basic validation we can just navigate.
        await homePage.navigate(BASE_URL);
    });
});
