const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.profileLink = By.xpath("//nav//a[contains(@href, 'profile') or contains(text(), 'Profile')]");
    this.chatLink = By.xpath("//nav//a[contains(@href, 'chatbot') or contains(text(), 'Chat')]");
    this.analyzeLink = By.xpath("//nav//a[contains(@href, 'analyze') or contains(text(), 'Analyze')]");
    this.historyLink = By.xpath("//nav//a[contains(@href, 'history') or contains(text(), 'History')]");
    this.settingsLink = By.xpath("//a[contains(@href, 'settings') or contains(text(), 'Settings')]");
  }

  async getGreetingText() {
    const bodyText = await this.getBodyText();
    return bodyText;
  }

  async navigateToProfile() {
    await this.click(this.profileLink);
    await this.wait(until.urlContains('profile'), 5000);
  }

  async navigateToChat() {
    await this.click(this.chatLink);
    await this.wait(until.urlContains('chatbot'), 5000);
  }

  async navigateToAnalyze() {
    await this.click(this.analyzeLink);
    await this.wait(until.urlContains('analyze'), 5000);
  }

  async navigateToHistory() {
    await this.click(this.historyLink);
    await this.wait(until.urlContains('history'), 5000);
  }

  async navigateToSettings() {
    await this.click(this.settingsLink);
    await this.wait(until.urlContains('settings'), 5000);
  }
}

module.exports = DashboardPage;
