const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/env.config');
const fs = require('fs');
const path = require('path');

async function getDriver() {
  const options = new chrome.Options();
  config.CHROME_OPTIONS.forEach(opt => options.addArguments(opt));
  
  if (config.HEADLESS) {
    options.addArguments('--headless');
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: config.TIMEOUT });
  return driver;
}

async function takeScreenshot(driver, testName) {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  const safeName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + Date.now();
  const filename = `${safeName}.png`;
  const filePath = path.join(screenshotsDir, filename);
  
  try {
    const image = await driver.takeScreenshot();
    fs.writeFileSync(filePath, image, 'base64');
    return path.relative(path.join(__dirname, '..'), filePath);
  } catch (e) {
    return null;
  }
}

module.exports = {
  getDriver,
  takeScreenshot
};
