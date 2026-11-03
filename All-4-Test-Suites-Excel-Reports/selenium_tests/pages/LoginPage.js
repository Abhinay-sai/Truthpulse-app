const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.emailField = By.id('email');
    this.passwordField = By.id('password');
    this.loginButton = By.id('login-button');
    this.registerLink = By.xpath("//a[contains(@href, 'register') or contains(text(), 'Register') or contains(text(), 'Sign up')]");
  }

  async login(email, password) {
    await this.type(this.emailField, email);
    await this.type(this.passwordField, password);
    await this.click(this.loginButton);
  }

  async isLoginPageLoaded() {
    const emailPresent = await this.findElements(this.emailField);
    return emailPresent.length > 0;
  }
}

module.exports = LoginPage;
