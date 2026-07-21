const { By, until } = require('selenium-webdriver');
const fs = require('fs');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async navigateTo(url) {
    await this.driver.get(url);
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async click(locator) {
    const element = await this.waitForElement(locator);
    await element.click();
  }

  async type(locator, text) {
    const element = await this.waitForElement(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator) {
    const element = await this.waitForElement(locator);
    return await element.getText();
  }

  async isElementPresent(locator, timeout = 5000) {
    try {
      await this.driver.wait(until.elementLocated(locator), timeout);
      return true;
    } catch (error) {
      return false;
    }
  }

  async takeScreenshot(filename) {
    const image = await this.driver.takeScreenshot();
    fs.writeFileSync(`./screenshots/${filename}.png`, image, 'base64');
  }
}

module.exports = BasePage;
