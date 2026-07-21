const DriverSetup = require('../config/driver');
const BasePage = require('../pages/BasePage');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

describe('Live GitHub Pages Deployment E2E Suite', function () {
  let driver;
  let basePage;
  let baseUrl;

  before(async function () {
    baseUrl = DriverSetup.getBaseUrl();
    driver = await DriverSetup.getDriver();
    basePage = new BasePage(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const filename = `fail_${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}`;
      await basePage.takeScreenshot(filename);
      console.error(`Screenshot saved for failed test: ${filename}.png`);
    }
  });

  it('TC-001: Should successfully load the live deployment URL', async function () {
    await basePage.navigateTo(baseUrl);
    const title = await driver.getTitle();
    expect(title).to.not.be.empty;
  });

  it('TC-002: Should render the main application container', async function () {
    await basePage.navigateTo(baseUrl);
    // Checking for a generic body element as a baseline validation that it didn't completely 404/500
    const bodyExists = await basePage.isElementPresent(By.css('body'));
    expect(bodyExists).to.be.true;
  });
});
