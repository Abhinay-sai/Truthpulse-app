const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    async isDashboardLoaded() {
        await this.driver.pause(2000);
        // We can check if specific dashboard elements exist or simply check page source
        const source = await this.driver.getPageSource();
        // Return true if page has substantial content loaded
        return source.length > 500;
    }
}

module.exports = DashboardPage;
