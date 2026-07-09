const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function buildDriver() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');
    // Ensure Chrome doesn't timeout unnecessarily on github actions
    options.addArguments('--disable-gpu');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    return driver;
}

module.exports = { buildDriver };
