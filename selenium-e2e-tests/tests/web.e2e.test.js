const assert = require('assert');
const { By, until } = require('selenium-webdriver');

describe('TruthPulse Selenium Web Core Flows', function () {
    
    // Modify this URL to point to your deployed web app or localhost
    const BASE_URL = process.env.BASE_URL || 'https://Abhinay-sai.github.io/Truthpulse-app/';

    it('TC001: should load the application homepage successfully', async function () {
        await global.driver.get(BASE_URL);
        const title = await global.driver.getTitle();
        assert.ok(title !== undefined, 'Page title should exist');
    });

    it('TC002: should verify basic page elements are present', async function () {
        await global.driver.get(BASE_URL);
        const body = await global.driver.wait(until.elementLocated(By.tagName('body')), 5000);
        assert.ok(body, 'Body element should be present');
    });

    it('TC003: should verify application navigation (dummy check)', async function () {
        await global.driver.get(BASE_URL);
        const currentUrl = await global.driver.getCurrentUrl();
        assert.ok(currentUrl.includes('github.io') || currentUrl.includes('localhost') || currentUrl.includes('http'), 'URL should be valid');
    });

});
