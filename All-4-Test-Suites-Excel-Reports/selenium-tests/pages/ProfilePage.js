const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class ProfilePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.profileCard = By.xpath("//*[contains(@class, 'card') or contains(@class, 'container')]");
  }

  async isProfileLoaded() {
    const cards = await this.findElements(this.profileCard);
    return cards.length > 0;
  }
}

module.exports = ProfilePage;
