const { By, until } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async navigateTo(url) {
    await this.driver.get(url);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async findElement(locator) {
    return await this.driver.findElement(locator);
  }

  async findElements(locator) {
    return await this.driver.findElements(locator);
  }

  async click(locator) {
    const el = await this.driver.wait(until.elementLocated(locator), 8000);
    await this.driver.wait(until.elementIsVisible(el), 5000);
    await el.click();
  }

  async type(locator, text) {
    const el = await this.driver.wait(until.elementLocated(locator), 8000);
    await this.driver.wait(until.elementIsVisible(el), 5000);
    await el.clear();
    await el.sendKeys(text);
  }

  async getBodyText() {
    const body = await this.driver.wait(until.elementLocated(By.tagName('body')), 8000);
    return await body.getText();
  }

  async wait(condition, timeout = 10000) {
    return await this.driver.wait(condition, timeout);
  }

  async sleep(ms) {
    await this.driver.sleep(ms);
  }
}

module.exports = BasePage;
