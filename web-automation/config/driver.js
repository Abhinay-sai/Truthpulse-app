const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function buildDriver() {
    let options = new chrome.Options();
    
    // Mandatory settings for GitHub Actions headless execution
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    let driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
        
    return driver;
}

module.exports = { buildDriver };
