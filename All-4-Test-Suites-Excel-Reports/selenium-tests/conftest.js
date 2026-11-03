const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const reporter = require('./reporter');

const globalResults = [];

// Helper functions for easy element retrieval & assertions
async function initDriver() {
  const options = new chrome.Options();
  config.CHROME_OPTIONS.forEach(opt => options.addArguments(opt));
  
  // Set headless mode and disable security constraints for CI environments if specified
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless');
    options.addArguments('--disable-web-security');
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--user-data-dir=/tmp/chrome-user-data');
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: 10000 });
  return driver;
}

async function takeScreenshot(driver, name) {
  const screenshotsDir = path.join(__dirname, '..', 'Test Results', 'Screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  const filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.png`;
  const filePath = path.join(screenshotsDir, filename);
  
  try {
    const image = await driver.takeScreenshot();
    fs.writeFileSync(filePath, image, 'base64');
    return filename; // Return filename only so reporter can construct relative path relative to HTML report
  } catch (e) {
    return '';
  }
}

/**
 * Ensures the test user exists (registers if needed) then logs in.
 * Call from any before() hook that needs an authenticated session.
 */
async function ensureLoggedIn(driver) {
  // Try to navigate to the base URL (login page)
  await driver.get(config.BASE_URL);

  // Wait for the page to load
  await driver.sleep(1000);

  // Check if login form is present
  const emailFields = await driver.findElements(By.id('email'));
  if (emailFields.length === 0) {
    // Maybe already on dashboard — check
    const url = await driver.getCurrentUrl();
    if (url.includes('dashboard')) return;
    // Navigate to login explicitly
    await driver.get(config.BASE_URL + '/#/login');
    await driver.sleep(1000);
  }

  await driver.wait(until.elementLocated(By.id('email')), 8000);

  // First try to register the test user (idempotent — backend returns 409 if already exists)
  try {
    const backendBase = config.BACKEND_URL || 'http://localhost:5000';
    // We can't do fetch from Node directly in selenium context, so we do it via executeScript
    await driver.executeScript(`
      return fetch('${config.BACKEND_URL || 'http://localhost:5000'}/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '${config.TEST_NAME}',
          email: '${config.TEST_EMAIL}',
          password: '${config.TEST_PASSWORD}',
          gender: 'Male',
          age: 25
        })
      }).then(r => r.status).catch(() => 0);
    `);
    await driver.sleep(500);
  } catch (e) {
    // ignore registration attempt errors
  }

  // Now log in
  const emailEl = await driver.findElement(By.id('email'));
  const passEl = await driver.findElement(By.id('password'));
  const loginBtn = await driver.findElement(By.id('login-button'));

  await emailEl.clear();
  await emailEl.sendKeys(config.TEST_EMAIL);
  await passEl.clear();
  await passEl.sendKeys(config.TEST_PASSWORD);
  await loginBtn.click();

  await driver.wait(until.urlContains('dashboard'), 12000);
}

module.exports = {
  globalResults,
  initDriver,
  takeScreenshot,
  ensureLoggedIn,
  
  // Mocha hook integration
  mochaHooks: {
    afterAll: async function () {
      console.log('\nMocha afterAll: Compiling and generating Excel report...');
      await reporter.generateReport(globalResults);
    }
  }
};
