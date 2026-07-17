const BasePage = require('./BasePage');

const { By, until } = require('selenium-webdriver');

class AuthPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    async enterCredentialsAndSubmit(email, password) {
        await this.driver.sleep(2000);
        
        // Find inputs - Flutter web usually renders <input> inside flt-semantics when active
        const inputs = await this.driver.findElements(By.css('input'));
        if (inputs.length >= 2) {
            await inputs[0].sendKeys(email);
            await inputs[1].sendKeys(password);
        } else {
            console.log('[AuthPage] WARNING: Could not find 2 input fields');
        }
        
        // Try to find sign in button (could be a button or flt-semantics node)
        const buttons = await this.driver.findElements(By.css('flt-semantics[role="button"], button'));
        if (buttons.length > 0) {
            await buttons[0].click();
        }
        
        await this.driver.sleep(3000);
    }

    async navigateToSignup() {
        const createAccountEls = await this.driver.findElements(By.xpath('//*[contains(text(), "Create Account") or contains(@aria-label, "Create Account")]'));
        if (createAccountEls.length > 0) {
            await createAccountEls[0].click();
        }
        await this.driver.sleep(2000);
    }
}

module.exports = AuthPage;
