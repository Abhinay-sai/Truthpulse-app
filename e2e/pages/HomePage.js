const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class HomePage extends BasePage {
    constructor(driver) {
        super(driver);
        // Flutter web apps typically render elements inside flutter-view, but for simple tests
        // we might just check title or root nodes. Selenium on Flutter web is tricky (CanvasKit vs HTML).
        // Assuming default html renderer or flutter-view presence.
        this.flutterView = By.css('flutter-view');
    }

    async waitForLoad() {
        await this.findElement(this.flutterView, 15000);
    }
}

module.exports = HomePage;
