const BasePage = require('./BasePage');
const { By } = require('selenium-webdriver');

class DashboardPage extends BasePage {
    constructor(driver) {
        super(driver);
    }

    async isDashboardLoaded() {
        await this.driver.sleep(2000);
        // Check if there are multiple semantic nodes or a large flt-glass-pane
        const glassPane = await this.driver.findElements(By.css('flt-glass-pane, canvas'));
        return glassPane.length > 0;
    }
}

module.exports = DashboardPage;
