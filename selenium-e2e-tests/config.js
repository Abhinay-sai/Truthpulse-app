const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuration for WebDriver
const driverConfig = {
    browser: 'chrome',
    headless: true // Set to false if you want to see the browser UI
};

async function createDriver() {
    let options = new chrome.Options();
    if (driverConfig.headless) {
        options.addArguments('--headless');
    }
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    const driver = await new Builder()
        .forBrowser(driverConfig.browser)
        .setChromeOptions(options)
        .build();
    
    return driver;
}

module.exports = { createDriver, driverConfig };
