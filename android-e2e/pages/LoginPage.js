const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    async enterCredentialsAndSubmit(email, password) {
        // Wait for page to load
        await this.driver.pause(2000);
        
        // Find all EditTexts on the screen
        const editTexts = await this.driver.$$('android.widget.EditText');
        if (editTexts.length >= 2) {
            await editTexts[0].setValue(email);
            await editTexts[1].setValue(password);
        } else {
            console.log('[LoginPage] WARNING: Could not find 2 EditText fields (Email and Password). Elements found:', editTexts.length);
        }
        
        // Find and click the Sign In button
        const buttons = await this.driver.$$('android.widget.Button');
        if (buttons.length > 0) {
            // Usually the main submit button is the first or second button.
            // "Sign In" is often the first elevated button.
            await buttons[0].click();
        } else {
            console.log('[LoginPage] WARNING: Could not find Sign In button');
        }
        
        await this.driver.pause(3000); // Wait for response
    }
}

module.exports = LoginPage;
