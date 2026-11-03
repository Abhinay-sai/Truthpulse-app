const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class SettingsPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.clearHistoryButton = By.xpath("//*[contains(text(), 'Clear History') or contains(text(), 'Delete')]");
    this.cancelOverlayButton = By.xpath("//button[contains(text(), 'Cancel') or contains(text(), 'No')]");
    this.accountTile = By.xpath("//*[contains(text(), 'Account') or contains(text(), 'Profile Settings')]");
    this.logoutButton = By.xpath("//*[contains(text(), 'Log out') or contains(text(), 'Logout')]");
  }

  async clickClearHistory() {
    await this.click(this.clearHistoryButton);
  }

  async cancelDialog() {
    try {
      await this.click(this.cancelOverlayButton);
    } catch (e) {
      try {
        await this.driver.switchTo().alert().dismiss();
      } catch (err) {}
    }
  }

  async clickAccountSettings() {
    await this.click(this.accountTile);
  }

  async logout() {
    await this.click(this.logoutButton);
    await this.wait(until.urlContains('login'), 8000);
  }
}

module.exports = SettingsPage;
