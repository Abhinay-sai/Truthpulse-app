const BasePage = require('./BasePage');

class SignupPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    async navigateToSignup() {
        // In the login screen, there's a "Create Account" text.
        // We will try to find it by text or content-desc.
        const els = await this.driver.$$('//*[contains(@text, "Create Account") or contains(@content-desc, "Create Account")]');
        if (els.length > 0) {
            await els[0].click();
        }
        await this.driver.pause(2000);
    }

    async fillSignupDetails(name, email, password) {
        const editTexts = await this.driver.$$('android.widget.EditText');
        if (editTexts.length >= 3) {
            await editTexts[0].setValue(name);
            await editTexts[1].setValue(email);
            await editTexts[2].setValue(password);
        }
        
        const buttons = await this.driver.$$('android.widget.Button');
        if (buttons.length > 0) {
            await buttons[0].click();
        }
        
        await this.driver.pause(3000); // Wait for API
    }
}

module.exports = SignupPage;
