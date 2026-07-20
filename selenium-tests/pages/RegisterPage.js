const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.nameInput = By.xpath("//input[@placeholder='Full Name' or @type='text']");
    this.emailInput = By.xpath("//input[@type='email']");
    this.passwordInput = By.xpath("//input[@type='password']");
    this.ageInput = By.xpath("//input[@type='number']");
    this.genderSelect = By.xpath("//select | //button[contains(text(), 'Gender')]");
    this.submitButton = By.xpath("//button[@type='submit' or contains(text(), 'Create')]");
    this.loginLink = By.xpath("//a[contains(@href, 'login') or contains(text(), 'Login') or contains(text(), 'Sign In')]");
  }

  async register(name, email, password, age) {
    await this.type(this.nameInput, name);
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    if (age) {
      await this.type(this.ageInput, age.toString());
    }
    await this.click(this.submitButton);
  }

  async clickLoginLink() {
    await this.click(this.loginLink);
  }
}

module.exports = RegisterPage;
