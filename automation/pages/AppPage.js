const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class AppPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver);
    this.baseUrl = baseUrl;
  }

  async load(path = '/') {
    await this.navigateTo(`${this.baseUrl}${path}`);
  }

  async getPageTitle() {
    return await this.driver.getTitle();
  }

  async checkElementExists(selector, strategy = 'css') {
    try {
      let locator = strategy === 'css' ? By.css(selector) : By.xpath(selector);
      await this.waitForElement(locator, 5000);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = AppPage;
