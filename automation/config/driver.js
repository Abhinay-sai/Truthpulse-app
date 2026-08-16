const { Builder, Browser } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

class DriverSetup {
  static async getDriver() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    const driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();

    // Ensure screenshots and logs directories exist
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs');
    }

    return driver;
  }

  static getBaseUrl() {
    const url = process.env.BASE_URL || "https://Abhinay-sai.github.io/Truthpulse-app/";
    return url;
  }
}

module.exports = DriverSetup;
