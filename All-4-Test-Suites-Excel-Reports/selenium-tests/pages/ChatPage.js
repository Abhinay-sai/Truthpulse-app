const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class ChatPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.chatInput = By.xpath("//input[@placeholder='Ask Vastra...' or @type='text']");
    this.sendButton = By.xpath("//button[@type='submit' or contains(@class, 'send')]");
  }

  async sendMessage(message) {
    await this.type(this.chatInput, message);
    await this.click(this.sendButton);
  }
}

module.exports = ChatPage;
